import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const dist = join(root, "dist");
const required = ["index.html", "src/styles.css", "src/app.js", "public/assets/hero-accounting-studio.png"];
const missing = required.filter((file) => !existsSync(join(root, file)));

if (missing.length) {
  console.error(`Missing files: ${missing.join(", ")}`);
  process.exit(1);
}

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

cpSync(join(root, "index.html"), join(dist, "index.html"));
cpSync(join(root, "src"), join(dist, "src"), { recursive: true });
cpSync(join(root, "public"), join(dist, "public"), { recursive: true });

console.log("Static site built to dist.");
