# Contributing to React Native Lab

Thank you for your interest in contributing to `react-native-lab`! This guide provides instructions on how to set up your development environment and use the internal tools to ensure your changes work as expected.

## 🛠️ Development Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/developer-sumit/react-native-lab.git
   cd react-native-lab
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Build the project**:

   ```bash
   npm run build
   ```

4. **Test locally**:
   Link the package globally to test it as a CLI command.
   ```bash
   npm link
   npx react-native-lab
   ```

---

## 🔧 Internal Admin Tools

We have created a dedicated Admin CLI to assist with maintenance and testing. This tool is located in `scripts/admin.ts`.

### 1. Check for Dependency Updates

Ensure that the hardcoded template dependencies (e.g., `react-native`, `nativewind`, `react-navigation`) are up to date with the latest versions on npm.

```bash
npx tsx scripts/admin.ts check-updates
```

**Output:**

```text
Checking dependencies...
Package                                  Current         Latest          Status
================================================================================
react-native                             0.76.1          0.77.0          Outdated
nativewind                               2.0.11          2.0.11          OK
...
```

### 2. End-to-End Test Generation

To verify that the CLI generates a working project without manually answering prompts every time, use the `test-gen` command. This uses a headless configuration to generate a full project.

```bash
npx tsx scripts/admin.ts test-gen [ProjectName]
```

**Example:**

```bash
npx tsx scripts/admin.ts test-gen TestApp
```

This will:

1.  Clean up any existing folder named `TestApp`.
2.  Run the CLI in non-interactive mode using a preset configuration.
3.  Generate the project in the current directory.

---

## 📝 Coding Guidelines

- **TypeScript**: We use TypeScript for everything. Ensure strict typing where possible.
- **Prompts**: Use `@clack/prompts` for all user interactions.
- **Formatting**: We use Prettier/ESLint. Run `npm run lint` before committing.

## 🚀 Releasing

The project is configured to automatically publish to npm when the version in `package.json` is bumped and pushed to `main`.

1.  Update version in `package.json`.
2.  Update `CHANGELOG.md`.
3.  Push to `main`.
4.  The GitHub Action will handle the rest.
