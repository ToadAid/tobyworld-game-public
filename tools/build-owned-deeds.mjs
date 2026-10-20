import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { basename, join, resolve } from "node:path";

if (!process.env.TOBYWORLD_CURATED_LANDS || !process.env.TOBYWORLD_CANONICAL_ARCHIVE) {
  throw new Error("Set TOBYWORLD_CURATED_LANDS and TOBYWORLD_CANONICAL_ARCHIVE to permission-cleared source directories before rebuilding the owned-deed manifest.");
}
const curatedRoot = resolve(process.env.TOBYWORLD_CURATED_LANDS);
const canonicalRoot = resolve(process.env.TOBYWORLD_CANONICAL_ARCHIVE);
const outputDirectory = resolve("data");
const outputPath = join(outputDirectory, "owned-deeds.json");
const reportedOwnedDeedCount = 80;

function pngDetails(buffer) {
  if (buffer.subarray(1, 4).toString() !== "PNG") throw new Error("Expected a PNG source asset");
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
    sha256: createHash("sha256").update(buffer).digest("hex"),
  };
}

async function sourceRecord(root, file, role) {
  const buffer = await readFile(join(root, file));
  return { file, role, ...pngDetails(buffer) };
}

const files = (await readdir(curatedRoot)).sort();
const originalIds = files
  .map((file) => file.match(/^original-(\d{4})\.png$/)?.[1])
  .filter(Boolean);
const imaginedById = new Map();

for (const file of files) {
  const match = file.match(/^imagined-(\d{4})(?:-(v\d+))?\.png$/);
  if (!match) continue;
  const [, id, variant = "base"] = match;
  if (!imaginedById.has(id)) imaginedById.set(id, []);
  imaginedById.get(id).push({ file, variant });
}

const deeds = [];
for (const id of originalIds) {
  const imaginedFiles = imaginedById.get(id) ?? [];
  if (!imaginedFiles.length) throw new Error(`Owned original ${id} has no imagined counterpart`);

  const metadataFile = `${id}.json`;
  const archiveImageFile = `${id}.png`;
  const metadata = JSON.parse(await readFile(join(canonicalRoot, "metadata", metadataFile), "utf8"));
  const signs = Object.fromEntries(metadata.attributes.map(({ trait_type: type, value }) => [type, value]));
  const original = await sourceRecord(curatedRoot, `original-${id}.png`, "owned-original-reference");
  const imagined = [];
  for (const candidate of imaginedFiles) {
    imagined.push({
      ...(await sourceRecord(curatedRoot, candidate.file, "toadaid-imagined-world")),
      variant: candidate.variant,
      selected: candidate.variant === "base",
    });
  }
  const canonicalArchiveImage = await sourceRecord(join(canonicalRoot, "images"), archiveImageFile, "canonical-archive-image");

  deeds.push({
    id,
    name: metadata.name,
    signs,
    canonical: {
      metadataFile,
      archiveImage: canonicalArchiveImage,
      ipfsImage: metadata.image,
      externalUrl: metadata.external_url,
    },
    curated: {
      original,
      selectedImagined: imagined.find(({ selected }) => selected)?.file ?? imagined[0].file,
      imagined,
    },
  });
}

const unpairedImagined = [...imaginedById.keys()].filter((id) => !originalIds.includes(id));
if (unpairedImagined.length) throw new Error(`Imagined assets without owned originals: ${unpairedImagined.join(", ")}`);

const manifest = {
  schemaVersion: 1,
  purpose: "Local owned-deed source manifest for Tobyworld game development",
  provenanceRule: "Canonical metadata defines the five signs. Curated original and imagined images remain separate development references.",
  collectionContext: {
    reportedOwnedDeedCount,
    locallyPairedDeedCount: deeds.length,
    locallyAvailableImaginedVariantCount: deeds.reduce((count, deed) => count + Math.max(0, deed.curated.imagined.length - 1), 0),
  },
  sourceInputs: {
    curated: "TOBYWORLD_CURATED_LANDS",
    canonicalArchive: "TOBYWORLD_CANONICAL_ARCHIVE",
  },
  deeds,
};

await mkdir(outputDirectory, { recursive: true });
await writeFile(outputPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Wrote ${deeds.length} owned deed pairs to ${basename(outputPath)}`);
