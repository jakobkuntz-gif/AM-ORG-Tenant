import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, extname, normalize, sep } from "node:path";
import { fileURLToPath } from "node:url";

const PORT = Number(process.env.PORT || 5173);
const HOST = process.env.HOST || "127.0.0.1";
const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0] || "/");
  const relative = decoded.replace(/^\/+/, "");
  const resolved = normalize(join(root, relative || "."));
  const rootNormalized = normalize(root);
  if (resolved !== rootNormalized && !resolved.startsWith(`${rootNormalized}${sep}`)) {
    return null;
  }
  return resolved;
}

async function readStatic(filePath) {
  const data = await readFile(filePath);
  return {
    data,
    contentType: MIME_TYPES[extname(filePath).toLowerCase()] || "application/octet-stream",
  };
}

async function resolveRequest(urlPath) {
  const pathname = decodeURIComponent((urlPath || "/").split("?")[0] || "/");
  if (pathname === "/" || pathname.endsWith("/")) {
    const indexPath = join(root, "index.html");
    if (existsSync(indexPath)) return readStatic(indexPath);
  }

  const filePath = safePath(urlPath);
  if (!filePath) return null;

  if (existsSync(filePath)) {
    const fileStat = await stat(filePath);
    if (fileStat.isFile()) return readStatic(filePath);
  }

  const indexPath = join(root, "index.html");
  if (existsSync(indexPath)) return readStatic(indexPath);
  return null;
}

const server = createServer(async (req, res) => {
  try {
    const result = await resolveRequest(req.url || "/");
    if (!result) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }
    res.writeHead(200, { "Content-Type": result.contentType });
    res.end(result.data);
  } catch (error) {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Internal server error");
    console.error(error);
  }
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use. Stop the other server, then run:`);
    console.error("  npm run start:clickdummy");
    process.exit(1);
  }
  console.error(error);
  process.exit(1);
});

server.listen(PORT, HOST, () => {
  const url = `http://${HOST === "0.0.0.0" ? "localhost" : HOST}:${PORT}/`;
  console.log("");
  console.log("  Clickdummy ready");
  console.log(`  ${url}`);
  console.log("");
  console.log("  Standort example:");
  console.log(`  ${url}standort/mainz`);
  console.log("");
});
