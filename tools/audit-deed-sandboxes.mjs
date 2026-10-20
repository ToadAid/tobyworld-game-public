import { readFile } from "node:fs/promises";
import { auditSandboxArchive, SIGN_NAMES } from "../src/sandbox-audit.mjs";

const archive = JSON.parse(await readFile(new URL("../data/lore-lands.json", import.meta.url), "utf8"));
const result = auditSandboxArchive(archive.lands);

if (result.failures.length) {
  console.error(`${result.failures.length} of ${result.total} generated sandboxes failed route audit.`);
  for (const failure of result.failures.slice(0, 20)) console.error(`#${Number(failure.id)}: ${failure.errors.join("; ")}`);
  process.exitCode = 1;
} else {
  console.log(`PASS: ${result.total} of ${result.total} generated sandboxes have reachable routes and completable objectives.`);
}

console.log(`Representative physical-phone matrix: ${result.representative.deeds.length} deeds cover every canonical sign value.`);
for (const deed of result.representative.deeds) {
  console.log(`#${Number(deed.id)}  ${SIGN_NAMES.map((name) => `${name}=${deed.signs[name]}`).join(" | ")}`);
  console.log(`  http://localhost:8080/?sandbox=1&deed=${Number(deed.id)}`);
}
if (result.representative.uncovered.length) {
  console.error(`Uncovered signs: ${result.representative.uncovered.join(", ")}`);
  process.exitCode = 1;
}
