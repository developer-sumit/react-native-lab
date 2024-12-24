import { PackageManager } from "./helpers/get-pkg-manager";

export type TemplateType =
  | "blank"
  | "bottom-navigation"
  | "stack-navigation"
  | "drawer-navigation";

export type TemplateMode = "default" | "nativewind";

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
   * Whether to skip installing dependencies
   */
  skipInstall: boolean;
}
