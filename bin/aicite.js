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

function setup({ cwd, force }) {
  const dirs = [path.join(cwd, '.github', 'agents'), path.join(cwd, '.kilocode'), path.join(cwd, 'docs')];

  for (const dir of dirs) ensureDir(dir);

  const files = [
    {
      full: path.join(cwd, '.github', 'README.md'),
      content:
        '# GitHub Copilot\n\nThis folder contains guidance and agent personas for GitHub Copilot and related tooling.\n'
    },
    {
      full: path.join(cwd, '.github', 'agents', 'architect.assistant.md'),
      content: '# Architect Assistant\n\n(Placeholder) Add architect agent instructions here.\n'
    },
    {
      full: path.join(cwd, '.github', 'agents', 'developer.assistant.md'),
      content: '# Developer Assistant\n\n(Placeholder) Add developer agent instructions here.\n'
    },
    {
      full: path.join(cwd, '.kilocode', 'README.md'),
      content: '# KiloCode\n\nThis folder contains configuration and agent personas for KiloCode.\n'
    },
    {
      full: path.join(cwd, '.kilocode', 'architect-assistant.yaml'),
      content: '# (Placeholder) KiloCode architect assistant persona\n'
    },
    {
      full: path.join(cwd, '.kilocode', 'developer-assistant.yaml'),
      content: '# (Placeholder) KiloCode developer assistant persona\n'
    },
    {
      full: path.join(cwd, 'docs', 'README.md'),
      content: '# Project Docs\n\n(Placeholder) Add documentation index and conventions here.\n'
    },
    {
      full: path.join(cwd, 'docs', 'requirements.md'),
      content: '# Requirements\n\n(Placeholder)\n'
    },
    {
      full: path.join(cwd, 'docs', 'architecture.md'),
      content: '# Architecture\n\n(Placeholder)\n'
    },
    {
      full: path.join(cwd, 'docs', 'implementation.md'),
      content: '# Implementation\n\n(Placeholder)\n'
    },
    {
      full: path.join(cwd, 'docs', 'deployment.md'),
      content: '# Deployment\n\n(Placeholder)\n'
    }
  ];

  const results = files.map((f) => ({ path: f.full, ...writeFileIfNeeded(f.full, f.content, { force }) }));

  const wroteCount = results.filter((r) => r.wrote).length;
  const skippedCount = results.length - wroteCount;

  process.stdout.write('Created 3 directories (.github/agents, .kilocode, docs)\n');
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
