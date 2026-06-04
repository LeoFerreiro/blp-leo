import { createReadStream, cpSync, existsSync, mkdirSync, rmSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { createServer } from "node:http";

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

if (process.argv.includes("--serve")) {
  const port = Number(process.env.PORT || 4173);
  const mime = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".png": "image/png",
  };

  createServer((request, response) => {
    const url = new URL(request.url || "/", `http://${request.headers.host}`);
    const cleanPath = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, "");
    let filePath = join(dist, cleanPath === "/" ? "index.html" : cleanPath);

    if (!filePath.startsWith(dist) || !existsSync(filePath)) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }

    if (statSync(filePath).isDirectory()) {
      filePath = join(filePath, "index.html");
    }

    response.writeHead(200, { "Content-Type": mime[extname(filePath)] || "application/octet-stream" });
    createReadStream(filePath).pipe(response);
  }).listen(port, "127.0.0.1", () => {
    console.log(`Atlas Contable static preview running at http://127.0.0.1:${port}`);
  });
}
