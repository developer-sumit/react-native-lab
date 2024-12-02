const { exec } = require("child_process");

// Function to execute shell commands
const execPromise = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, { cwd: process.cwd() }, (error, stdout, stderr) => {
      if (error) {
        reject(`Error: ${stderr || stdout}`);
      } else {
        resolve(stdout);
      }
    });
  });
};

// Main cleanup function
const cleanProject = async () => {
  try {
    console.log("Cleaning React Native project...");

    // Clear Watchman watches
    await execPromise("watchman watch-del-all");
    console.log("Cleared Watchman watches.");

    // Remove node_modules and lock files
    await execPromise("rm -rf node_modules yarn.lock package-lock.json");
    console.log("Removed node_modules and lock files.");

    // Clean iOS build artifacts
    await execPromise("rm -rf ios/Pods ios/Podfile.lock ios/build");
    console.log("Cleaned iOS build artifacts.");

    // Clean Android build artifacts
    await execPromise("rm -rf android/app/build android/build");
    console.log("Cleaned Android build artifacts.");

    // Install dependencies
    await execPromise("npm install"); // or 'yarn install'
    console.log("Installed npm packages.");

    // Install CocoaPods for iOS
    await execPromise("cd ios && pod install");
    console.log("Installed CocoaPods.");

    // Start Metro bundler with reset cache
    await execPromise("npm start -- --reset-cache");
    console.log("Started Metro bundler with reset cache.");

    console.log("React Native project cleaned successfully!");
  } catch (error) {
    console.error(error);
  }
};

// Run the cleanup function
cleanProject();
