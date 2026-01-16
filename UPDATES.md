# 🔮 Updates & Roadmap

This document outlines the future vision for `react-native-lab`. We prioritize features that reduce "setup fatigue" and enforce professional best practices.

## 📦 Package Manager Recommendation

For developing `react-native-lab` itself, we recommend using **npm**.

- **Why?** It is the default for Node.js, ensuring maximum compatibility for contributors without requiring additional tools.
- **Future Consideration:** If the repository grows into a monorepo (e.g., separating templates into packages), we will migrate to **pnpm** for its workspace efficiency and disk space savings.

---

## 📅 Roadmap

### v1.4.0: Asset Optimization & Splash Screens 🎨

**Goal:** Automate the tedious process of generating app icons and splash screens.

- **Feature:** `npx react-native-lab generate-assets`
- **Why:** Developers hate manually resizing images for Android/iOS.
- **Tech:** Integrate `react-native-bootsplash` or similar tools automatically.

### v1.5.0: State Management Selection 🧠

**Goal:** Give developers options for rigorous state management beyond React Context.

- **Feature:** Option to add **Zustand** or **Redux Toolkit** during setup.
- **Why:** As apps scale, Context API often falls short. Zustand is growing in popularity for its simplicity, while Redux remains the enterprise standard.

### v1.6.0: API & Networking Layer 🌐

**Goal:** Provide a production-ready networking setup.

- **Feature:** Pre-configured `TanStack Query` (React Query) + `Axios` instance.
- **Why:** Dealing with caching, loading states, and error handling is mandatory in every app. We should automate the best-practice setup.

### v2.0.0: The Plugin System 🧩

**Goal:** Move from a "CLI tool" to a "Platform".

- **Feature:** Allow the community to create and publish their own templates (e.g., `react-native-lab init --template @user/my-template`).
- **Why:** We can't maintain every possible stack. Empowering the community scales the ecosystem indefinitely.

### v2.1.0: Expo Support? 🤔

**Goal:** Support the Expo ecosystem.

- **Feature:** `react-native-lab init --type expo`
- **Why:** Expo is becoming the default for many. Creating a unified CLI for both bare and Expo workflows would be powerful.

---

## 🛠️ Internal Improvements (Continuous)

- **Test Coverage:** Increase unit and E2E test coverage for the CLI.
- **Telemetry:** Optional, anonymous usage tracking to see which templates are most popular (strictly no PII).
