const core = require('@actions/core');
const axios = require('axios');

require('dotenv').config();

const { GITHUB_EVENT_NAME, GITHUB_EVENT_PATH } = process.env;

function sendWebhook(event, webhook, color) {
  axios({
    method: 'post',
    url: webhook,
    data: {
      avatar_url: event.organization.avatar_url,
      username: event.organization.login,
      embeds: [{
        title: event.issue.title,
        description: event.issue.body,
        color
      }]
    }
  }).catch(error => {
    core.setFailed(error.message);
  }).then(res => {
    core.info('Command successfully ran!');
  });
}

async function run() {
  const publishWebhook = core.getInput('discordPublishWebhook');
  const previewWebhook = core.getInput('discordPreviewWebhook');
  const authorisedUsers = core.getInput('authorisedUsers').split(',');
  
  if (GITHUB_EVENT_NAME != 'issue_comment')
  return core.setFailed('Not a comment');

  let event;
  try {
    event = require(GITHUB_EVENT_PATH);
  } catch (error) {
    return core.setFailed('Invalid event file: \'' + GITHUB_EVENT_PATH + '\'');
  }

  if (typeof event.pull_request !== 'undefined')
    return core.setFailed('Not a PR');

  if (!authorisedUsers.includes(event.comment.user.login))
    return core.setFailed('Unauthorised!');
  
  if (event.comment.body.startsWith(';preview'))
    sendWebhook(event, previewWebhook, 15158332);
  else if (event.comment.body.startsWith(';publish'))
    sendWebhook(event, publishWebhook, 3447003);
  else {
    core.setFailed('Not a command');
  }
}

run().catch(error => {
  core.setFailed('Event failed: ' + error.message);
});
