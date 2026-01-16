import { program } from "commander";
import chalk from "chalk";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const TEMPLATE_FILE_PATH = path.join(process.cwd(), "src", "template.ts");

const extractDependencies = () => {
  const content = fs.readFileSync(TEMPLATE_FILE_PATH, "utf-8");
  const regex = /"([\w@/-]+)":\s*"\^?([0-9.]+)"/g;
  let match;
  const deps = [];
  while ((match = regex.exec(content)) !== null) {
    deps.push({ name: match[1], version: match[2] });
  }
  return deps;
};

program.version("0.0.1").description("Admin CLI for React Native Lab");

program
  .command("check-updates")
  .description("Check if template dependencies are up to date")
  .action(async () => {
    const { default: latestVersion } = await import("latest-version");

    console.log(chalk.blue("Checking dependencies..."));
    const deps = extractDependencies();

    console.log(
      `${chalk.bold("Package".padEnd(40))} ${chalk.bold("Current".padEnd(15))} ${chalk.bold("Latest".padEnd(15))} ${chalk.bold("Status")}`,
    );
    console.log("=".repeat(80));

    for (const dep of deps) {
      try {
        const latest = await latestVersion(dep.name);
        const isOutdated = latest !== dep.version;
        const status = isOutdated ? chalk.red("Outdated") : chalk.green("OK");
        console.log(
          `${dep.name.padEnd(40)} ${dep.version.padEnd(15)} ${latest.padEnd(15)} ${status}`,
        );
      } catch (e) {
        console.log(
          `${dep.name.padEnd(40)} ${dep.version.padEnd(15)} Error           ${chalk.yellow("Unknown")}`,
        );
      }
    }
  });

program
  .command("test-gen")
  .description("Generates a test project using the CLI in non-interactive mode")
  .argument("[name]", "Project name", "TestProject")
  .action((name) => {
    const config = {
      projectName: name,
      srcDir: true,
      template: "blank",
      installJDK: false,
      installAndroidStudio: false,
      installNativeWind: true,
      envEnabled: true,
      envPackage: "react-native-config",
      packageManager: "npm",
      packageName: `com.${name.toLowerCase()}.app`,
      includeCustomHooks: true,
      selectedHooks: ["useDebounce"],
      includeConsoleRemover: true,
      reactNativeVersion: "latest",
      disableGit: true,
      setupCI: true,
    };

    const env = {
      ...process.env,
      RN_LAB_CONFIG: JSON.stringify(config),
    };

    const projectPath = path.join(process.cwd(), name);
    if (fs.existsSync(projectPath)) {
      console.log(chalk.yellow(`Removing existing ${name}...`));
      fs.rmSync(projectPath, { recursive: true, force: true });
    }

    console.log(chalk.cyan(`Starting test generation for ${name}...`));
    try {
      const distPath = path.join(process.cwd(), "dist", "index.js");
      if (!fs.existsSync(distPath)) {
        console.log(chalk.yellow("Dist not found, building..."));
        execSync("npm run build", { stdio: "inherit" });
      }

      execSync(`node "${distPath}"`, {
        stdio: "inherit",
        env: env,
      });
      console.log(chalk.green("Test project generation passed!"));
    } catch (e) {
      console.error(chalk.red("Test generation failed."));
      process.exit(1);
    }
  });

program.parse(process.argv);
