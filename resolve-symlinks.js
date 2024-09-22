// findSymlinks.js

import fs from "fs/promises";
import path from "path";

async function findSymlinks(dir) {
  let items;
  const symlinks = [];
  try {
    items = await fs.readdir(dir);
  } catch (err) {
    console.error(`Error reading directory ${dir}: ${err.message}`);
    return;
  }

  for (const item of items) {
    const fullPath = path.join(dir, item);
    let stats;
    try {
      stats = await fs.lstat(fullPath);
    } catch (err) {
      console.error(`Error getting stats for ${fullPath}: ${err.message}`);
      continue;
    }

    if (stats.isSymbolicLink()) {
      symlinks.push(fullPath);
      console.log(`Symlink: ${fullPath}`);
    } else if (stats.isDirectory()) {
      const nestedSymlinks = await findSymlinks(fullPath);
      symlinks.push(...nestedSymlinks);
    }
  }
  return symlinks;
}

async function resolveSymlinks(symlinkPaths) {
  const results = [];
  for (const symlinkPath of symlinkPaths) {
    try {
      const targetPath = await fs.realpath(symlinkPath);
      console.log(`Resolved symlink ${symlinkPath} to ${targetPath}`);
      results.push([symlinkPath, targetPath]);
    } catch (err) {
      console.error(`Error resolving symlink ${symlinkPath}: ${err.message}`);
      // Optionally, you can decide how to handle errors:
      // - Skip the symlink and continue
      // - Include it with a null target
      // - Throw the error to stop execution
      // For now, we'll skip and continue.
    }
  }
  return results;
}

async function replaceSymlinksWithTargets(symlinkTuples) {
  for (const [symlinkPath, targetPath] of symlinkTuples) {
    try {
      // Check if symlinkPath exists and is a symlink
      const symlinkStats = await fs.lstat(symlinkPath);
      if (!symlinkStats.isSymbolicLink()) {
        console.error(`Skipping: ${symlinkPath} is not a symbolic link.`);
        continue;
      }

      // Check if targetPath exists
      let targetStats;
      try {
        targetStats = await fs.stat(targetPath);
      } catch (err) {
        console.error(
          `Target does not exist: ${targetPath}. Error: ${err.message}`
        );
        continue;
      }

      // Remove the symlink
      await fs.unlink(symlinkPath);

      // Ensure the parent directory exists
      const parentDir = path.dirname(symlinkPath);
      await fs.mkdir(parentDir, { recursive: true });

      // If target is a directory, recursively copy its contents
      if (targetStats.isDirectory()) {
        await copyDirectory(targetPath, symlinkPath);
      } else {
        // Copy the file
        await fs.copyFile(targetPath, symlinkPath);
      }

      console.log(`Replaced symlink ${symlinkPath} with target ${targetPath}`);
    } catch (err) {
      console.error(`Error replacing symlink ${symlinkPath}: ${err.message}`);
    }
  }
}

// Helper function to recursively copy directories
async function copyDirectory(source, destination) {
  await fs.mkdir(destination, { recursive: true });
  const entries = await fs.readdir(source, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(source, entry.name);
    const destPath = path.join(destination, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else if (entry.isSymbolicLink()) {
      // Read the link target
      const linkTarget = await fs.readlink(srcPath);
      // Recreate the symlink
      await fs.symlink(linkTarget, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

const folderPath = process.argv[2];

if (!folderPath) {
  console.error("Please provide a folder path as the first argument.");
  process.exit(1);
}

(async () => {
  let symlinkPaths;
  try {
    symlinkPaths = await findSymlinks(folderPath);
  } catch (err) {
    console.error(`Error: ${err.message}`);
  }

  let resolvedSymlinks;
  try {
    resolvedSymlinks = await resolveSymlinks(symlinkPaths);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }

  try {
    await replaceSymlinksWithTargets(resolvedSymlinks);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
})();
