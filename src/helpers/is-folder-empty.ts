/* eslint-disable import/no-extraneous-dependencies */
import { lstatSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { green, blue } from "picocolors";

/**
 * Checks if a folder is empty, considering a predefined list of valid files.
 *
 * @param root - The root directory to check.
 * @param name - The name of the directory to check.
 * @returns `true` if the folder is empty or only contains valid files, `false` otherwise.
 *
 * The function will log any conflicting files or directories that are not in the list of valid files.
 * Valid files include:
 * - .DS_Store
 * - .git
 * - .gitattributes
 * - .gitignore
 * - .gitlab-ci.yml
 * - .hg
 * - .hgcheck
 * - .hgignore
 * - .idea
 * - .npmignore
 * - .travis.yml
 * - LICENSE
 * - Thumbs.db
 * - docs
 * - mkdocs.yml
 * - npm-debug.log
 * - yarn-debug.log
 * - yarn-error.log
 * - yarnrc.yml
 * - .yarn
 *
 * Additionally, files with the `.iml` extension (used by IntelliJ IDEA-based editors) are also considered valid.
 *
 * If any conflicting files are found, the function will log the conflicts and suggest either using a new directory name or removing the conflicting files.
 */
export default function isFolderEmpty(root: string, name: string): boolean {
  const validFiles = [
    ".DS_Store",
    ".git",
    ".gitattributes",
    ".gitignore",
    ".gitlab-ci.yml",
    ".hg",
    ".hgcheck",
    ".hgignore",
    ".idea",
    ".npmignore",
    ".travis.yml",
    "LICENSE",
    "Thumbs.db",
    "docs",
    "mkdocs.yml",
    "npm-debug.log",
    "yarn-debug.log",
    "yarn-error.log",
    "yarnrc.yml",
    ".yarn",
  ];

  const conflicts = readdirSync(root).filter(
    (file) =>
      !validFiles.includes(file) &&
      // Support IntelliJ IDEA-based editors
      !/\.iml$/.test(file)
  );

  if (conflicts.length > 0) {
    console.log(
      `The directory ${green(name)} contains files that could conflict:`
    );
    console.log();
    for (const file of conflicts) {
      try {
        const stats = lstatSync(join(root, file));
        if (stats.isDirectory()) {
          console.log(`  ${blue(file)}/`);
        } else {
          console.log(`  ${file}`);
        }
      } catch {
        console.log(`  ${file}`);
      }
    }
    console.log();
    console.log(
      "Either try using a new directory name, or remove the files listed above."
    );
    console.log();
    return false;
  }

  return true;
}
