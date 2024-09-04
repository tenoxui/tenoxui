#!/bin/bash

# Function to list all scripts from all workspaces
list_scripts() {
    for workspace in packages/*; do
        if [ -d "$workspace" ] && [ -f "$workspace/package.json" ]; then
            workspace_name=$(basename "$workspace")
            echo "workspace:$workspace_name"
            scripts=$(jq -r '.scripts | to_entries[] | "  |— \(.key): \(.value)"' "$workspace/package.json")
            if [ -n "$scripts" ]; then
                echo "$scripts"
            else
                echo "  No scripts found"
            fi
            echo
        fi
    done
}

# Function to run a specific script
run_script() {
    workspace=$(echo "$1" | cut -d':' -f2)
    script=$(echo "$1" | cut -d':' -f3)
    
    if [ -d "packages/$workspace" ] && [ -f "packages/$workspace/package.json" ]; then
        if jq -e ".scripts.\"$script\"" "packages/$workspace/package.json" > /dev/null 2>&1; then
            if command -v yarn &> /dev/null; then
                yarn workspace "$workspace" run "$script"
            else
                npm run "$script" --workspace="$workspace"
            fi
        else
            echo "Error: Script '$script' not found in workspace '$workspace'"
            exit 1
        fi
    else
        echo "Error: Workspace '$workspace' not found"
        exit 1
    fi
}

# Main script logic
if [ "$1" = "list" ]; then
    list_scripts
elif [[ "$1" =~ ^workspace:[^:]+:[^:]+$ ]]; then
    run_script "$1"
else
    echo "Usage:"
    echo "  $0 list                     # List all scripts from all workspaces"
    echo "  $0 workspace:<name>:<script> # Run a specific script in a workspace"
    exit 1
fi
