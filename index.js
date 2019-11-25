const core = require('@actions/core');
const github = require('@actions/github');
const Axios = require('axios');

const { GITHUB_REPOSITORY, GITHUB_EVENT_NAME, GITHUB_EVENT_PATH } = process.env;

async function run() {
  const myToken = core.getInput('githubToken');

  console.log(GITHUB_REPOSITORY, GITHUB_EVENT_NAME);
  const event = require(GITHUB_EVENT_PATH);
  console.log(event);
  const octokit = new github.GitHub(myToken);
  try { 
    const data = await octokit.pulls.get({
      owner: "octokit",
      repo: "rest.js",
      pull_number: 1278,
    });
    console.log(data);
    core.setSuccess('no');
  } 
  catch (error) {
    core.setFailed(error.message);
  }
}

run();
