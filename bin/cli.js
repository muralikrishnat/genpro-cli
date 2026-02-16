#!/usr/bin/env node

import inquirer from "inquirer";
import ora from "ora";
import chalk from "chalk";
import degit from "degit";
import axios from "axios";

const OWNER = "muralikrishnat";
const REPO = "pro-gen-templates";
const BRANCH = "main";

async function getVersions(type) {
  const url = `https://raw.githubusercontent.com/muralikrishnat/pro-gen-templates/main/templates-list.json`;

  const { data } = await axios.get(url);
  return (data[type] || []).map((item) => ({ value: item.name, name: item.name + ' : ' + item.description }));
}

async function promptUser() {
  const { projectType } = await inquirer.prompt([
    {
      type: "select",
      name: "projectType",
      message: "Select project type",
      choices: ["ui", "api"],
    },
  ]);

  const versions = await getVersions(projectType);

  const { version } = await inquirer.prompt([
    {
      type: "select",
      name: "version",
      message: "Select template version",
      choices: versions,
    }
  ]);

  const { projectName } = await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "Project name",
      default: `${projectType}-${version}`,
    },
  ]);

  return { projectType, version, projectName };
}

async function downloadTemplate(type, version, projectName) {
  const spinner = ora("Downloading template...").start();

  try {
    const emitter = degit(
      `${OWNER}/${REPO}/${type}/${version}#${BRANCH}`
    );

    await emitter.clone(projectName);

    spinner.succeed("Project created successfully 🚀");

    console.log(chalk.green(`\ncd ${projectName}`));
    console.log(chalk.green(`npm install`));
  } catch (err) {
    spinner.fail("Download failed");
    console.error(err.message);
  }
}

async function run() {
  console.log(chalk.cyan("\nProGen CLI\n"));

  const { projectType, version, projectName } = await promptUser();

  await downloadTemplate(projectType, version, projectName);
}

run();
