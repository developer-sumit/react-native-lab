export type PackageManager = "npm" | "yarn" | "bun";

/**
 * Determines the package manager being used based on the `npm_config_user_agent` environment variable.
 *
 * @returns {PackageManager} The detected package manager. Possible values are "npm", "yarn", "bun".
 * If no specific package manager is detected, defaults to "npm".
 */
export default function getPkgManager(): PackageManager {
  const userAgent = process.env["npm_config_user_agent"] || "";

  if (userAgent.startsWith("npm")) {
    return "npm";
  }

  if (userAgent.startsWith("yarn")) {
    return "yarn";
  }

  if (userAgent.startsWith("bun")) {
    return "bun";
  }

  return "npm";
}
