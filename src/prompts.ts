import {
  intro,
  outro,
  text,
  select,
  confirm,
  multiselect,
  isCancel,
  cancel,
  spinner,
} from "@clack/prompts";
import colors from "picocolors";
import checkCommand from "./helpers/check-cmd";
import checkOS, { OS } from "./helpers/check-os";
import { fetchReactNativeVersions } from "./helpers/fetch-rn-versions";
import { PackageManager } from "./helpers/get-pkg-manager";
import { TemplateType, EnvPackages, StateManagementType } from "./types";

const { blue, red, green } = colors;

function handleCancel(value: unknown) {
  if (isCancel(value)) {
    cancel("Operation cancelled.");
    process.exit(0);
  }
}

export interface PromptResult {
  projectName: string;
  srcDir: boolean;
  template: TemplateType;
  installJDK?: boolean;
  installAndroidStudio?: boolean;
  installNativeWind: boolean;
  envEnabled: boolean;
  envPackage: EnvPackages;
  packageManager: PackageManager;
  packageName?: string;
  includeCustomHooks: boolean;
  selectedHooks: string[];
  includeConsoleRemover: boolean;
  reactNativeVersion: string;
  disableGit?: boolean;
  setupCI?: boolean;
  stateManagement?: StateManagementType;
}

export default async function prompts(): Promise<PromptResult> {
  console.clear();

  intro(colors.bgCyan(colors.black(" React Native Lab ")));

  const s = spinner();

  const projectName = await text({
    message: "What is the name of your React Native project?",
    defaultValue: "MyReactNativeApp",
    placeholder: "MyReactNativeApp",
    validate(value) {
      if (!/^[a-zA-Z0-9_]+$/.test(value)) {
        return "Project name can only contain letters, underscores, and hyphens.";
      }
    },
  });
  handleCancel(projectName);

  const srcDir = await confirm({
    message: 'Do you want to create a "src" folder for your files?',
    initialValue: true,
  });
  handleCancel(srcDir);

  const template = await select({
    message: "Which template would you like to use?",
    options: [
      { value: "blank", label: "Blank", hint: "A clean slate" },
      {
        value: "bottom-navigation",
        label: "Bottom Navigation",
        hint: "Tab bar navigation",
      },
      {
        value: "stack-navigation",
        label: "Stack Navigation",
        hint: "Stack based navigation",
      },
      {
        value: "drawer-navigation",
        label: "Drawer Navigation",
        hint: "Drawer menu navigation",
      },
    ],
    initialValue: "blank",
  });
  handleCancel(template);

  const osName = checkOS();
  let installJDK = false;
  let installAndroidStudio = false;

  if (osName === OS.Windows || osName === OS.Linux) {
    s.start(blue(`Checking for JDK installation...`));
    const isJDKInstalled = checkCommand("java");
    if (isJDKInstalled) {
      s.stop(green(`JDK is already installed.`));
    } else {
      s.stop(red(`JDK not found.`));
      const shouldInstallJDK = await confirm({
        message: "Would you like to install JDK?",
        initialValue: true,
      });
      handleCancel(shouldInstallJDK);
      if (shouldInstallJDK) installJDK = true;
    }

    s.start(blue(`Checking for Android Studio...`));
    const androidStudioCommand =
      osName === OS.Windows ? "studio64.exe" : "studio.sh";
    const isAndroidStudioInstalled = checkCommand(androidStudioCommand);
    if (isAndroidStudioInstalled) {
      s.stop(green(`Android Studio is already installed.`));
    } else {
      s.stop(red(`Android Studio not found.`));
      const shouldInstallAS = await confirm({
        message: "Would you like to install Android Studio?",
        initialValue: true,
      });
      handleCancel(shouldInstallAS);
      if (shouldInstallAS) installAndroidStudio = true;
    }
  }

  const enableAdditionalCustomization = await confirm({
    message: "Would you like to enable additional customization?",
    initialValue: false,
  });
  handleCancel(enableAdditionalCustomization);

  // Default values if no customization
  let packageManager: PackageManager = "npm";
  let packageName: string | undefined;
  let reactNativeVersion = "latest";
  let installNativeWind = false;
  let stateManagement: StateManagementType = "none";
  let envEnabled = false;
  let envPackage: EnvPackages = "react-native-config";
  let includeCustomHooks = false;
  let selectedHooks: string[] = [];
  let includeConsoleRemover = false;
  let initGit = true;
  let setupCI = false;

  if (enableAdditionalCustomization) {
    // Package Manager
    const pm = await select({
      message: "Which package manager would you like to use?",
      options: [
        { value: "npm", label: "npm" },
        { value: "yarn", label: "yarn" },
        { value: "bun", label: "bun" },
      ],
      initialValue: "npm",
    });
    handleCancel(pm);
    packageManager = pm as PackageManager;

    // Package Name
    const rawProjectName = (projectName as string)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .replace(/^[0-9]+/, "");
    const defaultPackageName = `com.${rawProjectName}.app`;

    const pkgName = await text({
      message: "What should be the package name?",
      defaultValue: defaultPackageName,
      placeholder: defaultPackageName,
      validate(value) {
        if (value && !/^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*)*$/.test(value)) {
          return "Package name must be in format: com.example.myapp";
        }
      },
    });
    handleCancel(pkgName);
    packageName = pkgName as string;

    // React Native Version
    s.start(blue("Fetching available React Native versions..."));
    const versions = await fetchReactNativeVersions();
    s.stop(green("Versions fetched."));

    const rnVersion = await select({
      message: "Which React Native version would you like to use?",
      options: versions.map((v) => ({ value: v.value, label: v.name })),
      initialValue: "latest",
    });
    handleCancel(rnVersion);

    if (rnVersion === "custom") {
      const customVersion = await text({
        message: "Please enter the React Native version:",
        validate(value) {
          if (!/^\d+\.\d+\.\d+$/.test(value))
            return "Please enter a valid version number.";
        },
      });
      handleCancel(customVersion);
      reactNativeVersion = customVersion as string;
    } else {
      reactNativeVersion = rnVersion as string;
    }

    // NativeWind
    const wind = await confirm({
      message: "Would you like to install NativeWind for styling?",
      initialValue: false,
    });
    handleCancel(wind);
    installNativeWind = wind as boolean;

    // State Management
    const sm = await select({
      message: "Which state management library would you like to use?",
      options: [
        {
          value: "none",
          label: "None (React Context)",
          hint: "Simple built-in state management",
        },
        {
          value: "zustand",
          label: "Zustand",
          hint: "Small, fast and scalable",
        },
        // { value: "redux-toolkit", label: "Redux Toolkit", hint: "Opinionated Redux toolset" }, // Planned for later
      ],
      initialValue: "none",
    });
    handleCancel(sm);
    stateManagement = sm as StateManagementType;

    // Env Vars
    const env = await confirm({
      message: "Do you want to set up a .env file for environment variables?",
      initialValue: false,
    });
    handleCancel(env);
    envEnabled = env as boolean;

    if (envEnabled) {
      const ep = await select({
        message: "Which package for environment variables?",
        options: [
          {
            value: "react-native-config",
            label: "react-native-config",
            hint: "Recommended",
          },
          { value: "react-native-dotenv", label: "react-native-dotenv" },
        ],
        initialValue: "react-native-config",
      });
      handleCancel(ep);
      envPackage = ep as EnvPackages;
    }

    // Custom Hooks
    const hooks = await confirm({
      message: "Would you like to include custom hooks?",
      initialValue: false,
    });
    handleCancel(hooks);
    includeCustomHooks = hooks as boolean;

    if (includeCustomHooks) {
      const sh = await multiselect({
        message: "Select custom hooks to include:",
        options: [
          { value: "useDebounce", label: "useDebounce" },
          { value: "useThrottle", label: "useThrottle" },
          { value: "usePrevious", label: "usePrevious" },
          { value: "useOrientation", label: "useOrientation" },
          { value: "useResponsiveLayout", label: "useResponsiveLayout" },
        ],
        required: false,
      });
      handleCancel(sh);
      selectedHooks = sh as string[];
    }

    // Console Remover
    const consoleRemove = await confirm({
      message: "Include automatic console log removal in production?",
      initialValue: false,
    });
    handleCancel(consoleRemove);
    includeConsoleRemover = consoleRemove as boolean;

    // Git Init
    const git = await confirm({
      message: "Initialize a new git repository?",
      initialValue: true,
    });
    handleCancel(git);
    initGit = git as boolean;

    // CI Setup
    const ci = await confirm({
      message: "Add GitHub Actions CI workflow?",
      initialValue: false,
    });
    handleCancel(ci);
    setupCI = ci as boolean;
  }

  outro(colors.green("Configuration complete! Starting setup..."));

  return {
    projectName: projectName as string,
    srcDir: srcDir as boolean,
    template: template as TemplateType,
    installJDK,
    installAndroidStudio,
    installNativeWind,
    envEnabled,
    envPackage,
    packageManager,
    packageName,
    includeCustomHooks,
    selectedHooks,
    includeConsoleRemover,
    reactNativeVersion,
    disableGit: !initGit,
    setupCI,
    stateManagement,
  };
}
