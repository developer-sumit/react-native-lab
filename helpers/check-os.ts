import os from "os";

/**
 * Enum for operating system values.
 */
export enum OS {
  Windows = "Windows",
  macOS = "macOS",
  Linux = "Linux",
  Unknown = "Unknown",
}

/**
 * Function to check the operating system.
 * @returns {OperatingSystem} - The name of the operating system.
 */
export function checkOS(): OS {
  const platform = os.platform();

  switch (platform) {
    case "win32":
      return OS.Windows;
    case "darwin":
      return OS.macOS;
    case "linux":
      return OS.Linux;
    default:
      return OS.Unknown;
  }
}
