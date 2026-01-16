import fs from "fs";
import path from "path";
import { PackageManager } from "./get-pkg-manager";
import colors from "picocolors";

export function setupCI(root: string, packageManager: PackageManager) {
  const workflowsDir = path.join(root, ".github", "workflows");
  fs.mkdirSync(workflowsDir, { recursive: true });

  let installCmd = "npm ci";
  let runCmd = "npm";

  if (packageManager === "yarn") {
    installCmd = "yarn install --frozen-lockfile";
    runCmd = "yarn";
  } else if (packageManager === "bun") {
    installCmd = "bun install --frozen-lockfile";
    runCmd = "bun";
  }

  const setupStep =
    packageManager === "bun"
      ? `- name: Setup Bun
        uses: oven-sh/setup-bun@v1`
      : `- name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: '${packageManager}'`;

  const ciContent = `name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      ${setupStep}
      - name: Install dependencies
        run: ${installCmd}
      - name: Lint
        run: ${runCmd} run lint

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      ${setupStep}
      - name: Install dependencies
        run: ${installCmd}
      - name: Run tests
        run: ${runCmd} test
`;

  fs.writeFileSync(path.join(workflowsDir, "ci.yml"), ciContent);
  console.log(colors.green("✓ Created GitHub Actions CI workflow."));
}
