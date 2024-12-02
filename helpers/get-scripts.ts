import path from "path";
import { fileURLToPath } from "url";

// Function to get the path to script files
function getScriptPath(scriptFileName: string): string {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  return path.join(__dirname, "scripts", scriptFileName);
}

export default getScriptPath;
