import { W_OK } from "node:constants";
import { access } from "node:fs/promises";

/**
 * Checks if the given directory is writable.
 *
 * @param {string} directory - The path to the directory.
 * @returns {Promise<boolean>} - A promise that resolves to true if the directory is writable, otherwise false.
 */
export default async function isWritable(directory: string): Promise<boolean> {
  try {
    await access(directory, W_OK);
    return true;
  } catch (err) {
    return false;
  }
}
