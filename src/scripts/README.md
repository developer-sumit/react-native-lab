# Scripts Folder

This folder contains PowerShell scripts for setting up development environments.

## Scripts

### 1. Install Android Studio
This script installs Android Studio on your machine.

### 2. Install Chocolatey
This script installs Chocolatey, a package manager for Windows.

## Usage

To run the scripts, open PowerShell with administrative privileges and execute the desired script:

```powershell
./installAndroidStudio.ps1
./installChocolatey.ps1
```

Make sure to adjust execution policies if necessary:

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## Notes

- Ensure you have the necessary permissions to install software.
- Follow any prompts during the installation process.
