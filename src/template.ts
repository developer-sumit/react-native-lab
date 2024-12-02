import os from "os";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import { execSync } from "child_process";
import picocolors from "picocolors";

import { copyFiles } from "../helpers/copy";
import { GetTemplateFileArgs, InstallTemplateArgs } from "./types";

const { bold, cyan, green } = picocolors;

/**
 * Get the file path for a given file in a template.
 */
export const getTemplateFile = ({
  template,
  file,
}: GetTemplateFileArgs): string => {
  return path.join(__dirname, template, file);
};

/**
 * Function to get the directory name in ES modules
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const TEMPLATES = [
  "blank",
  "bottom-navigation",
  "stack-navigation",
  "drawer-navigation",
];
export const SRC_DIR_NAMES = ["assets", "screens", "components", "helpers"];

/**
 * Install a React Native internal template to a given `root` directory.
 */
export const installTemplate = async ({
  appName,
  root,
  packageManager,
  envEnabled,
  template,
  srcDir,
  skipInstall,
}: InstallTemplateArgs) => {
  console.log(bold(`Using ${packageManager}.`));

  /**
   * Copy the template files to the target directory.
   */
  console.log(green("\nInitializing project with template:"), template, "\n");
  const templatePath = path.join(__dirname, "templates", template);
  const copySource = ["**"];

  await copyFiles(copySource, root, {
    parents: true,
    cwd: templatePath,
    rename(name) {
      if (srcDir && name === "App-src.tsx") {
        return "App.tsx";
      }
      if (!srcDir && name === "App.tsx") {
        return "App.tsx";
      }
      switch (name) {
        case "gitignore": {
          return `.${name}`;
        }
        case "env": {
          return `.${name}`;
        }
        default: {
          return name;
        }
      }
    },
    filter(name) {
      if (srcDir && name === "App.tsx") {
        return false; // Skip copying App.tsx if srcDir is true
      }
      if (!srcDir && name === "App-src.tsx") {
        return false; // Skip copying App-src.tsx if srcDir is false
      }
      return true; // Copy all other files
    },
  });

  if (srcDir) {
    await fs.mkdir(path.join(root, "src"), { recursive: true });
    await Promise.all(
      SRC_DIR_NAMES.map(async (file) => {
        await fs
          .rename(path.join(root, file), path.join(root, "src", file))
          .catch((err) => {
            if (err.code !== "ENOENT") {
              throw err;
            }
          });
      })
    );
  }

  /**
   * Replace App.tsx with the template version.
   */
  const appTsxPath = path.join(root, "App.tsx");
  const templateAppTsxPath = srcDir
    ? path.join(templatePath, "App-src.tsx")
    : path.join(templatePath, "App.tsx");

  try {
    await fs.access(templateAppTsxPath);
    await fs.copyFile(templateAppTsxPath, appTsxPath);
    // console.log(green("Replaced App.tsx with the template version."));
  } catch (err: any) {
    if (err.code === "ENOENT") {
      // console.log(green("No App.tsx found in the template, creating a default App.tsx."));
      await fs.writeFile(appTsxPath, templateAppTsxPath, "utf8");
    } else {
      throw err;
    }
  }

  /**
   * Replace README.md with the README.md from the template.
   */
  const readmePath = path.join(root, "README.md");
  const templateReadmePath = path.join(templatePath, "README.md");

  try {
    await fs.access(templateReadmePath);
    await fs.copyFile(templateReadmePath, readmePath);
  } catch (err: any) {
    if (err.code === "ENOENT") {
      await fs.writeFile(readmePath, templateReadmePath, "utf8");
    } else {
      throw err;
    }
  }

  /**
   * Replace code in babel.config.js with custom import alias code.
   */
  const babelConfigPath = path.join(root, "babel.config.js");
  const babelConfig = `
module.exports = {
  presets: ["module:@react-native/babel-preset"],
  plugins: [
  ${
    envEnabled
      ? `[
      "module:react-native-dotenv",
      {
        moduleName: "@env",
        path: ".env",
        blacklist: null,
        whitelist: null,
        allowUndefined: true,
      },
    ],`
      : ""
  }
    [
      "module-resolver",
      { root: ["./"], alias: { "@assets": '${
        srcDir ? "./src/assets" : "./assets"
      }' },
      ${
        template !== "blank"
          ? `alias: { "@screens": '${
              srcDir ? "./src/screens" : "./screens"
            }' },`
          : ""
      }
      },
    ],
    ${template !== "blank" ? `"react-native-reanimated/plugin",` : ""}
  ],
};
`;
  await fs.writeFile(babelConfigPath, babelConfig, "utf8");

  /**
   * Create a tsconfig.json for the new project and write it to disk.
   */
  const tsConfig: any = {
    extends: "@react-native/typescript-config/tsconfig.json",
    compilerOptions: {
      jsx: "react",
      baseUrl: ".",
      paths: { "@assets/*": srcDir ? ["./src/assets/*"] : ["./assets/*"] },
    },
  };

  if (template !== "blank") {
    tsConfig.compilerOptions.paths["@screens/*"] = srcDir
      ? ["./src/screens/*"]
      : ["./screens/*"];
  }

  await fs.writeFile(
    path.join(root, "tsconfig.json"),
    JSON.stringify(tsConfig, null, 2) + os.EOL
  );

  const packageJsonPath = path.join(root, "package.json");
  let existingPackageJson: any = {};

  try {
    const data = await fs.readFile(packageJsonPath, "utf8");
    existingPackageJson = JSON.parse(data);
  } catch (err: any) {
    if (err.code !== "ENOENT") {
      throw err;
    }
  }

  /**
   * Create a package.json for the new project and write it to disk.
   */
  const packageJson: any = {
    name: appName,
    version: "1.0.0",
    private: true,
    scripts: {
      android: "react-native run-android",
      ios: "react-native run-ios",
      lint: "eslint .",
      start: "react-native start",
      reset: "react-native start --reset-cache",
      test: "jest",
      clean: "node ./scripts/clean.js",
      "build:aab": "react-native build-android --mode=release",
      "build:apk": "react-native run-android -- --mode='release'",
    },
    dependencies: {
      ...existingPackageJson.dependencies,
    },
    devDependencies: {
      ...existingPackageJson.devDependencies,
      "babel-plugin-module-resolver": "^5.0.2",
    },
    engines: {
      ...existingPackageJson.engines,
    },
  };

  if (envEnabled) {
    packageJson.devDependencies = {
      ...packageJson.devDependencies,
      "react-native-dotenv": "^3.4.11",
    };
  }

  if (template.includes("navigation")) {
    packageJson.dependencies = {
      ...packageJson.dependencies,
      "@react-navigation/native": "^7.0.4",
      "react-native-gesture-handler": "^2.21.2",
      "react-native-reanimated": "^3.16.3",
      "react-native-safe-area-context": "^4.14.0",
      "react-native-screens": "^4.3.0",
    };
  }

  if (template === "stack-navigation") {
    packageJson.dependencies = {
      ...packageJson.dependencies,
      "@react-navigation/stack": "^7.0.6",
    };
  }

  if (template === "drawer-navigation") {
    packageJson.dependencies = {
      ...packageJson.dependencies,
      "@react-navigation/drawer": "^6.0.0",
    };
  }

  if (template === "bottom-navigation") {
    packageJson.dependencies = {
      ...packageJson.dependencies,
      "@react-navigation/bottom-tabs": "^6.0.0",
    };
  }

  const devDeps = Object.keys(packageJson.devDependencies).length;
  if (!devDeps) delete packageJson.devDependencies;

  await fs.writeFile(
    packageJsonPath,
    JSON.stringify(packageJson, null, 2) + os.EOL
  );

  if (skipInstall) return;

  console.log("\nInstalling dependencies:");
  for (const dependency in packageJson.dependencies)
    console.log(`- ${cyan(dependency)}`);

  if (devDeps) {
    console.log("\nInstalling devDependencies:");
    for (const dependency in packageJson.devDependencies)
      console.log(`- ${cyan(dependency)}`);
  }

  console.log();

  // Install dependencies
  try {
    execSync(`${packageManager} install`, { stdio: "inherit" });
  } catch (error) {
    console.error("Failed to install dependencies:", error);
    process.exit(1);
  }
};
