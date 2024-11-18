# React Native CLI Setup

![Github License](https://img.shields.io/github/license/developer-sumit/react-native-cli-setup)

**GITHUB** \
![Github Version](https://img.shields.io/github/package-json/v/developer-sumit/react-native-cli-setup)
![Github Repo Created At](https://img.shields.io/github/created-at/developer-sumit/react-native-cli-setup)
![Github Repo Contributors](https://img.shields.io/github/contributors/developer-sumit/react-native-cli-setup)
![Github Repo Fork](https://img.shields.io/github/forks/developer-sumit/react-native-cli-setup)

**NPM** \
![NPM Package Version](https://img.shields.io/npm/v/react-native-cli-setup)
![NPM Package Last Updated](https://img.shields.io/npm/last-update/react-native-cli-setup)
![NPM Package Downloads](https://img.shields.io/npm/dw/react-native-cli-setup)

`react-native-cli-setup` is a npm package tool to set up a React Native project with some pre-defined configurations. This tool helps you quickly set up a React Native development environment, including installing necessary dependencies like JDK, Android Studio, and the React Native CLI.

## Table of Contents

- 🚀 [Features](#🚀-features)
- ⚙️ [Prerequisites](#⚙️-prerequisites)
- 🏁 [Getting Started](#🏁-getting-started)
- 🛠️ [Common Issues](#🛠️-common-issues)
- 🆘 [Getting Help](#🆘-getting-help)
- 🤝 [Contributing](#🤝-contributing)
- 📜 [License](#📜-license)

## 🚀 Features

- Installs JDK (OpenJDK)
- Installs Android Studio
- Installs React Native CLI
- Adds system environment variables - ANDROID_HOME, ANDROID_SDK_ROOT, JAVA_HOME
- Initializes a new React Native project

## ⚙️ Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Windows operating system

## 🏁 Getting Started

To get started with `react-native-cli-setup`, follow these steps:

1. Ensure you have all the prerequisites installed on your system.
2. You can use `npx` to run the tool without installing it:
   ```sh
   npx react-native-cli-setup
   ```

## 🛠️ Common Issues

- **Installation Errors**: Ensure you have the correct versions of Node.js and npm installed. Try clearing the npm cache:
  ```sh
  npm cache clean --force
  ```
- **Permission Errors**: Run the command with elevated privileges (e.g., using `sudo` on macOS/Linux or running the terminal as an administrator on Windows).

## 🆘 Getting Help

If you need further assistance, you can:

- Check the [GitHub Issues](https://github.com/developer-sumit/react-native-cli-setup/issues) for similar problems.
- Open a new issue with detailed information about your problem.
- Reach out to the community for support.

By following these steps, you should be able to resolve most issues and get your React Native project up and running smoothly.

## 🤝 Contributing

Contributions are welcome! If you have any ideas, suggestions, or bug reports, please open an issue or submit a pull request.

To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature`).
6. Open a pull request.

Please make sure to follow the project's coding guidelines and standards.

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
