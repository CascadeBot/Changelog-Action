const core = require('@actions/core');
const github = require('@actions/github');
const Axios = require('axios');

async function run() {
  const prUrl = core.getInput('urlInput');
  const repoOwner = core.getInput('repoOwner');
  const repoName = core.getInput('repoName');
  const myToken = core.getInput('githubToken');

  const octokit = new github.GitHub(myToken);
  console.log(prUrl, repoOwner, repoName);
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
