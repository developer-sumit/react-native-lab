import { PackageManager } from "./helpers/get-pkg-manager";

export type TemplateType =
  | "blank"
  | "bottom-navigation"
  | "stack-navigation"
  | "drawer-navigation";

export type TemplateMode = "default" | "nativewind";

export type EnvPackages = "react-native-config" | "react-native-dotenv";

export type StateManagementType = "none" | "zustand" | "redux-toolkit";

// Planned for later
// export type StylingType = "stylesheet" | "nativewind" | "restyle" | "unistyles";

export interface GetTemplateFileArgs {
  /**
   * The template to get the file for
   * @example "stack-navigation"
   */
  template: TemplateType;

  /**
   * The mode of the template. Either default or nativewind
   */
  mode: TemplateMode;

  /**
   * The file to get
   */
  file: string;
}

export interface InstallTemplateArgs {
  /**
   * The name of the app
   */
  appName: string;

  /**
   * The package name for the app
   */
  packageName?: string;

  /**
   * The root directory of the app
   */
  root: string;

  /**
   * The package manager to use
   */
  packageManager: PackageManager;

  /**
   * Whether to enable env variables
   */
  envEnabled: boolean;

  /**
   * The package to use for env variables
   */
  envPackage: EnvPackages;

  /**
   * Whether to include custom hooks
   */
  includeCustomHooks: boolean;

  /**
   * The custom hooks to include
   */
  customHooks: string[];

  /**
   * Whether to include the console remover
   */
  includeConsoleRemover: boolean;

  /**
   * The template to install
   */
  template: TemplateType;

  /**
   * Whether to use the src directory
   */
  srcDir: boolean;

  /**
   * The mode of the template. Either default or nativewind
   * If nativewind is selected, the template will be installed with NativeWind
   */
  nativeWind: boolean;

  /**
   * The state management library to use
   */
  stateManagement?: StateManagementType;

  /**
   * Whether to skip installing dependencies
   */
  skipInstall: boolean;
}
