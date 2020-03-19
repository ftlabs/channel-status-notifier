const { WebClient, ErrorCode } = require("@slack/web-api");
const web = new WebClient(process.env.SLACK_TOKEN);

const { AWAY_TYPES } = require("./data/types.js");

exports.emojiReact = async function(event, context) {
  try {
    const { item, reaction, user } = JSON.parse(event.Records[0].Sns.Message);
    const { type, message } = getReactionType(reaction);
    if (!type) {
      console.log("Wrong away type");
      return;
    }
    const messageDetails = await getItemMessage(item);
    if (!messageDetails) {
      throw new Error("No message being retrieved");
    }
    console.log("message", messageDetails);
    const userDetails = await web.users.info({
      user
    });
    const name = userDetails.user.profile.real_name;

    const formattedMessage = formatMessage({
      text: messageDetails.text,
      name,
      type,
      message
    });
    const updatedMessage = await updateMessage({
      item,
      message: formattedMessage
    });
    console.log(updatedMessage);
    return;
  } catch (err) {
    console.log(err);
    return;
  }
};

async function updateMessage({ item, message }) {
  const { ts, channel } = item;
  console.log("update.ts", ts);
  const result = await web.chat.update({ channel, ts, text: message });
  return result;
}

function getReactionType(reaction) {
  const typeObj = AWAY_TYPES.find(typeObj =>
    typeObj.emoji.includes(`:${reaction}:`)
  );
  if (typeObj) {
    return typeObj;
  } else {
    return {};
  }
}

async function getItemMessage({ channel, ts }) {
  console.log("ts", ts);
  const messageResult = await web.conversations.history({
    channel,
    latest: ts,
    limit: 1,
    inclusive: true
  });
  if (messageResult.messages) {
    return messageResult.messages[0];
  }
}

function formatMessage({ text, name, message, type }) {
  let removedNameText = removeName({ text, name });
  let addNameText = addName({ text: removedNameText, name, message, type });
  return addNameText;
}

function addName({ text, name, message, type }) {
  let finalMessage;
  if (!text.includes(message)) {
    finalMessage = text += `${message} \n ${name} \n\n`;
  } else {
  }
  return finalMessage;
}

function removeName({ text, name }) {
  return text.replace(name + ",", "").replace(name, "");
}
