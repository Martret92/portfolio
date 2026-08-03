import { readdir, readFile, stat } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const buildDirectory = fileURLToPath(new URL('../dist/', import.meta.url));

async function findJavaScriptAssets(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const assets = [];

  for (const entry of entries) {
    const path = join(directory, entry.name);

    if (entry.isDirectory()) {
      assets.push(...(await findJavaScriptAssets(path)));
    } else if (entry.isFile() && extname(entry.name) === '.js') {
      assets.push(path);
    }
  }

  return assets;
}

function formatBytes(bytes) {
  return `${(bytes / 1024).toFixed(2)} KiB`;
}

try {
  await stat(buildDirectory);
} catch {
  console.error('No dist/ directory found. Run `pnpm build` first.');
  process.exitCode = 1;
}

if (process.exitCode !== 1) {
  const paths = await findJavaScriptAssets(buildDirectory);
  const assets = await Promise.all(
    paths.map(async (path) => {
      const contents = await readFile(path);

      return {
        path: relative(buildDirectory, path).replaceAll('\\', '/'),
        raw: contents.byteLength,
        gzip: gzipSync(contents).byteLength,
      };
    }),
  );

  assets.sort((left, right) => right.gzip - left.gzip);

  console.log('Built JavaScript assets (largest gzip size first):');

  if (assets.length === 0) {
    console.log('  No JavaScript assets found.');
  } else {
    for (const asset of assets) {
      console.log(
        `  ${asset.path}: ${formatBytes(asset.raw)} raw, ${formatBytes(asset.gzip)} gzip`,
      );
    }
  }

  const totals = assets.reduce(
    (sum, asset) => ({ raw: sum.raw + asset.raw, gzip: sum.gzip + asset.gzip }),
    { raw: 0, gzip: 0 },
  );

  console.log(
    `Total JavaScript: ${formatBytes(totals.raw)} raw, ${formatBytes(totals.gzip)} gzip`,
  );
}
