'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const backendRoot = path.resolve(__dirname, '..');
const prismaCliPath = path.join(backendRoot, 'node_modules', 'prisma', 'build', 'index.js');
const prismaEnginesDirectory = path.join(backendRoot, 'node_modules', '@prisma', 'engines');

function resolveSchemaEngineBinaryPath() {
  if (process.env.PRISMA_SCHEMA_ENGINE_BINARY) {
    return process.env.PRISMA_SCHEMA_ENGINE_BINARY;
  }

  if (!fs.existsSync(prismaEnginesDirectory)) {
    return null;
  }

  const engineEntry = fs
    .readdirSync(prismaEnginesDirectory, { withFileTypes: true })
    .find(
      (entry) =>
        entry.isFile() &&
        entry.name.startsWith('schema-engine') &&
        !entry.name.endsWith('.sha256') &&
        !entry.name.endsWith('.gz')
    );

  return engineEntry ? path.join(prismaEnginesDirectory, engineEntry.name) : null;
}

function runPrismaCli() {
  const schemaEngineBinaryPath = resolveSchemaEngineBinaryPath();
  const env = {
    ...process.env,
    PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING:
      process.env.PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING || '1',
  };

  if (schemaEngineBinaryPath) {
    env.PRISMA_SCHEMA_ENGINE_BINARY = schemaEngineBinaryPath;
  }

  const result = spawnSync(process.execPath, [prismaCliPath, ...process.argv.slice(2)], {
    cwd: backendRoot,
    env,
    stdio: 'inherit',
  });

  if (result.error) {
    console.error('Failed to execute Prisma CLI:', result.error);
    process.exit(1);
  }

  process.exit(result.status ?? 1);
}

runPrismaCli();
