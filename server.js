const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const TARGET = process.env.TARGET || '';

if (!TARGET) {
  // Fail loud if misconfigured rather than silently 404.
  app.all('*', (_req, res) => res.status(500).send('proxy: TARGET env not set'));
} else {
  // Transparent catch-all proxy: every path + query is forwarded to TARGET.
  // changeOrigin rewrites the Host header to TARGET so the upstream (Cherry
  // Deploy behind Cloudflare) routes to the right app. xfwd adds X-Forwarded-*.
  app.use('/', createProxyMiddleware({ target: TARGET, changeOrigin: true, xfwd: true }));
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('[proxy] all paths -> ' + (TARGET || '(UNSET)') + ' on :' + port));
