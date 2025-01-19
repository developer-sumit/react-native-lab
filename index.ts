#!/usr/bin/env node
/* eslint-disable import/no-extraneous-dependencies */

import prompts from "./src/prompts";
import retry from "./src/helpers/retry";
import createReactNative from "./src/react-native-lab";
import { installJDK, installAndroidStudio } from "./src/install-scripts";

/** Main setup function */
async function setup() {
  const prompt = await prompts();

  if (prompt.installJDK) {
    await retry(installJDK);
  }

  if (prompt.installAndroidStudio) {
    await retry(installAndroidStudio);
  }

  // Create the React Native project with user inputs
  await createReactNative({
    appPath: prompt.projectName,
    packageManager: prompt.packageManager ? prompt.packageManager : "npm",
    reactNativeVersion:
      prompt.reactNativeVersion === "custom"
        ? prompt.customReactNativeVersion
        : prompt.reactNativeVersion || "latest",
    srcDir: prompt.srcDir,
    nativeWind: prompt.installNativeWind,
    envEnabled: prompt.envEnabled ? prompt.envEnabled : false,
    envPackage: prompt.envPackage ? prompt.envPackage : "react-native-config",
    includeCustomHooks: prompt.includeCustomHooks
      ? prompt.includeCustomHooks
      : false,
    customHooks: prompt.selectedHooks ? prompt.selectedHooks : [],
    includeConsoleRemover: prompt.includeConsoleRemover
      ? prompt.includeConsoleRemover
      : false,
    template: prompt.template,
    disableGit: prompt.disableGit,
    skipInstall: false,
  });
}

// Run the setup function
setup().catch((error) => {
  console.error("Setup failed:", error);
  process.exit(1);
});
