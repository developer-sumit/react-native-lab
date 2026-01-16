<h1 style="text-align: center;">🧪 React Native Lab</h1>

<div align="center">

![Github License](https://img.shields.io/github/license/developer-sumit/react-native-lab?style=flat-square)
![Github Version](https://img.shields.io/github/package-json/v/developer-sumit/react-native-lab?style=flat-square)
![Github Repo Created At](https://img.shields.io/github/created-at/developer-sumit/react-native-lab?style=flat-square)
![Github Repo Contributors](https://img.shields.io/github/contributors/developer-sumit/react-native-lab?style=flat-square)
![Github Repo Fork](https://img.shields.io/github/forks/developer-sumit/react-native-lab?style=flat-square)
![NPM Package Version](https://img.shields.io/npm/v/react-native-lab?style=flat-square)
![NPM Package Last Updated](https://img.shields.io/npm/last-update/react-native-lab?style=flat-square)
![NPM Package Downloads](https://img.shields.io/npm/dm/react-native-lab?style=flat-square)

</div>

<p align="center">
  <b>The ultimate CLI to kickstart your React Native journey with professional-grade templates and tools.</b>
</p>

---

`react-native-lab` automates the boring setup of React Native projects. We handle the configuration so you can start coding instantly.

### 🚀 Quick Start

```bash
npx react-native-lab@latest
```

### 💻 Usage Preview

_No screenshots needed! Here is how the interactive CLI guides you:_

```text
┌  React Native Lab
│
◇  What is the name of your React Native project?
│  MySuperApp
│
◇  Do you want to create a "src" folder for your files?
│  Yes
│
◇  Which template would you like to use?
│  Bottom Navigation
│
◇  Checking for JDK installation...
│  JDK is already installed.
│
◇  Checking for Android Studio...
│  Android Studio is already installed.
│
◇  Would you like to enable additional customization?
│  Yes
│
◇  Which package manager would you like to use?
│  npm
│
◇  What should be the package name?
│  com.mysuperapp.mobile
│
◇  Would you like to install NativeWind for styling?
│  Yes
│
◇  Include automatic console log removal in production?
│  Yes
│
◇  Add GitHub Actions CI workflow?
│  Yes
│
└  Configuration complete! Starting setup...
```

### ✨ Comprehensive Features

We take care of the details so you don't have to.

#### 🛠️ Smart Environment Setup

- **Automatic JDK Install**: Checks and installs OpenJDK (Windows/Linux) if missing.
- **Automatic Android Studio**: Downloads and configures Android Studio & SDKs (Windows/Linux).
- **Environment Variables**: Automatically sets `JAVA_HOME`, `ANDROID_HOME`, and adds tools to `PATH`.

#### 🎨 Templates & Design

- **Multiple Layouts**:
  - **Blank**: A clean slate.
  - **Bottom Navigation**: Tab-based navigation pre-configured.
  - **Stack Navigation**: Standard stack navigation.
  - **Drawer Navigation**: Drawer menu implementation.
- **NativeWind Support**: Optional integration of Tailwind CSS for React Native.

#### ⚙️ Project Configuration

- **Package Manager**: Support for `npm`, `yarn`, or `bun`.
- **Custom Package Name**: Easily set your Bundle ID (e.g., `com.company.app`).
- **React Native Version**: Choose between `latest` stable or a specific version.
- **Project Structure**: Optional clean `src/` directory organization.
- **Environment Secrets**: Choice of `react-native-config` or `react-native-dotenv`.

#### 🧑‍💻 Developer Experience (DX)

- **TypeScript First**: All code is typed by default.
- **Path Aliases**: Pre-configured aliases like `@assets`, `@components`, `@screens`, `@utils`.
- **Custom Hooks Library**: Optional inclusion of:
  - `useDebounce`
  - `useThrottle`
  - `usePrevious`
  - `useOrientation`
  - `useResponsiveLayout`

#### 🚀 Production Readiness

- **CI/CD Integration**: Automatically generates `.github/workflows/ci.yml` for linting and testing.
- **Console Log Removal**: Production builds automatically strip simple `console.log` statements for security and speed.
- **Git Initialization**: Auto-init Git repo and generate a tailored `.gitignore`.

### 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request [here](https://github.com/developer-sumit/react-native-lab).

### 📄 License

MIT © [Sumit Singh Rathore](https://github.com/developer-sumit)
