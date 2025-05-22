#!/bin/bash

# REAPER project expected files (relative to repo root)
EXPECTED_FILES=(
  "package.json"
  "tailwind.config.js"
  "postcss.config.js"
  ".gitignore"
  "public/index.html"
  "src/index.js"
  "src/index.css"
  "src/App.jsx"
  "src/pages/CampaignDashboard.jsx"
  "src/pages/SceneManager.jsx"
  "src/pages/CombatTracker.jsx"
)

echo "Running REAPER repo maintenance..."

# --------- Repo Check ---------
MISSING=()
for file in "${EXPECTED_FILES[@]}"
do
  if [ ! -f "$file" ]; then
    MISSING+=("$file")
  fi
done

if [ ${#MISSING[@]} -eq 0 ]; then
  echo "✅ All expected files are present."
else
  echo "⚠️ Missing files:"
  for f in "${MISSING[@]}"; do
    echo "  - $f"
  done
fi

echo ""
echo "Checking for unexpected files in src and public folders..."

ALL_FILES=$(find src public -type f | sort)

UNEXPECTED=()
for f in $ALL_FILES
do
  found=false
  for e in "${EXPECTED_FILES[@]}"
  do
    if [ "$f" == "$e" ]; then
      found=true
      break
    fi
  done
  if ! $found; then
    UNEXPECTED+=("$f")
  fi
done

if [ ${#UNEXPECTED[@]} -eq 0 ]; then
  echo "✅ No unexpected files found."
else
  echo "⚠️ Unexpected files found:"
  for f in "${UNEXPECTED[@]}"; do
    echo "  - $f"
  done
fi

echo ""
read -p "Do you want to clean the repo (delete all files except .git and this script)? (y/n): " yn
if [[ "$yn" =~ ^[Yy]$ ]]; then
  echo "Cleaning repo..."
  shopt -s extglob
  rm -rf !( .git | repo-maintenance.sh )
  echo "Repo cleaned."
  
  # Check if repo_package exists
  if [ -d "repo_package" ]; then
    echo "Copying fresh files from repo_package/ ..."
    cp -r repo_package/* .
    echo "Files copied."
  else
    echo "Warning: repo_package/ folder not found. Skipping copy."
  fi

  echo "Running npm install ..."
  npm install
  echo "Setup complete."
else
  echo "Cleanup aborted."
fi

echo "REAPER repo maintenance complete."

