const { WebClient, ErrorCode } = require("@slack/web-api");
const web = new WebClient(process.env.SLACK_TOKEN);

const { AWAY_TYPES } = require("./data/types.js");
const { MESSAGE } = require("./data/message.js");

exports.emojiReact = async function(event, context) {
  try {
    const { item, reaction, user, eventType } = JSON.parse(
      event.Records[0].Sns.Message
    );
    const { type, message, defaultEmoji } = getReactionType(reaction);

    if (!type) {
      return;
    }
    const messageDetails = await getItemMessage(item);
    if (!messageDetails) {
      throw new Error("No message being retrieved");
    }

    const userDetails = await web.users.info({
      user
    });
    const name = userDetails.user.profile.real_name;

    let formattedMessage;
    if (eventType === "reaction_removed") {
      const splitViaStatus = messageDetails.text.split(message);
      const firstPart = splitViaStatus;
      let lastPart = splitViaStatus[1].split("\n");
      const originalNames = lastPart[1];
      if (!originalNames.includes(name)) {
        return;
      }
      formattedMessage = removeName({ name, text: messageDetails.text });
    } else {
      formattedMessage = formatMessage({
        text: messageDetails.text,
        name,
        type,
        message
      });
    }

    const updatedMessage = await updateMessage({
      item,
      message: formattedMessage
    });
    return;
  } catch (err) {
    console.log(err);
    return;
  }
};

async function updateMessage({ item, message }) {
  const { ts, channel } = item;
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
    console.log("on herererere");
    const textSplit = text.split(MESSAGE.ending);
    console.log("textSplit", textSplit);
    finalMessage = textSplit[0] += `\n ${message} \n ${name} \n ${MESSAGE.ending}`;
  } else {
    finalMessage = addNameToMessage({ text, name, message });
  }
  return finalMessage;
}

function addNameToMessage({ text, name, message }) {
  const splitViaStatus = text.split(message);
  const firstPart = splitViaStatus[0];
  let lastPart = splitViaStatus[1].split("\n");
  const originalNames = lastPart[1];
  let newNames;
  if (originalNames.trim()) {
    newNames = name + ", " + originalNames;
  } else {
    newNames = name;
  }
  lastPart[1] = newNames;
  const newLastPart = lastPart.join("\n");
  const finalMessage = firstPart + message + newLastPart;

  return finalMessage;
}

function removeName({ text, name }) {
  return text.replace(name + ",", "").replace(name, "");
}
