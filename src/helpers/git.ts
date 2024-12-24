/* eslint-disable import/no-extraneous-dependencies */
import { join } from "node:path";
import { rmSync } from "node:fs";
import { execSync } from "node:child_process";

function isInGitRepository(): boolean {
  try {
    execSync("git rev-parse --is-inside-work-tree", { stdio: "ignore" });
    return true;
  } catch (_) {}
  return false;
}

function isDefaultBranchSet(): boolean {
  try {
    execSync("git config init.defaultBranch", { stdio: "ignore" });
    return true;
  } catch (_) {}
  return false;
}

/**
 * Initializes a new Git repository in the specified root directory if one does not already exist.
 * 
 * @param root - The root directory where the Git repository should be initialized.
 * @returns `true` if the Git repository was successfully initialized, `false` otherwise.
 * 
 * @remarks
 * - If Git is not installed or an error occurs during initialization, the function will return `false`.
 * - If a Git repository already exists in the specified root directory, the function will return `false`.
 * - If the initialization process fails after creating the `.git` directory, it will attempt to remove the `.git` directory.
 * 
 * @example
 * ```typescript
 * const result = tryGitInit('/path/to/project');
 * if (result) {
 *   console.log('Git repository initialized successfully.');
 * } else {
 *   console.log('Failed to initialize Git repository.');
 * }
 * ```
 */
export function tryGitInit(root: string): boolean {
  let didInit = false;
  try {
    execSync("git --version", { stdio: "ignore" });
    if (isInGitRepository()) {
      return false;
    }

    execSync("git init", { stdio: "ignore" });
    didInit = true;

    if (!isDefaultBranchSet()) {
      execSync("git checkout -b main", { stdio: "ignore" });
    }

    execSync("git add -A", { stdio: "ignore" });
    execSync('git commit -m "Initial commit from React Native Lab"', {
      stdio: "ignore",
    });
    return true;
  } catch (e) {
    if (didInit) {
      try {
        rmSync(join(root, ".git"), { recursive: true, force: true });
      } catch (_) {}
    }
    return false;
  }
}
