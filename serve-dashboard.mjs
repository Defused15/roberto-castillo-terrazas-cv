#!/usr/bin/env node
/**
 * serve-dashboard.mjs
 * Serves jest-dashboard.html on a local port and opens it in the browser.
 * Uses only Node built-ins — no extra dependencies needed.
 */

import { createServer } from 'http';
import { readFileSync, existsSync } from 'fs';
import { resolve, extname } from 'path';
import { exec } from 'child_process';

const PORT = 4000;
const HTML  = resolve('./reports/jest-dashboard.html');

if (!existsSync(HTML)) {
  console.error('❌  Dashboard not found: ' + HTML);
  console.error('    Run: npm run dashboard:generate first');
  process.exit(1);
}

const MIME = { '.html':'text/html', '.js':'application/javascript', '.css':'text/css' };

const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(readFileSync(HTML));
});

server.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log(`✅  Dashboard running at: ${url}`);
  console.log('    Press Ctrl+C to stop.\n');
  exec(`start ${url}`);
});
