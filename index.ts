#!/usr/bin/env node
/* eslint-disable import/no-extraneous-dependencies */

import prompts from "./src/prompts";
import retry from "./src/helpers/retry";
import createReactNative from "./src/react-native-lab";
import { installJDK, installAndroidStudio } from "./src/install-scripts";

/** Main setup function */
async function setup() {
  // Check for config from environment variable (for testing/automation)
  const envConfig = process.env["RN_LAB_CONFIG"];
  let prompt;

  if (envConfig) {
    try {
      prompt = JSON.parse(envConfig);
      console.log("Using configuration from environment variable.");
    } catch (e) {
      console.error("Failed to parse RN_LAB_CONFIG.");
      process.exit(1);
    }
  } else {
    prompt = await prompts();
  }

  if (prompt.installJDK) {
    await retry(installJDK);
  }

  if (prompt.installAndroidStudio) {
    await retry(installAndroidStudio);
  }
  // Create the React Native project with user inputs
  await createReactNative({
    appPath: prompt.projectName,
    packageManager: prompt.packageManager,
    reactNativeVersion: prompt.reactNativeVersion,
    packageName: prompt.packageName,
    srcDir: prompt.srcDir,
    nativeWind: prompt.installNativeWind,
    envEnabled: prompt.envEnabled,
    envPackage: prompt.envPackage,
    includeCustomHooks: prompt.includeCustomHooks,
    customHooks: prompt.selectedHooks,
    includeConsoleRemover: prompt.includeConsoleRemover,
    template: prompt.template,
    disableGit: prompt.disableGit,
    setupCI: prompt.setupCI,
    skipInstall: false,
  });
}

// Run the setup function
setup().catch((error) => {
  console.error("Setup failed:", error);
  process.exit(1);
});
