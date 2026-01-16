import { execSync } from "node:child_process";
import colors from "picocolors";

const { yellow } = colors;

export interface ReactNativeVersion {
  name: string;
  value: string;
}

/**
 * Fetches available React Native versions from npm
 * @returns Promise<ReactNativeVersion[]> Array of version objects
 */
export async function fetchReactNativeVersions(): Promise<ReactNativeVersion[]> {
  try {
    // Fetch versions from npm registry
    const output = execSync('npm view react-native versions --json', {
      encoding: 'utf8',
      timeout: 10000, // 10 second timeout
    });
    
    const versions: string[] = JSON.parse(output);
    
    // Filter out pre-release versions and get the last 10 stable versions
    const stableVersions = versions
      .filter(version => !version.includes('-') && !version.includes('alpha') && !version.includes('beta'))
      .slice(-10) // Get last 10 versions
      .reverse(); // Most recent first
    
    const versionChoices: ReactNativeVersion[] = [
      { name: "Latest", value: "latest" }
    ];
    
    // Add the stable versions (excluding the latest which is already added)
    stableVersions.slice(1).forEach(version => {
      versionChoices.push({
        name: version,
        value: version
      });
    });
    
    // Add custom option
    versionChoices.push({ name: "Custom", value: "custom" });
    
    return versionChoices;
  } catch (error) {
    console.log(yellow("\nWarning: Could not fetch React Native versions from npm. Using fallback versions."));
    
    // Fallback to hardcoded versions if network request fails
    return [
      { name: "Latest", value: "latest" },
      { name: "0.76.1", value: "0.76.1" },
      { name: "0.75.4", value: "0.75.4" },
      { name: "0.74.8", value: "0.74.8" },
      { name: "Custom", value: "custom" },
    ];
  }
}
