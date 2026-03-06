#!/usr/bin/env node

import inquirer from "inquirer";
import degit from "degit";

/* ================================
   Minimal Color Helpers (No Chalk)
================================ */
const color = {
  cyan: (t) => `\x1b[36m${t}\x1b[0m`,
  green: (t) => `\x1b[32m${t}\x1b[0m`,
  red: (t) => `\x1b[31m${t}\x1b[0m`,
};

/* ================================
   Minimal Spinner (No Ora)
================================ */
class Spinner {
  constructor(text = "Loading...") {
    this.text = text;
    this.frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
    this.index = 0;
    this.interval = null;
  }

  start() {
    process.stdout.write("\n");
    this.interval = setInterval(() => {
      const frame = this.frames[this.index];
      process.stdout.write(`\r${frame} ${this.text}`);
      this.index = (this.index + 1) % this.frames.length;
    }, 80);
    return this;
  }

  succeed(message = "Done") {
    this.stop();
    process.stdout.write(`\r✔ ${message}\n`);
  }

  fail(message = "Failed") {
    this.stop();
    process.stdout.write(`\r✖ ${message}\n`);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}

const OWNER = "muralikrishnat";
const REPO = "pro-gen-templates";
const BRANCH = "main";

async function getVersions(type) {
  const url = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/templates-list.json`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch template list");
  }

  const data = await response.json();

  return (data[type] || []).map((item) => ({
    value: item.name,
    name: `${item.name} : ${item.description}`,
  }));
}

async function promptUser() {
  //check if --ui or --api is passed as argument
  const argType = process.argv.find((arg) => arg === "--ui" || arg === "--api");
  let projectType;

  if (argType) {
    projectType = argType.replace("--", "");
  } else {
    const { projectTypeInput } = await inquirer.prompt([
      {
        type: "select",
        name: "projectTypeInput",
        message: "Select project type",
        choices: ["ui", "api"],
      },
    ]);
    projectType = projectTypeInput;
  }
  const versions = await getVersions(projectType);
  //check if --version= is passed as argument
  const versionArg = process.argv.find((arg) => arg.startsWith("--version="));
  let selectedVersion;
  if (versionArg) {
    const versionValue = versionArg.split("=")[1];
    if (versions.some((v) => v.value === versionValue)) {
      selectedVersion = versionValue;
    } else {
      console.error(color.red(`Version "${versionValue}" not found for type "${projectType}"`));
      process.exit(1);
    }
  } else {
    const { versionInput } = await inquirer.prompt([
      {
        type: "select",
        name: "versionInput",
        message: "Select template version",
        choices: versions,
      },
    ]);
    selectedVersion = versionInput;
  }
  // check if --name= is passed as argument
  const nameArg = process.argv.find((arg) => arg.startsWith("--name="));
  let projectName;
  if (nameArg) {
    projectName = nameArg.split("=")[1];
  } else {
    const { projectNameInput } = await inquirer.prompt([
      {
        type: "input",
        name: "projectNameInput",
        message: "Project name",
        default: `${projectType}-${selectedVersion}`,
      },
    ]);
    projectName = projectNameInput;
  }

  return { projectType, version: selectedVersion, projectName: projectName.trim() || `${projectType}-${selectedVersion}` };
}

async function downloadTemplate(type, version, projectName) {
  const spinner = new Spinner("Downloading template...").start();

  try {
    const emitter = degit(
      `${OWNER}/${REPO}/${type}/${version}#${BRANCH}`
    );

    await emitter.clone(projectName);

    spinner.succeed("Project created successfully 🚀");

    console.log(color.green(`\ncd ${projectName}`));
    console.log(color.green(`npm install`));
  } catch (err) {
    spinner.fail("Download failed");
    console.error(color.red(err.message));
  }
}

async function run() {
  console.log(color.cyan("\nProGen CLI\n"));
  // Check for --help or -h
  if (process.argv.includes("--help") || process.argv.includes("-h") || process.argv.includes("help")) {
    console.log(color.green("\nUsage:"));
    console.log(color.green("  genpro [options]"));
    console.log(color.green("\nOptions:"));
    console.log(color.green("  -h, --help     Show help information"));
    console.log(color.green("  -v, --version  Show version number\n"));
    console.log(color.green("  --ui           Create a UI project"));
    console.log(color.green("  --api          Create an API project"));
    console.log(color.green("  --version=     Specify template version"));
    console.log(color.green("  --name=        Specify project name\n"));
    return;
  }
  try {
    const { projectType, version, projectName } = await promptUser();
    await downloadTemplate(projectType, version, projectName);
  } catch (err) {
    console.error(color.red(err.message));
  }
}

run();
