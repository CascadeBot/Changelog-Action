const core = require('@actions/core');
const axios = require('axios');

const { GITHUB_EVENT_NAME, GITHUB_EVENT_PATH } = process.env;

async function run() {
  const webhook = core.getInput('discordWebhook');
  const authorisedUsers = core.getInput('authorisedUsers').split(',');

  if (GITHUB_EVENT_NAME != 'issue_comment')
    return core.setFailed('Not a comment');
  const event = require(GITHUB_EVENT_PATH);
  if (typeof event.pull_request !== 'undefined')
    return core.setFailed('Not a PR');
  if (!authorisedUsers.includes(event.user.login))
    return core.setFailed('Unauthorised!');
  
  axios({
    method: 'post',
    url: webhook,
    data: {
      embeds: [{
        title: event.issue.title,
        description: event.issue.body
      }]
    }
  }).catch(error => {
    core.setFailed(error);
  });
}

run();
