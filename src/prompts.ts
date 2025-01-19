import ora from "ora";
import colors from "picocolors";
import inquirer, { Answers } from "inquirer";
import checkCommand from "./helpers/check-cmd";
import checkOS, { OS } from "./helpers/check-os";

const { blue, red, green, yellow } = colors;

const checkInstallation = async (name: string, command: string) => {
  const spinner = ora(blue(`Checking for ${name} installation...`)).start();
  const isInstalled = checkCommand(command);
  spinner.stop();

  if (!isInstalled) {
    spinner.fail(red(`${name} not found.`));
    return {
      type: "confirm",
      name: `install${name.replace(/\s/g, "")}`,
      message: `Would you like to install ${name}?`,
      default: true,
    };
  }

  spinner.succeed(green(`${name} is already installed.`));
  return null;
};

const questions = [
  {
    name: "projectName",
    message: "What is the name of your React Native project?",
    default: "MyReactNativeApp",
    validate: (input: string) =>
      /^[a-zA-Z0-9_]+$/.test(input) ||
      "Project name can only contain letters, underscores, and hyphens.",
  },
  {
    type: "confirm",
    name: "srcDir",
    message: 'Do you want to create a "src" folder for your files?',
    default: true,
  },
  {
    type: "list",
    name: "template",
    message: "Which template would you like to use for your project?",
    choices: [
      { name: "Blank", value: "blank" },
      { name: "Bottom Tab Navigation", value: "bottom-navigation" },
      { name: "Stack Navigation", value: "stack-navigation" },
      { name: "Drawer Navigation", value: "drawer-navigation" },
    ],
    default: "blank",
  },
  {
    type: "confirm",
    name: "installNativeWind",
    message: "Would you like to install NativeWind for styling?",
    default: false,
  },
  {
    type: "confirm",
    name: "envEnabled",
    message: "Do you want to set up a .env file for environment variables?",
    default: false,
  },
  {
    type: "list",
    name: "envPackage",
    message: "Which package would you like to use for environment variables?",
    choices: ["react-native-config", "react-native-dotenv"],
    when: (answers: Answers) => answers.envEnabled,
  },
  {
    type: "confirm",
    name: "enableAdditionalCustomization",
    message: "Would you like to enable additional customization?",
    default: false,
  },
  {
    type: "list",
    name: "packageManager",
    message: "Which package manager would you like to use?",
    choices: ["npm", "yarn", "bun"],
    when: (answers: Answers) => answers.enableAdditionalCustomization,
  },
  {
    type: "confirm",
    name: "includeCustomHooks",
    message: "Would you like to include custom hooks in your project?",
    default: false,
    when: (answers: Answers) => answers.enableAdditionalCustomization,
  },
  {
    type: "checkbox",
    name: "selectedHooks",
    message: "Select the custom hooks you want to include:",
    choices: [
      { name: "useDebounce", value: "useDebounce" },
      { name: "useThrottle", value: "useThrottle" },
      { name: "usePrevious", value: "usePrevious" },
      { name: "useOrientation", value: "useOrientation" },
      { name: "useResponsiveLayout", value: "useResponsiveLayout" },
    ],
    when: (answers: Answers) =>
      answers.includeCustomHooks && answers.enableAdditionalCustomization,
  },
  {
    type: "confirm",
    name: "includeConsoleRemover",
    message:
      "Would you like to include automatic console log removal for production builds?",
    default: false,
    when: (answers: Answers) => answers.enableAdditionalCustomization,
  },
  {
    type: "list",
    name: "reactNativeVersion",
    message: "Which React Native version would you like to use?",
    choices: [
      { name: "Latest", value: "latest" },
      { name: "0.75.2", value: "0.75.2" },
      { name: "0.74.6", value: "0.74.6" },
      { name: "Custom", value: "custom" },
    ],
    default: "latest",
    when: (answers: Answers) => answers.enableAdditionalCustomization,
  },
  {
    type: "input",
    name: "customReactNativeVersion",
    message: "Please enter the React Native version you would like to use:",
    when: (answers: Answers) =>
      answers.reactNativeVersion === "custom" &&
      answers.enableAdditionalCustomization,
    validate: (input: string) =>
      /^\d+\.\d+\.\d+$/.test(input) || "Please enter a valid version number.",
  },
];

export default async function prompts() {
  const osName = checkOS();
  const dynamicQuestions = [];

  if (osName === OS.Windows || osName === OS.Linux) {
    const jdkQuestion = await checkInstallation("JDK", "java");
    if (jdkQuestion) dynamicQuestions.push(jdkQuestion);

    const androidStudioCommand =
      osName === OS.Windows ? "studio64.exe" : "studio.sh";
    const androidStudioQuestion = await checkInstallation(
      "Android Studio",
      androidStudioCommand
    );
    if (androidStudioQuestion) dynamicQuestions.push(androidStudioQuestion);
  } else {
    console.log(
      yellow("Can't check for JDK and Android Studio installation on this OS.")
    );
  }

  const answers = await inquirer.prompt([...dynamicQuestions, ...questions]);

  if (answers.includeConsoleRemover) {
    console.log(yellow("\nConsole log removal feature included:"));
    console.log(
      green("- Automatically removes all console logs in production builds")
    );
    console.log("  This improves security and slightly reduces app size");
    console.log(
      yellow(
        "\nThis feature will be added to your project via a ConsoleRemover component."
      )
    );
  }

  return answers;
}
