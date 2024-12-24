import { execSync } from "child_process";

/** Function to check if a command exists */
/**
 * Checks if a given command is available in the system's PATH.
 *
 * @param command - The name of the command to check.
 * @returns `true` if the command is found, otherwise `false`.
 */
export default function checkCommand(command: string): boolean {
  const platform = process.platform;
  let cmd: string;

  if (platform === "win32") {
    cmd = `where ${command}`;
  } else if (platform === "linux") {
    cmd = `which ${command}`;
  } else {
    console.warn(`Unsupported platform: ${platform}`);
    return false;
  }

  try {
    execSync(cmd, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}
