# AiCite Local Testing Guide

This document contains all commands to test the AiCite CLI locally for both uvx (Python) and npx (Node.js) implementations.

## Setup

```bash
cd /Users/mehulhirpara/Workspace/GitHub/hmv-workspace/aicite
```

---

## uvx (Python) Testing

### Option A: Run with PYTHONPATH (no installation)

```bash
# Create a test directory
cd /tmp && rm -rf aicite-test && mkdir aicite-test && cd aicite-test

# Setup command
PYTHONPATH=/Users/mehulhirpara/Workspace/GitHub/hmv-workspace/aicite/uvx python3 -m aicite setup

# Verify files created
find . -type f | sort

# Update command (safe - skips user-modified files)
PYTHONPATH=/Users/mehulhirpara/Workspace/GitHub/hmv-workspace/aicite/uvx python3 -m aicite update

# Update agents only (no docs)
PYTHONPATH=/Users/mehulhirpara/Workspace/GitHub/hmv-workspace/aicite/uvx python3 -m aicite update --agents

# Update with force (overwrites user-modified files)
PYTHONPATH=/Users/mehulhirpara/Workspace/GitHub/hmv-workspace/aicite/uvx python3 -m aicite update --force

# Help
PYTHONPATH=/Users/mehulhirpara/Workspace/GitHub/hmv-workspace/aicite/uvx python3 -m aicite --help
```

### Option B: Install in editable mode

```bash
cd /Users/mehulhirpara/Workspace/GitHub/hmv-workspace/aicite
pip install -e uvx/

# Now use `aicite` directly
cd /tmp && rm -rf aicite-test && mkdir aicite-test && cd aicite-test

aicite setup
aicite update
aicite update --agents
aicite update --force
aicite --help
```

---

## npx (Node.js) Testing

### Option A: Run script directly

```bash
# Create a test directory
cd /tmp && rm -rf aicite-test && mkdir aicite-test && cd aicite-test

# Setup command
node /Users/mehulhirpara/Workspace/GitHub/hmv-workspace/aicite/npx/bin/aicite.js setup

# Verify files created
find . -type f | sort

# Update command (safe - skips user-modified files)
node /Users/mehulhirpara/Workspace/GitHub/hmv-workspace/aicite/npx/bin/aicite.js update

# Update agents only (no docs)
node /Users/mehulhirpara/Workspace/GitHub/hmv-workspace/aicite/npx/bin/aicite.js update --agents

# Update with force (overwrites user-modified files)
node /Users/mehulhirpara/Workspace/GitHub/hmv-workspace/aicite/npx/bin/aicite.js update --force

# Help
node /Users/mehulhirpara/Workspace/GitHub/hmv-workspace/aicite/npx/bin/aicite.js --help
```

### Option B: Link globally

```bash
cd /Users/mehulhirpara/Workspace/GitHub/hmv-workspace/aicite/npx
npm link

# Now use `aicite` directly
cd /tmp && rm -rf aicite-test && mkdir aicite-test && cd aicite-test

aicite setup
aicite update
aicite update --agents
aicite update --force
aicite --help
```

---

## Test Scenarios

### 1. Fresh Setup
```bash
cd /tmp && rm -rf aicite-test && mkdir aicite-test && cd aicite-test
# Run setup command (uvx or npx)
# Expected: All template files created
```

### 2. Update Unmodified Files
```bash
# After fresh setup, run update
# Expected: 0 files written, all skipped (content matches template)
```

### 3. User-Modified File Protection
```bash
# After fresh setup, modify a file
echo "USER MODIFIED" >> docs/README.md

# Run update
# Expected: Modified file skipped, unmodified files skipped

# Run update --force
# Expected: All files overwritten including modified one
```

### 4. Update Agents Only
```bash
# After fresh setup, run update --agents
# Expected: Only agent files targeted (.github/, .cursor/, .kilocode/), no docs/
```

### 5. Update on Empty Directory
```bash
cd /tmp && rm -rf aicite-test && mkdir aicite-test && cd aicite-test
# Run update or update --agents
# Expected: 0 files created (update only modifies existing files)
```

### 6. Help Output
```bash
# Run --help
# Expected: Shows both setup and update commands with options
```

---

## Expected File Counts

| Command | uvx Files | npx Files |
|---------|-----------|-----------|
| `setup` | 11 | 14 |
| `update --agents` targets | 6 | 9 |
| `update` targets | 11 | 14 |

Note: npx has more files because it includes `.kilocode/` directory (README.md, architect-assistant.yaml, developer-assistant.yaml) which uvx doesn't have.
