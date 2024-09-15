#!/usr/bin/env bash

# Get the directory of the script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"
WST_SCRIPT=".temp/wst.temp.js"

# Detect the operating system
case "$(uname -s)" in
  Linux*) machine=Linux ;;
  Darwin*) machine=Mac ;;
  CYGWIN*) machine=Cygwin ;;
  MINGW*) machine=MinGw ;;
  MSYS_NT*) machine=Git ;;
  *) machine="UNKNOWN:${unameOut}" ;;
esac

# Function to set the installation directory
set_install_dir() {
  if [ "$machine" = "Linux" ] || [ "$machine" = "Mac" ]; then
    if [ -n "$PREFIX" ]; then
      INSTALL_DIR="$PREFIX/bin"
    else
      INSTALL_DIR="/usr/local/bin"
    fi
  elif [ "$machine" = "Cygwin" ] || [ "$machine" = "MinGw" ] || [ "$machine" = "Git" ]; then
    INSTALL_DIR="$HOME/bin"
  else
    echo "Unsupported operating system"
    exit 1
  fi
}

# Set the installation directory
set_install_dir

# Ensure the installation directory exists
mkdir -p "$INSTALL_DIR"

# Path to the wst file
WORKSPACE_SCRIPT="$SCRIPT_DIR/$WST_SCRIPT"

# Check if the wst file exists
if [ ! -f "$WORKSPACE_SCRIPT" ]; then
  echo "Error: wst file not found in $SCRIPT_DIR"
  exit 1
fi

# Make the script executable
chmod +x "$WORKSPACE_SCRIPT"

# Copy the script to the installation directory
if [ "$machine" = "Linux" ] || [ "$machine" = "Mac" ]; then
  cp "$WORKSPACE_SCRIPT" "$INSTALL_DIR/wst"
elif [ "$machine" = "Cygwin" ] || [ "$machine" = "MinGw" ] || [ "$machine" = "Git" ]; then
  cp "$WORKSPACE_SCRIPT" "$INSTALL_DIR/wst"
  # Create a batch file wrapper for Windows
  echo "@echo off" > "$INSTALL_DIR/wst.bat"
  echo "bash \"$INSTALL_DIR/wst\" %*" >> "$INSTALL_DIR/wst.bat"
fi

echo "Installation complete. The 'wst' command is now available."

# Reminder for users to add the directory to their PATH if necessary
if [ "$machine" = "Cygwin" ] || [ "$machine" = "MinGw" ] || [ "$machine" = "Git" ]; then
  echo "Make sure $INSTALL_DIR is in your PATH."
  echo "You may need to restart your terminal or run 'source ~/.bashrc' for changes to take effect."
fi
