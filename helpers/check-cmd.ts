import { execSync } from "child_process";

/** Function to check if a command exists */
/**
 * Checks if a given command is available in the system's PATH.
 *
 * @param command - The name of the command to check.
 * @returns `true` if the command is found, otherwise `false`.
 */
export default function checkCommand(command: string): boolean {
  try {
    execSync(`where ${command}`, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}
