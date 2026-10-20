import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve, join } from "node:path";

if (!process.env.TOBYWORLD_CANONICAL_ARCHIVE) {
  throw new Error("Set TOBYWORLD_CANONICAL_ARCHIVE to a permission-cleared canonical archive before rebuilding the lore index.");
}
const canonicalRoot = resolve(process.env.TOBYWORLD_CANONICAL_ARCHIVE);
const metadataDirectory = join(canonicalRoot, "metadata");
const outputDirectory = resolve("data");
const outputPath = join(outputDirectory, "lore-lands.json");
const files = (await readdir(metadataDirectory)).filter((file) => file.endsWith(".json")).sort();

const lands = [];
for (const file of files) {
  const metadata = JSON.parse(await readFile(join(metadataDirectory, file), "utf8"));
  const signs = Object.fromEntries(metadata.attributes.map((attribute) => [attribute.trait_type, attribute.value]));
  lands.push({
    id: file.replace(".json", ""),
    name: metadata.name,
    description: metadata.description,
    image: metadata.image,
    signs,
  });
}

const index = {
  schemaVersion: 1,
  generatedFrom: "Tobyworld Canonical Lore Land Deed Archive",
  contract: "0x0495601af6f86efb14c9d478ea46b2aa09cb164a",
  network: "base",
  count: lands.length,
  lands,
};

await mkdir(outputDirectory, { recursive: true });
await writeFile(outputPath, `${JSON.stringify(index)}\n`, "utf8");
console.log(`Wrote ${lands.length} canonical deeds to ${outputPath}`);
