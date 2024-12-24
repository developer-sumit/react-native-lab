import path from "path";
import { fileURLToPath } from "url";

/**
 * Constructs the full path to a script file located in the "scripts" directory.
 *
 * @param scriptFileName - The name of the script file.
 * @returns The full path to the specified script file.
 */
function getScriptPath(scriptFileName: string): string {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  return path.join(__dirname, "src", "scripts", scriptFileName);
}

export default getScriptPath;
