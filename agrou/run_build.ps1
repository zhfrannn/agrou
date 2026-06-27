# Get Machine PATH from Registry
$machinePath = [System.Environment]::GetEnvironmentVariable("Path", "Machine")
# Get User PATH from Registry
$userPath = [System.Environment]::GetEnvironmentVariable("Path", "User")
# Combine and set process PATH
$env:PATH = "$machinePath;$userPath"

Write-Output "Executing npm run build with registry PATH..."
npm run build
