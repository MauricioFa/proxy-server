import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import cors from "cors";
import "dotenv/config.js";

// Create Express Server
const app = express();

// Configuration
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "localhost";
const API_SERVICE_URL = process.env.API_SERVICE_URL;
const API_KEY = process.env.API_KEY;

app.use(
  cors({
    origin: "https://creative-fox-0ee353.netlify.app",
  })
);

// Proxy endpoints
app.use(
  "/api",
  createProxyMiddleware({
    target: `${API_SERVICE_URL}`,
    changeOrigin: true,
    pathRewrite(pathReq, req) {
      const pathname = pathReq.split("?")[0].replace("/api", "");
      let url = `${pathname}?key=${API_KEY}`;
      url = Object.entries(req.query).reduce(
        (newUrl, [key, value]) => `${newUrl}&${key}=${encodeURI(value)}`,
        url
      );
      return url;
    },
  })
);

// Start the Proxy
app.listen(PORT, HOST, () => {
  console.log(`Starting Proxy at ${HOST}:${PORT}`);
});
