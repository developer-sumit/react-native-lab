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