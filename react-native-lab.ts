/* eslint-disable import/no-extraneous-dependencies */
import { green } from "picocolors";
import { execSync } from "node:child_process";
import { basename, dirname, join, resolve } from "node:path";
import { copyFileSync, existsSync, mkdirSync } from "node:fs";

import {
  getTemplateFile,
  installTemplate,
  TemplateType,
} from "./src/templates";
import { tryGitInit } from "./src/helpers/git";
import getOnline from "./src/helpers/is-online";
import isWriteable from "./src/helpers/is-writable";
import isFolderEmpty from "./src/helpers/is-folder-empty";
import { PackageManager } from "./src/helpers/get-pkg-manager";

export default async function createReactNative({
  appPath,
  packageManager,
  srcDir,
  envEnabled,
  disableGit,
  skipInstall,
  template,
}: {
  appPath: string;
  packageManager: PackageManager;
  srcDir: boolean;
  envEnabled: boolean;
  disableGit?: boolean;
  skipInstall: boolean;
  template: TemplateType;
}) {
  const root = resolve(appPath);

  if (!(await isWriteable(dirname(root)))) {
    console.error(
      "The application path is not writable, please check folder permissions and try again."
    );
    console.error(
      "It is likely you do not have write permissions for this folder."
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
      "You appear to be offline. Please check your network connection."
    );
    process.exit(1);
  }

  console.log("");
  console.log(`Creating a new React Native app in ${green(root)}.`);

  try {
    process.env.APP_NAME = appName;
    process.env.PACKAGE_MANAGER = packageManager;

    // execSync(
    //   `npx @react-native-community/cli@latest init %APP_NAME% --pm %PACKAGE_MANAGER% --skip-git-init --skip-install`,
    //   { stdio: "inherit" }
    // );
    execSync(
      `npx @react-native-community/cli@latest init %APP_NAME% --pm %PACKAGE_MANAGER% --skip-git-init --skip-install`,
      { stdio: "inherit" }
    );
  } catch (error) {
    console.error("Failed to create the project.");
    console.error(error);
    process.exit(1);
  }

  process.chdir(root);

  // Copy `.gitignore` if the application did not provide one
  const ignorePath = join(root, ".gitignore");
  if (!existsSync(ignorePath)) {
    copyFileSync(getTemplateFile({ template, file: "gitignore" }), ignorePath);
  }

  const formattedAppName = appName
    .trim()
    .replace(/([a-z])([A-Z])/g, "$1-$2") // Insert hyphen between lowercase and uppercase letters
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");

  await installTemplate({
    appName: formattedAppName,
    root,
    packageManager,
    envEnabled,
    template,
    srcDir,
    skipInstall,
  });

  if (disableGit) {
    console.log("Skipping git initialization.");
    console.log();
  } else if (tryGitInit(root)) {
    console.log("Initialized a git repository.");
    console.log();
  }

  console.log("\n");
  console.log(green("🎉 Enjoy your new React Native app! Have fun coding! 🎉"));
}
