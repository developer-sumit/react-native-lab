import fs from "fs";
import path from "path";
import { build } from "esbuild";
import { fileURLToPath } from "url";
import { nodeExternalsPlugin } from "esbuild-node-externals";

// Function to copy the templates folder recursively
function copyFiles(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });

  fs.mkdirSync(dest, { recursive: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    entry.isDirectory()
      ? copyFiles(srcPath, destPath)
      : fs.copyFileSync(srcPath, destPath);
  }
}

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templateSource = path.resolve(__dirname, "templates");
const templateDest = path.resolve(__dirname, "dist", "templates");

const scriptSource = path.resolve(__dirname, "scripts");
const scriptDist = path.resolve(__dirname, "dist", "scripts");

build({
  entryPoints: ["./index.ts"],
  bundle: true,
  outfile: "dist/index.js",
  platform: "node",
  format: "esm",
  plugins: [nodeExternalsPlugin()],
})
  .then(() => {
    copyFiles(templateSource, templateDest);
    copyFiles(scriptSource, scriptDist);
    console.log("Templates copied successfully.");
  })
  .catch((error) => {
    console.error("Error: ", error);
    process.exit(1);
  });
