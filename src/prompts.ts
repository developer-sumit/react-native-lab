/* eslint-disable import/no-extraneous-dependencies */

import ora from "ora";
import inquirer from "inquirer";
import colors from "picocolors";

import checkCommand from "../helpers/check-cmd";
import { checkOS, OS } from "../helpers/check-os";

export default async function prompts() {
  const questions = [];

  // Check the operating system
  const osName = checkOS();

  if (osName === OS.Windows) {
    // Check if JDK is installed
    const jdkSpinner = ora(
      colors.blue("Checking for JDK installation...")
    ).start();
    const isJDKInstalled = checkCommand("java");
    jdkSpinner.stop();
    if (!isJDKInstalled) {
      jdkSpinner.fail(colors.red("JDK not found."));
      questions.push({
        type: "confirm",
        name: "installJDK",
        message: "Would you like to install OpenJDK?",
        default: true,
      });
    } else {
      jdkSpinner.succeed(colors.green("JDK is already installed."));
    }
  } else {
    console.log(colors.yellow("Can't check for JDK installation on this OS."));
  }

  if (osName === OS.Windows) {
    // Check if Android Studio is installed
    const androidStudioSpinner = ora(
      colors.blue("Checking for Android Studio installation...")
    ).start();
    const isAndroidStudioInstalled = checkCommand("studio64.exe");
    androidStudioSpinner.stop();
    if (!isAndroidStudioInstalled) {
      androidStudioSpinner.fail(colors.red("Android Studio is not installed."));
      questions.push({
        type: "confirm",
        name: "installAndroidStudio",
        message: "Would you like to install it?",
        default: true,
      });
    } else {
      androidStudioSpinner.succeed(
        colors.green("Android Studio is already installed.")
      );
    }
  } else {
    console.log(
      colors.yellow("Can't check for Android Studio installation on this OS.")
    );
  }

  // Always ask for project name
  questions.push({
    name: "projectName",
    message: "What is the name of your React Native project?",
    default: "MyReactNativeApp",
    validate: (input: string) => {
      const isValid = /^[a-zA-Z_-]+$/.test(input);
      return isValid
        ? true
        : "Project name can only contain letters, underscores, and hyphens.";
    },
  });

  // Always ask for package manager
  questions.push({
    type: "list",
    name: "packageManager",
    message: "Which package manager would you like to use?",
    choices: ["npm", "yarn", "bun"], // pnpm and Deno are not supported
  });

  // Always ask for src folder
  questions.push({
    type: "confirm",
    name: "srcDir",
    message: 'Do you want to create a "src" folder for your files?',
    default: true,
  });

  // Always ask for template
  questions.push({
    type: "list",
    name: "template",
    message: "Which template would you like to use for your project?",
    choices: [
      { name: "Blank", value: "blank" },
      { name: "Bottom Tab Navigation", value: "bottom-navigation" },
      { name: "Stack Navigation", value: "stack-navigation" },
      { name: "Drawer Navigation", value: "drawer-navigation" },
      // These are not supported yet
      // { name: "Firebase", value: "firebase" },
      // { name: "Redux", value: "redux" },
      // { name: "GraphQL", value: "graphql" },
    ],
    default: "blank",
  });

  questions.push({
    type: "confirm",
    name: "envEnabled",
    message: "Do you want to set up a .env file for environment variables?",
    default: false,
  });

  return await inquirer.prompt(questions);
}
