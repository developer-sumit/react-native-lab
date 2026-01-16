# Changelog

All notable changes to this project will be documented in this file.

## [1.3.0] - 2026-01-16

### 🚀 New Features

- **Revamped CLI Design**: A completely new, modern, and interactive CLI experience using `@clack/prompts`.
- **CI/CD Integration**: Automatically generate GitHub Actions workflows for Linting and Testing.
- **Git Initialization**: Explicit option to initialize a Git repository.
- **Console Log Removal**: Added option to strip console logs in production builds.

### ✨ Improvements

- **Interactive Prompts**: Smoother and more visual prompts with better error handling and cancellation support.
- **Project Setup**: clearer steps and spinners for long-running tasks.
- **Validation**: Improved validation for package names and versions.

## [1.1.0] - 2024-12-15

### New Features

- **NativeWind Integration**: You can now easily integrate NativeWind for styling, making it quicker to set up Tailwind-like utilities in your React Native project.
- **React Native Version Selection**: Added the ability to choose the React Native version during project setup. Specify your preferred version, and react-native-lab will handle the rest!

### Improvements

- Streamlined setup prompts for a more intuitive user experience.
- Minor fixes to ensure better compatibility across different devices and environments.

### Existing Features

- Install JDK and Android Studio (if not already installed).
- Automatically set up environment variables.
- Create an `src` folder (optional).
- Add import aliases for cleaner code.
- Predefined templates for starting new projects: Blank, Bottom Navigation, Drawer Navigation, and Stack Navigation.

---

## [1.0.4] - 2024-12-15

### Changes

- **Regex Update for Project Naming Validation:**
  - Users can now only use **letters**, **underscores (`_`)**, and **hyphens (`-`)** in project names.
  - **Numbers** and other special characters are no longer allowed to ensure consistent and predictable project naming conventions.

#### Why This Change?

This update improves compatibility and avoids potential issues with tools or file systems that may not handle special characters well.

For earlier versions, see the [GitHub Releases](https://github.com/developer-sumit/react-native-lab/releases).
