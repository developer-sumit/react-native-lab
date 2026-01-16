/* eslint-disable import/no-extraneous-dependencies */
import colors from "picocolors";
import { execSync } from "node:child_process";
import { basename, dirname, join, resolve } from "node:path";
import { copyFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { rmSync } from "node:fs";

import { getTemplateFile, installTemplate } from "./template";
import { tryGitInit } from "./helpers/git";
import getOnline from "./helpers/is-online";
import isWriteable from "./helpers/is-writable";
import isFolderEmpty from "./helpers/is-folder-empty";
import { PackageManager } from "./helpers/get-pkg-manager";
import { EnvPackages, TemplateType, StateManagementType } from "./types";
import { setupCI as initCI } from "./helpers/ci";

function fixAndroidPackageStructure(root: string, packageName: string) {
  const androidJavaPath = join(root, "android", "app", "src", "main", "java");

  if (!existsSync(androidJavaPath)) {
    return;
  }

  try {
    const comDir = join(androidJavaPath, "com");
    if (!existsSync(comDir)) {
      return;
    }

    // Check if we have the incorrect structure (com/com.package.name/)
    const packageDirs = readdirSync(comDir);
    const incorrectDir = packageDirs.find((dir) => dir.startsWith("com."));

    if (incorrectDir) {
      // Parse the package name to create correct folder structure
      const packageParts = packageName.split(".");

      // Create the correct folder structure
      let currentPath = androidJavaPath;
      for (const part of packageParts) {
        currentPath = join(currentPath, part);
        if (!existsSync(currentPath)) {
          mkdirSync(currentPath, { recursive: true });
        }
      }

      // Move files from incorrect structure to correct structure
      const incorrectPath = join(comDir, incorrectDir);
      const correctPath = currentPath;

      if (existsSync(incorrectPath)) {
        // Copy all files from incorrect path to correct path
        const files = readdirSync(incorrectPath);
        for (const file of files) {
          const srcFile = join(incorrectPath, file);
          const destFile = join(correctPath, file);

          if (existsSync(srcFile)) {
            copyFileSync(srcFile, destFile);
          }
        }

        // Remove the incorrect directory structure
        rmSync(join(comDir, incorrectDir), { recursive: true, force: true });

        console.log(
          colors.green(`✓ Fixed Android package structure for ${packageName}`),
        );
      }
    }
  } catch (error) {
    console.warn(
      colors.yellow(
        `Warning: Could not fix Android package structure: ${error}`,
      ),
    );
  }
}

export default async function createReactNative({
  appPath,
  packageManager,
  reactNativeVersion,
  packageName,
  nativeWind,
  srcDir,
  envEnabled,
  envPackage,
  includeCustomHooks,
  customHooks,
  includeConsoleRemover,
  disableGit,
  skipInstall,
  template,
  setupCI,
  stateManagement,
}: {
  appPath: string;
  packageManager: PackageManager;
  reactNativeVersion: string;
  packageName?: string;
  srcDir: boolean;
  nativeWind: boolean;
  envEnabled: boolean;
  envPackage: EnvPackages;
  includeCustomHooks: boolean;
  customHooks: string[];
  includeConsoleRemover: boolean;
  disableGit?: boolean;
  skipInstall: boolean;
  template: TemplateType;
  setupCI?: boolean;
  stateManagement?: StateManagementType;
}) {
  const root = resolve(appPath);

  if (!(await isWriteable(dirname(root)))) {
    console.error(
      "The application path is not writable, please check folder permissions and try again.",
    );
    console.error(
      "It is likely you do not have write permissions for this folder.",
    );
    process.exit(1);
  }

  const appName = basename(root);

  mkdirSync(root, { recursive: true });
  if (!isFolderEmpty(root, appName)) {
    process.exit(1);
  }

  const useYarn = packageManager === "yarn";
  const isOnline = !useYarn || (await getOnline());

  if (!isOnline) {
    console.error(
      "You appear to be offline. Please check your network connection.",
    );
    process.exit(1);
  }
  console.log("");
  console.log(`Creating a new React Native app in ${colors.green(root)}.`);

  // Build the CLI command with optional package name
  let cliCommand = `npx @react-native-community/cli init ${appName} --pm ${packageManager} --version ${reactNativeVersion} --skip-git-init --skip-install`;

  if (packageName) {
    cliCommand += ` --package-name ${packageName}`;
  }

  try {
    execSync(cliCommand, { stdio: "inherit" });
  } catch (error) {
    console.error("Failed to create the project.");
    console.error(error);
    process.exit(1);
  }
  process.chdir(root);

  // Fix Android package structure if a custom package name was provided
  if (packageName) {
    fixAndroidPackageStructure(root, packageName);
  }

  // Copy `.gitignore` if the application did not provide one
  const ignorePath = join(root, ".gitignore");
  if (!existsSync(ignorePath)) {
    copyFileSync(
      getTemplateFile({
        template,
        mode: nativeWind ? "nativewind" : "default",
        file: "gitignore",
      }),
      ignorePath,
    );
  }

  const formattedAppName = appName
    .trim()
    .replace(/([a-z])([A-Z])/g, "$1-$2") // Insert hyphen between lowercase and uppercase letters
    .toLowerCase()
    .replace(/[^a-z]+/g, "-");
  await installTemplate({
    appName: formattedAppName,
    packageName,
    root,
    packageManager,
    envEnabled,
    envPackage,
    includeCustomHooks,
    customHooks,
    includeConsoleRemover,
    template,
    srcDir,
    nativeWind,
    skipInstall,
    stateManagement,
  });

  if (disableGit) {
    console.log("Skipping git initialization.");
  } else if (tryGitInit(root)) {
    console.log("Initialized a git repository.");
  }

  if (setupCI) {
    initCI(root, packageManager);
  }

  console.log(
    colors.green("\n🎉 Enjoy your new React Native app! Have fun coding! 🎉"),
  );
}
