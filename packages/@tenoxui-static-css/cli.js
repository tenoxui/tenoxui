#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { program } from "commander";
import chokidar from "chokidar";
import ora from "ora";
import chalk from "chalk";
import { GenerateCSS } from "./dist/static-css.min.js";

const packageJson = JSON.parse(fs.readFileSync("./package.json"), "utf-8");

program
  .version(packageJson.version)
  .option("-c, --config <path>", "Path to the configuration file")
  .option("-w, --watch", "Watch for file changes")
  .option("-o, --output <path>", "Output file path (overrides config file)")
  .option("-v, --verbose", "Verbose output")
  .option("--init", "Initialize a new configuration file")
  .parse(process.argv);

const options = program.opts();

async function loadConfig(configPath) {
  const extensions = [".js", ".cjs", ".mjs"];
  let fullPath;
  let configModule;

  if (configPath) {
    fullPath = path.resolve(process.cwd(), configPath);
    if (!fs.existsSync(fullPath)) {
      console.error(chalk.red(`Configuration file not found: ${fullPath}`));
      process.exit(1);
    }
  } else {
    for (const ext of extensions) {
      const testPath = path.resolve(process.cwd(), `tenoxui.config${ext}`);
      if (fs.existsSync(testPath)) {
        fullPath = testPath;
        break;
      }
    }
    if (!fullPath) {
      console.error(chalk.red("No configuration file found. Use --init to create one."));
      process.exit(1);
    }
  }

  const extension = path.extname(fullPath);

  try {
    if (extension === ".mjs") {
      configModule = await import(fileURLToPath(new URL(fullPath, import.meta.url)));
    } else {
      configModule = await import(fullPath);
    }
  } catch (error) {
    if (error.code === "ERR_REQUIRE_ESM") {
      configModule = await import(fileURLToPath(new URL(fullPath, import.meta.url)));
    } else if (error.code === "ERR_MODULE_NOT_FOUND") {
      configModule = require(fullPath);
    } else {
      throw error;
    }
  }

  return configModule.default || configModule;
}

function initConfig() {
  const configTemplate = `export default {
  input: ["src/**/*.{html,jsx}"],
  output: "dist/styles.css",
  property: {
    text: "color",
    bg: "background",
    // Add more properties here
  },
  breakpoints: [
    { name: "sm", max: 640 },
    { name: "md", min: 641, max: 768 },
    { name: "lg", min: 769 }
  ]
};
`;

  const configPath = path.resolve(process.cwd(), "tenoxui.config.js");
  if (fs.existsSync(configPath)) {
    console.error(chalk.red("Configuration file already exists. Aborting initialization."));
    process.exit(1);
  }

  fs.writeFileSync(configPath, configTemplate);
  console.log(chalk.green("Configuration file created successfully: tenoxui.config.js"));
  process.exit(0);
}

async function run() {
  if (options.init) {
    initConfig();
    return;
  }

  const spinner = ora("Loading configuration...").start();
  let config;

  try {
    config = await loadConfig(options.config);
    spinner.succeed("Configuration loaded");
  } catch (error) {
    spinner.fail("Failed to load configuration");
    console.error(chalk.red("Error loading configuration:"), error);
    process.exit(1);
  }

  if (options.output) {
    config.output = options.output;
  }

  const generator = new GenerateCSS(config);

  function generate() {
    const generateSpinner = ora("Generating CSS...").start();

    try {
      const result = generator.generateFromFiles();

      generateSpinner.succeed("CSS generation complete");
      if (options.verbose) {
        console.log(chalk.cyan("Generated CSS Preview: \n"));
        console.log(result.slice(0, 500) + (result.length > 500 ? " ..." : ""));
      }
    } catch (error) {
      generateSpinner.fail("CSS generation failed");
      console.error(chalk.red("Error during CSS generation:"), error);
    }
  }

  generate();

  if (options.watch) {
    console.log(chalk.yellow("Watching for file changes..."));
    const watcher = chokidar.watch(config.input, {
      ignored: /(^|[/\\])\../,
      persistent: true,
    });

    watcher
      .on("change", (path) => {
        console.log(chalk.blue(`File ${path} has been changed`));
        generate();
      })
      .on("add", (path) => {
        console.log(chalk.green(`File ${path} has been added`));
        generate();
      })
      .on("unlink", (path) => {
        console.log(chalk.red(`File ${path} has been removed`));
        generate();
      });
  }
}

run().catch((error) => {
  console.error(chalk.red("An error occurred:"), error);
  process.exit(1);
});
