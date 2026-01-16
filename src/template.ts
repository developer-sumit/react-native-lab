import os from "os";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import picocolors from "picocolors";
import { copyFiles } from "./helpers/copy";
import HookTemplates from "./templates/snippets/hooks";
import { GetTemplateFileArgs, InstallTemplateArgs } from "./types";

const { bold, cyan, green } = picocolors;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const getTemplateFile = ({
  template,
  mode,
  file,
}: GetTemplateFileArgs): string => {
  return path.join(__dirname, template, mode, file);
};

export const TEMPLATES = [
  "blank",
  "bottom-navigation",
  "stack-navigation",
  "drawer-navigation",
];
export const TEMPLATE_MODE = ["default", "nativewind"];
export const SRC_DIR_NAMES = ["assets", "screens", "components", "helpers"];

export const installTemplate = async ({
  appName,
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
}: InstallTemplateArgs) => {
  console.log(bold(`Using ${packageManager}.`));
  const isReactNativeDotEnv =
    envEnabled && envPackage === "react-native-dotenv";
  const isReactNativeConfig =
    envEnabled && envPackage === "react-native-config";

  console.log(green("\nInitializing project with template:"), template, "\n");
  const templatePath = path.join(
    __dirname,
    "templates",
    "project",
    template,
    nativeWind ? "nativewind" : "default"
  );

  await copyFiles(["**"], root, {
    parents: true,
    cwd: templatePath,
    rename: (name) => {
      if (
        srcDir &&
        (name === "App-src.tsx" || name === "tailwind-src.config.js")
      ) {
        return name.replace("-src", "");
      }
      return name === "gitignore" || name === "env" ? `.${name}` : name;
    },
    filter: (name) => {
      if (srcDir && (name === "App.tsx" || name === "tailwind.config.js"))
        return false;
      if (
        !srcDir &&
        (name === "App-src.tsx" || name === "tailwind-src.config.js")
      )
        return false;
      return true;
    },
  });

  if (srcDir) {
    await fs.mkdir(path.join(root, "src"), { recursive: true });
    await Promise.all(
      SRC_DIR_NAMES.map((file) =>
        fs
          .rename(path.join(root, file), path.join(root, "src", file))
          .catch((err) => {
            if (err.code !== "ENOENT") throw err;
          })
      )
    );
  }

  // Replace App.tsx and README.md
  await replaceFile(root, templatePath, "App.tsx", srcDir);
  await replaceFile(root, templatePath, "README.md");
  // Update babel.config.js
  const babelConfig = generateBabelConfig(
    isReactNativeDotEnv,
    nativeWind,
    srcDir,
    template,
    includeConsoleRemover
  );
  await fs.writeFile(path.join(root, "babel.config.js"), babelConfig, "utf8");

  // Create tsconfig.json
  const tsConfig = generateTsConfig(srcDir, template);
  await fs.writeFile(
    path.join(root, "tsconfig.json"),
    JSON.stringify(tsConfig, null, 2) + os.EOL
  );  // Update package.json
  const packageJson = await updatePackageJson(
    root,
    appName,
    isReactNativeDotEnv,
    isReactNativeConfig,
    nativeWind,
    template,
    includeConsoleRemover
  );
  // Add custom hooks
  if (includeCustomHooks && customHooks.length > 0) {
    const hooksDir = path.join(root, srcDir ? "src/hooks" : "hooks");
    await fs.mkdir(hooksDir, { recursive: true });
    for (const hook of customHooks) {
      await fs.writeFile(
        path.join(hooksDir, `${hook}.ts`),
        HookTemplates[hook as keyof typeof HookTemplates]
      );
    }
    // console.log(green("Custom Hooks added successfully."));
  }

  // Install dependencies
  console.log("\nDependencies:");
  Object.keys(packageJson.dependencies).forEach((dep) =>
    console.log(`- ${cyan(dep)}`)
  );
  if (packageJson.devDependencies) {
    console.log("\nDev Dependencies:");
    Object.keys(packageJson.devDependencies).forEach((dep) =>
      console.log(`- ${cyan(dep)}`)
    );
  }

  console.log(green("\nProject setup complete!"));
  console.log("\nTo install dependencies, run the following commands:");
  console.log(cyan(`  cd ${appName}`));
  console.log(cyan(`  ${packageManager} install`));

  if (packageManager === "npm") {
    console.log(cyan("\n  # Or, if you encounter peer dependency issues:"));
    console.log(cyan("  npm install --legacy-peer-deps"));
  }
};

async function replaceFile(
  root: string,
  templatePath: string,
  fileName: string,
  srcDir: boolean = false
) {
  const filePath = path.join(root, fileName);
  const templateFilePath = path.join(
    templatePath,
    srcDir ? `${fileName.replace(".", "-src.")}` : fileName
  );
  try {
    await fs.access(templateFilePath);
    await fs.copyFile(templateFilePath, filePath);
  } catch (err: any) {
    if (err.code === "ENOENT") {
      await fs.writeFile(filePath, "", "utf8");
    } else {
      throw err;
    }
  }
}

function generateBabelConfig(
  isReactNativeDotEnv: boolean,
  nativeWind: boolean,
  srcDir: boolean,
  template: string,
  includeConsoleRemover: boolean = false
) {
  return `
module.exports = {
  presets: ["module:@react-native/babel-preset", ${
    nativeWind ? `"nativewind/babel"` : ""
  }],
  plugins: [
    ${
      isReactNativeDotEnv
        ? `["module:react-native-dotenv", { moduleName: "@env", path: ".env", blacklist: null, whitelist: null, allowUndefined: true }],`
        : ""
    }
    ["module-resolver", {
      root: ["./"],
      alias: {
        "@assets": '${srcDir ? "./src/assets" : "./assets"}',
        ${
          template !== "blank"
            ? `"@screens": '${srcDir ? "./src/screens" : "./screens"}',`
            : ""
        }
      },
    }],
    ${template !== "blank" ? `"react-native-reanimated/plugin",` : ""}
    ${includeConsoleRemover ? `"transform-remove-console",` : ""}
  ],
};`;
}

function generateTsConfig(srcDir: boolean, template: string) {
  const tsConfig: any = {
    extends: "@react-native/typescript-config/tsconfig.json",
    compilerOptions: {
      jsx: "react",
      baseUrl: ".",
      paths: { "@assets/*": [srcDir ? "./src/assets/*" : "./assets/*"] },
    },
  };
  if (template !== "blank") {
    tsConfig.compilerOptions.paths["@screens/*"] = [
      srcDir ? "./src/screens/*" : "./screens/*",
    ];
  }
  return tsConfig;
}

async function updatePackageJson(
  root: string,
  appName: string,
  isReactNativeDotEnv: boolean,
  isReactNativeConfig: boolean,
  nativeWind: boolean,
  template: string,
  includeConsoleRemover: boolean = false
) {
  const packageJsonPath = path.join(root, "package.json");
  let existingPackageJson: any = {};
  try {
    const data = await fs.readFile(packageJsonPath, "utf8");
    existingPackageJson = JSON.parse(data);
  } catch (err: any) {
    if (err.code !== "ENOENT") throw err;
  }

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
      clean: "react-native clean",
      "build:ios": `react-native build-ios --mode "Release"`,
      "build:aab": "react-native build-android --mode=release",
      "build:apk": "react-native run-android -- --mode='release'",
    },
    dependencies: { ...existingPackageJson.dependencies },
    devDependencies: {
      ...existingPackageJson.devDependencies,
      "babel-plugin-module-resolver": "^5.0.2",
    },
    engines: { ...existingPackageJson.engines },
  };
  if (isReactNativeDotEnv) {
    packageJson.devDependencies["react-native-dotenv"] = "^3.4.11";
  }

  if (isReactNativeConfig) {
    packageJson.devDependencies["react-native-config"] = "^1.5.3";
    await updateBuildGradle(root);
  }

  if (includeConsoleRemover) {
    packageJson.devDependencies["babel-plugin-transform-remove-console"] = "^6.9.4";
  }

  if (nativeWind) {
    Object.assign(packageJson.dependencies, {
      nativewind: "^4.1.23",
      "react-native-reanimated": "^3.16.3",
      "react-native-safe-area-context": "^4.14.0",
    });
    packageJson.devDependencies.tailwindcss = "^3.3.2";
  }

  if (template.includes("navigation")) {
    Object.assign(packageJson.dependencies, {
      "@react-navigation/native": "^7.0.14",
      "react-native-gesture-handler": "^2.21.2",
      "react-native-reanimated":
        packageJson.dependencies["react-native-reanimated"] || "^3.16.3",
      "react-native-safe-area-context":
        packageJson.dependencies["react-native-safe-area-context"] || "^4.14.0",
      "react-native-screens": "^4.3.0",
    });

    if (template === "stack-navigation") {
      packageJson.dependencies["@react-navigation/stack"] = "^7.0.14";
    } else if (template === "drawer-navigation") {
      packageJson.dependencies["@react-navigation/drawer"] = "^7.0.14";
    } else if (template === "bottom-navigation") {
      packageJson.dependencies["@react-navigation/bottom-tabs"] = "^7.0.14";
    }
  }

  if (!Object.keys(packageJson.devDependencies).length)
    delete packageJson.devDependencies;

  await fs.writeFile(
    packageJsonPath,
    JSON.stringify(packageJson, null, 2) + os.EOL
  );
  return packageJson;
}

async function updateBuildGradle(root: string) {
  const buildGradlePath = path.join(root, "android", "app", "build.gradle");
  const buildGradleContent = await fs.readFile(buildGradlePath, "utf8");
  const applyLines = buildGradleContent
    .split("\n")
    .filter((line) => line.startsWith("apply"));
  const lastApplyLineIndex = buildGradleContent.lastIndexOf(
    applyLines[applyLines.length - 1]
  );
  const updatedBuildGradleContent = [
    buildGradleContent.slice(
      0,
      lastApplyLineIndex + applyLines[applyLines.length - 1].length
    ),
    "\napply from: project(':react-native-config').projectDir.getPath() + \"/dotenv.gradle\"",
    buildGradleContent.slice(
      lastApplyLineIndex + applyLines[applyLines.length - 1].length
    ),
  ].join("");
  await fs.writeFile(buildGradlePath, updatedBuildGradleContent, "utf8");
}
