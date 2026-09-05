import { copyFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const dist = resolve("dist");
await mkdir(dist, { recursive: true });
for (const f of ["index.html", "phonelayer.js"]) {
  await copyFile(resolve(f), resolve(dist, f));
}
console.log("dist ready:", dist);