# Create a PowerShell script to build and deploy!
# deploy.ps1

$timestamp = (Get-Date).ToString('yyyy-MM-dd-hh-mm-ss-tt')
$simpleDir = "./SolutionPackages/PCF_COMPONENT_NAME"                # <-- REPLACE TOKEN! #️⃣🔴 PCF_COMPONENT_NAME
$finalDir = "./SolutionPackages/PCF_COMPONENT_NAME-$timestamp"      # <-- REPLACE TOKEN! #️⃣🔴 PCF_COMPONENT_NAME
New-Item -ItemType Directory -Path $simpleDir -Force

# Go into this directory 
Push-Location $simpleDir 

# ===========================
# 🔴#️⃣ REPLACE TOKENS! ⬇️🔴
pac solution init --publisher-name "YOUR_PUBLISHER_NAME" --publisher-prefix "YOUR_PUBLISHER_PREFIX"

pac solution add-reference --path "../.."

# Go back to the original directory
Pop-Location

New-Item -ItemType Directory -Path $finalDir -Force
Move-Item -Path "$simpleDir/*" -Destination $finalDir
Remove-Item -Path $simpleDir -Force

# You must have your build tools installed!
msbuild /t:build /restore

# ===========================
# 🔴#️⃣ REPLACE TOKENS! ⬇️🔴 ENVIRONMENT_NAME
pac auth create --environment "ENVIRONMENT_NAME"
# ===========================
# 🔴#️⃣ REPLACE TOKENS! ⬇️🔴 YOUR_PUBLISHER_PREFIX
pac pcf push --publisher-prefix YOUR_PUBLISHER_PREFIX