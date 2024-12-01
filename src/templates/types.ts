import { PackageManager } from "../helpers/get-pkg-manager";

export type TemplateType =
  | "blank"
  | "bottom-navigation"
  | "stack-navigation"
  | "drawer-navigation";

export interface GetTemplateFileArgs {
  template: TemplateType;
  file: string;
}

export interface InstallTemplateArgs {
  appName: string;
  root: string;
  packageManager: PackageManager;
  envEnabled: boolean;
  template: TemplateType;
  srcDir: boolean;
  skipInstall: boolean;
}
