import { serve } from "srvx/node";
import { readFile, stat } from "node:fs/promises";
import { join, extname } from "node:path";
import server from "./dist/server/server.js";

const PORT = Number(process.env.PORT) || 5000;
const HOST = process.env.HOST || "0.0.0.0";
const CLIENT_DIR = new URL("./dist/client/", import.meta.url);

const MIME = {
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".map": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

async function tryServeStatic(pathname) {
  if (!pathname || pathname === "/") return null;
  const safe = pathname.replace(/^\/+/, "").split("?")[0];
  if (safe.includes("..")) return null;
  const filePath = new URL(safe, CLIENT_DIR);
  try {
    const s = await stat(filePath);
    if (!s.isFile()) return null;
    const data = await readFile(filePath);
    const ext = extname(safe).toLowerCase();
    const ct = MIME[ext] || "application/octet-stream";
    const headers = { "content-type": ct };
    if (safe.startsWith("assets/")) {
      headers["cache-control"] = "public, max-age=31536000, immutable";
    }
    return new Response(data, { headers });
  } catch {
    return null;
  }
}

serve({
  port: PORT,
  hostname: HOST,
  fetch: async (request) => {
    const url = new URL(request.url);
    const staticRes = await tryServeStatic(url.pathname);
    if (staticRes) return staticRes;
    return server.fetch(request);
  },
});

console.log(`Server listening on http://${HOST}:${PORT}`);
