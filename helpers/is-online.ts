import { lookup } from "node:dns/promises";

/**
 * Checks if the system is online by performing a DNS lookup on a specified URL.
 *
 * @returns {Promise<boolean>} A promise that resolves to `true` if the DNS lookup succeeds, indicating the system is online, or `false` if it fails.
 */
export default async function getOnline(): Promise<boolean> {
  try {
    await lookup("registry.yarnpkg.com");
    // If DNS lookup succeeds, we are online
    return true;
  } catch {
    return false;
  }
}
