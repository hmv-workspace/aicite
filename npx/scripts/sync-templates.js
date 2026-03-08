#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function copyDir(srcDir, destDir) {
  ensureDir(destDir);
  fs.cpSync(srcDir, destDir, {
    recursive: true,
    force: true,
    dereference: false,
    errorOnExist: false
  });
}

function main() {
  const packageRoot = path.resolve(__dirname, '..');
  const repoRoot = path.resolve(packageRoot, '..');

  const src = path.join(repoRoot, 'templates');
  const dest = path.join(packageRoot, 'templates');

  if (!fs.existsSync(src)) {
    process.stderr.write(`Missing templates folder at ${src}\n`);
    process.exit(1);
  }

  copyDir(src, dest);
  process.stdout.write(`Synced templates: ${path.relative(packageRoot, dest)}/\n`);
}

main();
