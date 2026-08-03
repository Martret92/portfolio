const fs = require('node:fs');
const { syncBuiltinESMExports } = require('node:module');
const os = require('node:os');
const path = require('node:path');

const originalRmSync = fs.rmSync;

if (process.platform === 'win32') {
  const preloadOption = `--require=${__filename}`;
  const nodeOptions = process.env.NODE_OPTIONS ?? '';

  if (!nodeOptions.split(/\s+/).includes(preloadOption)) {
    process.env.NODE_OPTIONS = [nodeOptions, preloadOption]
      .filter(Boolean)
      .join(' ');
  }
}

fs.rmSync = function rmSyncWithLighthouseCleanupFallback(target, options) {
  try {
    return originalRmSync(target, options);
  } catch (error) {
    const isLockedLighthouseTemporaryDirectory =
      process.platform === 'win32' &&
      error?.code === 'EPERM' &&
      path.dirname(String(target)) === os.tmpdir() &&
      path.basename(String(target)).startsWith('lighthouse.');

    if (!isLockedLighthouseTemporaryDirectory) {
      throw error;
    }

    return undefined;
  }
};

syncBuiltinESMExports();
