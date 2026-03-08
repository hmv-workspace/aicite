#!/usr/bin/env node

/*
  AiCite
  Minimal CLI to reserve the npm name and provide a working `npx aicite setup`.
*/

const fs = require('node:fs');
const path = require('node:path');

function printHelp() {
  process.stdout.write(`aicite - bootstrap AI assistant project context\n\nUsage:\n  aicite setup [--force] [--only <targets> | --copilot] [--kilocode] [--docs]\n  aicite --help\n\nCommands:\n  setup     Create project assistant files in the current directory\n\nOptions:\n  --force    Overwrite existing generated files\n  --only     Comma-separated targets: copilot,kilocode,docs (default: all). Note: docs are always generated.\n  --copilot  Generate only .github/ (Copilot)\n  --kilocode Generate only .kilocode/ (KiloCode)\n  --docs     Generate only docs/\n`);
}

function parseArgs(argv) {
  const args = argv.slice(2);

  const positional = [];
  const flags = new Set();
  const options = new Map();

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (!a.startsWith('-')) {
      positional.push(a);
      continue;
    }

    if (a === '--only') {
      const value = args[i + 1];
      if (!value || value.startsWith('-')) {
        throw new Error('--only requires a value like: copilot,kilocode,docs');
      }
      options.set('only', value);
      i++;
      continue;
    }

    flags.add(a);
  }

  return { positional, flags, options };
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

function parseTargets({ flags, options }) {
  const valid = new Set(['copilot', 'kilocode', 'docs']);

  if (options && options.has('only')) {
    const raw = String(options.get('only') || '');
    const parts = raw
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    if (parts.length === 0) throw new Error('--only value is empty');
    for (const p of parts) {
      if (!valid.has(p)) throw new Error(`Unknown target in --only: ${p}`);
    }
    const targets = new Set(parts);
    targets.add('docs');
    return targets;
  }

  const explicit = new Set();
  if (flags.has('--copilot')) explicit.add('copilot');
  if (flags.has('--kilocode')) explicit.add('kilocode');
  if (flags.has('--docs')) explicit.add('docs');
  if (explicit.size > 0) {
    explicit.add('docs');
    return explicit;
  }

  return new Set(['copilot', 'kilocode', 'docs']);
}

function setup({ cwd, force, targets }) {
  const templateDir = resolveTemplateDir();
  const templateFiles = listFilesRecursive(templateDir);

  const shouldInclude = (relPath) => {
    const first = relPath.split(path.sep)[0];
    if (first === '.github') return targets.has('copilot');
    if (first === '.kilocode') return targets.has('kilocode');
    if (first === 'docs') return targets.has('docs');
    return true;
  };

  const results = [];
  for (const srcFile of templateFiles) {
    const rel = path.relative(templateDir, srcFile);
    if (!shouldInclude(rel)) continue;
    const destFile = path.join(cwd, rel);
    const content = fs.readFileSync(srcFile, 'utf8');
    results.push({ path: destFile, ...writeFileIfNeeded(destFile, content, { force }) });
  }

  const wroteCount = results.filter((r) => r.wrote).length;
  const skippedCount = results.length - wroteCount;

  process.stdout.write(`Created ${Array.from(targets).sort().join(', ')} (from templates)\n`);
  process.stdout.write(`Wrote ${wroteCount} files${skippedCount ? ` (skipped ${skippedCount})` : ''}.\n`);
  process.stdout.write('Done.\n');
}

function main() {
  let parsed;
  try {
    parsed = parseArgs(process.argv);
  } catch (err) {
    process.stderr.write(`${err && err.message ? err.message : String(err)}\n\n`);
    printHelp();
    process.exit(1);
  }

  const { positional, flags, options } = parsed;

  if (flags.has('--help') || flags.has('-h') || positional.length === 0) {
    printHelp();
    process.exit(positional.length === 0 && !flags.has('--help') && !flags.has('-h') ? 1 : 0);
  }

  const cmd = positional[0];
  const force = flags.has('--force');

  if (cmd === 'setup') {
    let targets;
    try {
      targets = parseTargets({ flags, options });
    } catch (err) {
      process.stderr.write(`${err && err.message ? err.message : String(err)}\n\n`);
      printHelp();
      process.exit(1);
    }

    setup({ cwd: process.cwd(), force, targets });
    return;
  }

  process.stderr.write(`Unknown command: ${cmd}\n\n`);
  printHelp();
  process.exit(1);
}

main();
