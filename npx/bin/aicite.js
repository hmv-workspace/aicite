#!/usr/bin/env node

/*
  AiCite
  Minimal CLI to reserve the npm name and provide a working `npx aicite setup`.
*/

const fs = require('node:fs');
const path = require('node:path');

function printHelp() {
  process.stdout.write(`aicite - bootstrap AI assistant project context\n\nUsage:\n  aicite setup [--force]\n  aicite --help\n\nCommands:\n  setup     Create .github/, .kilocode/, and docs/ in the current directory\n\nOptions:\n  --force   Overwrite existing generated files\n`);
}

function parseArgs(argv) {
  const args = argv.slice(2);
  const flags = new Set(args.filter((a) => a.startsWith('-')));
  const positional = args.filter((a) => !a.startsWith('-'));
  return { positional, flags };
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function writeFileIfNeeded(filePath, content, { force }) {
  if (!force && fs.existsSync(filePath)) return { wrote: false, reason: 'exists' };
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf8');
  return { wrote: true };
}

function listFilesRecursive(dirPath) {
  const out = [];
  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    const full = path.join(dirPath, entry.name);
    if (entry.isDirectory()) out.push(...listFilesRecursive(full));
    else if (entry.isFile()) out.push(full);
  }
  return out;
}

function resolveTemplateDir() {
  const packageRoot = path.resolve(__dirname, '..');

  const packaged = path.join(packageRoot, 'templates', 'basic');
  if (fs.existsSync(packaged)) return packaged;

  const repoRootFallback = path.resolve(packageRoot, '..');
  const fromRepoRoot = path.join(repoRootFallback, 'templates', 'basic');
  if (fs.existsSync(fromRepoRoot)) return fromRepoRoot;

  throw new Error(
    `Unable to locate templates. Looked for:\n- ${packaged}\n- ${fromRepoRoot}\n\nIf you're publishing, ensure prepack sync ran.`
  );
}

function setup({ cwd, force }) {
  const templateDir = resolveTemplateDir();
  const templateFiles = listFilesRecursive(templateDir);

  const results = [];
  for (const srcFile of templateFiles) {
    const rel = path.relative(templateDir, srcFile);
    const destFile = path.join(cwd, rel);
    const content = fs.readFileSync(srcFile, 'utf8');
    results.push({ path: destFile, ...writeFileIfNeeded(destFile, content, { force }) });
  }

  const wroteCount = results.filter((r) => r.wrote).length;
  const skippedCount = results.length - wroteCount;

  process.stdout.write('Created .github/, .kilocode/, and docs/ (from templates)\n');
  process.stdout.write(`Wrote ${wroteCount} files${skippedCount ? ` (skipped ${skippedCount})` : ''}.\n`);
  process.stdout.write('Done.\n');
}

function main() {
  const { positional, flags } = parseArgs(process.argv);

  if (flags.has('--help') || flags.has('-h') || positional.length === 0) {
    printHelp();
    process.exit(positional.length === 0 && !flags.has('--help') && !flags.has('-h') ? 1 : 0);
  }

  const cmd = positional[0];
  const force = flags.has('--force');

  if (cmd === 'setup') {
    setup({ cwd: process.cwd(), force });
    return;
  }

  process.stderr.write(`Unknown command: ${cmd}\n\n`);
  printHelp();
  process.exit(1);
}

main();
