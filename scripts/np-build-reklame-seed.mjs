import { spawnSync } from "node:child_process";
import path from "node:path";

const scriptPath = path.join(
  process.cwd(),
  "scripts",
  "norsk-prompting-engine",
  "build-reklame-seed-data.mjs"
);
const result = spawnSync(process.execPath, [scriptPath, ...process.argv.slice(2)], {
  stdio: "inherit",
});

process.exit(result.status ?? 1);
