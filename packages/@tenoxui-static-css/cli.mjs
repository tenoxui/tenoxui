#!/usr/bin/env node

import { program } from 'commander';
import fs from 'fs';
import path from 'path';
import chokidar from 'chokidar';
import { GenerateCSS } from './src/js/index.mjs';

program
  .option('-c, --config <path>', 'Path to the configuration file')
  .option('-w, --watch', 'Watch for file changes')
  .parse(process.argv);

const options = program.opts();

function loadConfig(configPath) {
  const fullPath = path.resolve(process.cwd(), configPath);
  if (fs.existsSync(fullPath)) {
    return import(fullPath).then(module => module.default);
  }
  console.error(`Configuration file not found: ${fullPath}`);
  process.exit(1);
}

async function run() {
  const configPath = options.config || 'tenoxui.config.js' || "tenoxui.config.mjs";
  const config = await loadConfig(configPath);
  
  const generator = new GenerateCSS(config);
  
  function generate() {
    console.log('Generating CSS...');
    generator.generateFromFiles();
    console.log('CSS generation complete.');
  }

  generate();

  if (options.watch) {
    console.log('Watching for file changes...');
    const watcher = chokidar.watch(config.input, {
      ignored: /(^|[\/\\])\../,
      persistent: true
    });

    watcher
      .on('change', path => {
        console.log(`File ${path} has been changed`);
        generate();
      })
      .on('add', path => {
        console.log(`File ${path} has been added`);
        generate();
      });
  }
}

run().catch(error => {
  console.error('An error occurred:', error);
  process.exit(1);
});
