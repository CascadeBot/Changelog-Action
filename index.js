const core = require('@actions/core');
const axios = require('axios');

const { getEmbedsFromBody } = require('./parser.js');

require('dotenv').config();

const { GITHUB_EVENT_NAME, GITHUB_EVENT_PATH } = process.env;

function sendWebhook(event, webhook, embeds) {
  if (embeds.length == 0)
    return true; // no embeds to send
  axios({
    method: 'post',
    url: webhook,
    data: {
      avatar_url: event.organization.avatar_url,
      username: event.organization.login,
      embeds,
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
  return;

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
    sendWebhook(event, previewWebhook, getEmbedsFromBody(event.issue.body));
  else if (event.comment.body.startsWith(';publish'))
    sendWebhook(event, publishWebhook, getEmbedsFromBody(event.issue.body));
  else {
    core.setFailed('Not a command');
  }
}

run().catch(error => {
  core.setFailed('Event failed: ' + error.message);
  console.error(error);
});
