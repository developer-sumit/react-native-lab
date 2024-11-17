#!/usr/bin/env node
/* eslint-disable import/no-extraneous-dependencies */

// BUILT-IN MODULES
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
// THIRD-PARTY MODULES
import ora from "ora";
import chalk from "chalk";
import sudo from "sudo-prompt";
import isAdmin from "is-admin";
import inquirer from "inquirer";
import cliSpinners from "cli-spinners";

const options = { name: "RN Setup by Sumit Singh Rathore" };

// Function to check if a command exists
function checkCommand(command: string): boolean {
  try {
    execSync(`where ${command}`);
    return true;
  } catch {
    return false;
  }
}

// Function to install Chocolatey
async function installChocolatey() {
  const spinner = ora({
    text: chalk.blue("Installing Chocolatey..."),
    spinner: cliSpinners.dots,
  }).start();

  try {
    if (!(await isAdmin())) {
      spinner.info(chalk.yellow("Requesting administrator privileges..."));
      await new Promise<void>((resolve, reject) => {
        sudo.exec(
          "powershell.exe -Command \"[System.Net.ServicePointManager]::SecurityProtocol = 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))\"",
          options,
          (error, stdout, stderr) => {
            if (error) {
              spinner.fail(chalk.red("Failed to install Chocolatey."));
              console.error(error);
              throw error;
            } else {
              spinner.succeed(
                chalk.green("Chocolatey installed successfully.")
              );
            }
          }
        );
      });
    } else {
      execSync(
        "powershell.exe -Command \"[System.Net.ServicePointManager]::SecurityProtocol = 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))\"",
        { stdio: "inherit" }
      );
      spinner.succeed(chalk.green("Chocolatey installed successfully."));
    }
  } catch (error) {
    spinner.fail(chalk.red("Failed to install Chocolatey."));
    throw error;
  }
}

// Function to install JDK
async function installJDK() {
  const spinner = ora({
    text: chalk.blue("Checking for JDK installation..."),
    spinner: cliSpinners.dots,
  }).start();

  if (process.platform === "win32") {
    if (!checkCommand("java")) {
      spinner.text = chalk.yellow("JDK not found, installing OpenJDK...");
      spinner.start();
      if (!checkCommand("choco")) {
        await installChocolatey();
      }
      try {
        execSync("choco install -y microsoft-openjdk17", { stdio: "inherit" });
        spinner.succeed(chalk.green("OpenJDK installed successfully."));
      } catch (error) {
        spinner.fail(chalk.red("Failed to install OpenJDK."));
        throw error;
      }
    } else {
      spinner.succeed(chalk.green("JDK is already installed."));
    }

    // Set JAVA_HOME environment variable
    const javaHomePath = execSync("echo %JAVA_HOME%").toString().trim();
    if (!javaHomePath) {
      const javaPath = execSync("where java").toString().split("\r\n")[0];
      const javaHome = path.dirname(path.dirname(javaPath));
      try {
        execSync(`setx JAVA_HOME "${javaHome}" /M`, { stdio: "inherit" });
        execSync(`setx PATH "%PATH%;${javaHome}\\bin" /M`, {
          stdio: "inherit",
        });
        spinner.succeed(
          chalk.green("JAVA_HOME environment variable set successfully.")
        );
      } catch (error) {
        spinner.fail(
          chalk.red("Failed to set JAVA_HOME environment variable.")
        );
        throw error;
      }
    }
  } else {
    spinner.fail(
      chalk.red("Please install OpenJDK manually on non-Windows systems.")
    );
  }
}

// Function to install Android Studio
async function installAndroidStudio() {
  const spinner = ora({
    text: chalk.blue("Checking for Android Studio installation..."),
    spinner: cliSpinners.dots,
  }).start();

  const androidStudioPath = path.join(
    process.env.ProgramFiles || "C:\\Program Files",
    "Android",
    "Android Studio",
    "bin",
    "studio.exe"
  );

  if (process.platform === "win32") {
    if (!fs.existsSync(androidStudioPath)) {
      spinner.text = chalk.yellow("Installing Android Studio...");
      spinner.start();
      if (!checkCommand("choco")) {
        await installChocolatey();
      }
      try {
        execSync("choco install androidstudio", { stdio: "inherit" });
        spinner.succeed(chalk.green("Android Studio installed successfully."));
      } catch (error) {
        spinner.fail(chalk.red("Failed to install Android Studio."));
        throw error;
      }
    } else {
      spinner.succeed(chalk.green("Android Studio is already installed."));
    }

    // Set ANDROID_HOME environment variable
    const androidHomePath = path.join(
      process.env.ProgramFiles || "C:\\Program Files",
      "Android",
      "Sdk"
    );
    try {
      execSync(`setx ANDROID_HOME "${androidHomePath}" /M`, {
        stdio: "inherit",
      });
      execSync(`setx ANDROID_SDK_ROOT "${androidHomePath}" /M`, {
        stdio: "inherit",
      });
      execSync(
        `setx PATH "%PATH%;${androidHomePath}\\tools;${androidHomePath}\\platform-tools" /M`,
        { stdio: "inherit" }
      );
      spinner.succeed(
        chalk.green(
          "ANDROID_HOME and ANDROID_SDK_ROOT environment variables set successfully."
        )
      );
    } catch (error) {
      spinner.fail(
        chalk.red(
          "Failed to set ANDROID_HOME and ANDROID_SDK_ROOT environment variables."
        )
      );
      throw error;
    }
  } else {
    spinner.fail(
      chalk.red(
        "Please install Android Studio manually on non-Windows systems."
      )
    );
  }
}

// Function to prompt user for project details
async function promptUserForProjectDetails() {
  const questions = [
    {
      type: "input",
      name: "projectName",
      message: "What is the name of your React Native project?",
      default: "MyReactNativeApp",
      validate: (input: string) =>
        input.length > 0 ? true : "Project name cannot be empty.",
    },
    {
      type: "list",
      name: "template",
      message: "Which template would you like to use?",
      choices: ["Default", "TypeScript"],
    },
  ];

  return await inquirer.prompt(questions);
}

// Function to create a new React Native project
async function createReactNativeProject(projectName: string, template: string) {
  const spinner = ora({
    text: chalk.blue(`Creating React Native project "${projectName}"...`),
    spinner: cliSpinners.dots,
  }).start();

  const templateOption =
    template === "TypeScript"
      ? "--template react-native-template-typescript"
      : "";

  try {
    execSync(
      `npx @react-native-community/cli@latest init ${projectName} ${templateOption}`,
      { stdio: "inherit" }
    );
    spinner.succeed(
      chalk.green(`Project "${projectName}" created successfully.`)
    );
  } catch (error) {
    spinner.fail(chalk.red(`Failed to create project "${projectName}".`));
    throw error;
  }
}

// Main setup function
export async function setup() {
  console.log(chalk.cyan("Setting up React Native development environment..."));

  // Check and install necessary tools
  await installJDK();
  await installAndroidStudio();

  // Prompt user for project details
  const { projectName, template } = await promptUserForProjectDetails();

  // Create the React Native project with user inputs
  await createReactNativeProject(projectName, template);

  console.log(chalk.green("Setup completed successfully!"));
}

// Run the setup function
setup().catch((error) => {
  console.error(error);
  process.exit(1);
});
