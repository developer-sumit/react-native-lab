const Scripts = {
  WATERMARK: `
  ,    ,    /\\   /\\
  /( /\\ )\\  _\\ \\_/ /_
  |\\_||_/| < \\_   _/ >
  \\______/  \\|0   0|/
    _\\/_   _(_  ^  _)_
   ( () ) /'\\|V"""V|/'\\
     {}   \\  \\_____/  \\/
     ()   /\\   )=(   /\\
     {}  /  \\_/\\=/\\_/  \\

    React Native Lab
  `,

  INSTALL_CHOCOLATELY_AS_NON_ADMIN: `
# Set directory for installation - Chocolatey does not lock
# down the directory if not the default
$InstallDir='C:\\ProgramData\\chocoportable'
$env:ChocolateyInstall="$InstallDir"


# If your PowerShell Execution policy is restrictive, you may
# not be able to get around that. Try setting your session to
# Bypass.
Set-ExecutionPolicy Bypass -Scope Process -Force;

# All install options - offline, proxy, etc at
# https://chocolatey.org/install
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Optionally, you can verify the installation by checking the Chocolatey version
# choco --version
`,

  INSTALL_ANDROID_STUDIO: `
# Check if Chocolatey is installed
if (-Not (Get-Command choco -ErrorAction SilentlyContinue)) {
    Write-Host "Chocolatey is not installed. Please install Chocolatey first."
    exit 1
}

# Function to install Android Studio
function Install-AndroidStudio {
    Write-Host "Installing Android Studio using Chocolatey..."
    
    # Attempt to install Android Studio
    try {
        choco install androidstudio -y
        Write-Host "Android Studio installation completed successfully."
        } catch {
            Write-Host "Failed to install Android Studio. Error: $_"
            exit 1
            }
            }
            
# Call the installation function
Install-AndroidStudio
`,
};

export default Scripts;
