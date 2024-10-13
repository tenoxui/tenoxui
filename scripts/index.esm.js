#!/usr/bin/env ts-node
import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import readline from 'readline';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

// default color
var colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};
// default config
var defaultConfig = {
    packageManager: 'npm',
    workspacesDirs: ['packages/*']
};
// Utility function to match simple glob patterns (e.g., "packages/*")
function matchPattern(pattern, dirName) {
    if (pattern === '*')
        return true;
    return pattern === dirName;
}
// Function to list directories matching a glob pattern (basic support for "*") 🗿
function resolveWorkspaces(pattern, baseDir) {
    var parts = pattern.split(path.sep);
    var rootPart = parts[0];
    var subPattern = parts.slice(1).join(path.sep);
    var results = [];
    // Read all directories from the baseDir
    var dirContent = fs.readdirSync(baseDir, { withFileTypes: true });
    dirContent.forEach(function (dirent) {
        if (dirent.isDirectory() && matchPattern(rootPart, dirent.name)) {
            var fullPath = path.join(baseDir, dirent.name);
            // If there's no more sub-pattern to match, it's a final match
            if (!subPattern) {
                results.push(fullPath);
            }
            else {
                // Recurse into the directory to match the rest of the pattern
                results = results.concat(resolveWorkspaces(subPattern, fullPath));
            }
        }
    });
    return results;
}
// Find the root directory by checking if any workspace directory exists
function findRootDir(workspacesDirs) {
    if (workspacesDirs === void 0) { workspacesDirs = defaultConfig.workspacesDirs; }
    var currentDir = process.cwd();
    var root = path.parse(currentDir).root;
    // Check for any directory that matches the workspace directories
    while (!workspacesDirs.some(function (wsDir) {
        return fs.existsSync(path.join(currentDir, wsDir.replace(/\*/g, '')));
    }) &&
        currentDir !== root) {
        currentDir = path.dirname(currentDir);
    }
    return currentDir !== root ? currentDir : process.cwd();
}
// Load config
function loadConfig() {
    var rootDir = findRootDir(defaultConfig.workspacesDirs);
    var configPath = path.join(rootDir, 'workspace.json');
    var config = defaultConfig;
    if (fs.existsSync(configPath)) {
        try {
            var userConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
            config = __assign(__assign({}, config), userConfig);
        }
        catch (error) {
            console.error("".concat(colors.red, "Error reading config file: ").concat(error.message).concat(colors.reset));
        }
    }
    return config;
}
var packageJson = JSON.parse(fs.readFileSync(path.join(findRootDir(loadConfig().workspacesDirs), 'package.json'), 'utf-8'));
var config = loadConfig();
function getPackages() {
    var rootDir = findRootDir(config.workspacesDirs);
    var allPackages = [];
    config.workspacesDirs.forEach(function (workspaceDir) {
        var matchedDirs = resolveWorkspaces(workspaceDir, rootDir);
        matchedDirs.forEach(function (dir) {
            if (fs.existsSync(dir) && fs.lstatSync(dir).isDirectory()) {
                var packageJsonPath = path.join(dir, 'package.json');
                if (fs.existsSync(packageJsonPath)) {
                    var packageJson_1 = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
                    allPackages.push({
                        name: packageJson_1.name || path.basename(dir),
                        path: dir
                    });
                }
            }
        });
    });
    return allPackages;
}
// Get every scripts from all workspaces
function getScripts(packagePath) {
    var packageJsonPath = path.join(packagePath, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
        var packageJson_2 = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
        return packageJson_2.scripts || {};
    }
    return {};
}
// New list scripts function
function listScripts() {
    var packages = getPackages();
    packages.forEach(function (_a) {
        var name = _a.name, packagePath = _a.path;
        var scripts = getScripts(packagePath);
        console.log("".concat(colors.dim, "\u2014 workspace:").concat(colors.reset).concat(colors.bright).concat(colors.cyan).concat(name).concat(colors.reset));
        if (Object.keys(scripts).length > 0) {
            Object.entries(scripts).forEach(function (_a) {
                var scriptName = _a[0], scriptCmd = _a[1];
                console.log("".concat(colors.dim, "> ").concat(colors.reset).concat(colors.green).concat(scriptName).concat(colors.reset).concat(colors.dim, ": ").concat(scriptCmd).concat(colors.reset));
            });
        }
        else {
            console.log("".concat(colors.yellow, "\u2500 No scripts found.").concat(colors.reset));
        }
        console.log();
    });
}
// What package manager the user define on the config
function getPackageManagerCommand(packageManager, workspace, scriptName) {
    switch (packageManager.toLowerCase()) {
        case 'npm':
            return "npm run ".concat(scriptName, " --workspace=").concat(workspace);
        case 'yarn':
            return "yarn workspace ".concat(workspace, " run ").concat(scriptName);
        // not too recommend, use pnpm-workspace instead 🗿
        case 'pnpm':
            return "pnpm --filter ".concat(workspace, " run ").concat(scriptName);
        default:
            console.warn("".concat(colors.yellow, "Warning: Unknown package manager \"").concat(packageManager, "\". Defaulting to npm.").concat(colors.reset));
            return "npm run ".concat(scriptName, " --workspace=").concat(workspace);
    }
}
// Execute the script
function runScript(workspace, scriptName) {
    var command = getPackageManagerCommand(config.packageManager, workspace, scriptName);
    var startTime = process.hrtime();
    console.log("".concat(colors.dim, "> ").concat(command).concat(colors.reset));
    try {
        execSync(command, { stdio: 'inherit' });
        if (config.packageManager === 'npm' || config.packageManager === 'pnpm') {
            var _a = process.hrtime(startTime), seconds = _a[0], nanoseconds = _a[1];
            var duration = (seconds * 1000 + nanoseconds / 1e6).toFixed(2);
            console.log("".concat(colors.green, "Done in ").concat(duration, "ms").concat(colors.reset));
        }
    }
    catch (error) {
        console.error("".concat(colors.red, "Error executing script: ").concat(error.message).concat(colors.reset));
    }
}
// New search scripts function
function searchScripts(searchTerm) {
    var packages = getPackages();
    var results = [];
    packages.forEach(function (_a) {
        var name = _a.name, path = _a.path;
        var scripts = getScripts(path);
        Object.entries(scripts).forEach(function (_a) {
            var scriptName = _a[0], scriptCmd = _a[1];
            if (scriptName.includes(searchTerm) || scriptCmd.includes(searchTerm)) {
                results.push({ workspace: name, name: scriptName, command: scriptCmd });
            }
        });
    });
    return results;
}
// Display all available scripts with the term
function displaySearchResults(results) {
    if (results.length === 0) {
        console.log("".concat(colors.yellow, "No matching scripts found.").concat(colors.reset));
        return;
    }
    console.log("".concat(colors.bright, "Search results:").concat(colors.reset, "\n"));
    results.forEach(function (_a) {
        var workspace = _a.workspace, name = _a.name, command = _a.command;
        console.log("".concat(colors.cyan).concat(workspace).concat(colors.reset, " > ").concat(colors.green).concat(name).concat(colors.reset));
        console.log("".concat(colors.dim, "  ").concat(command).concat(colors.reset, "\n"));
    });
}
// Start interactive mode
function interactiveMode() {
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    console.log("".concat(colors.bright, "Interactive Mode").concat(colors.reset));
    console.log("Type 'exit' to quit, 'list' to show all scripts, or 'search <term>' to search scripts.");
    rl.prompt();
    rl.on('line', function (input) {
        var _a = input.trim().split(' '), command = _a[0], args = _a.slice(1);
        switch (command.toLowerCase()) {
            case 'exit':
                rl.close();
                break;
            case 'list':
                listScripts();
                break;
            case 'search':
                if (args.length > 0) {
                    var results = searchScripts(args.join(' '));
                    displaySearchResults(results);
                }
                else {
                    console.log("".concat(colors.yellow, "Please provide a search term.").concat(colors.reset));
                }
                break;
            case 'run':
                if (args.length >= 2) {
                    var workspace = args[0], script = args[1];
                    runScript(workspace, script);
                }
                else {
                    console.log("".concat(colors.yellow, "Please provide both workspace and script name.").concat(colors.reset));
                }
                break;
            default:
                console.log("".concat(colors.yellow, "Unknown command. Try 'list', 'search', 'run', or 'exit'.").concat(colors.reset));
        }
        rl.prompt();
    }).on('close', function () {
        console.log("".concat(colors.bright, "Goodbye!").concat(colors.reset));
        process.exit(0);
    });
}
var _a = process.argv, action = _a[2], args = _a.slice(3);
var useWhat = 'wst';
var command = "".concat(colors.reset).concat(colors.dim, "  ").concat(useWhat).concat(colors.reset).concat(colors.yellow).concat(colors.bright);
var workspaceName = "".concat(colors.dim).concat(colors.reset).concat(colors.cyan).concat(colors.bright).concat(packageJson.name).concat(colors.reset, " ").concat(colors.dim, "v").concat(packageJson.version).concat(colors.reset);
// start the script
console.log(workspaceName);
if (action === undefined) {
    console.log("\n".concat(colors.dim, "Usage:").concat(colors.reset));
    console.log("".concat(command, " list").concat(colors.reset).concat(colors.dim, " # List all scripts from all workspaces").concat(colors.reset));
    console.log("".concat(command, " run <workspace> <script>").concat(colors.reset).concat(colors.dim, " # Run a specific script from a workspace").concat(colors.reset));
    console.log("".concat(command, " search <term>").concat(colors.reset).concat(colors.dim, " # Search for a script by name or content").concat(colors.reset));
    console.log("".concat(command, " interactive").concat(colors.reset).concat(colors.dim, " # Start interactive mode").concat(colors.reset));
    console.log("\n".concat(colors.reset).concat(colors.dim, "Examples:").concat(colors.reset));
    console.log("".concat(command, " list"));
    console.log("".concat(command, " run core build"));
    console.log("".concat(command, " search test"));
    console.log("".concat(command, " interactive"));
}
else if (action === 'list') {
    listScripts();
}
else if (action === 'run' && args.length >= 2) {
    var workspace = args[0], script = args[1];
    runScript(workspace, script);
}
else if (action === 'search' && args.length > 0) {
    var results = searchScripts(args.join(' '));
    displaySearchResults(results);
}
else if (action === 'interactive') {
    interactiveMode();
}
else {
    console.log("".concat(colors.red, "Invalid command or missing arguments. Use without arguments to see usage.").concat(colors.reset));
}
