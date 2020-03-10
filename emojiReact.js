const { WebClient, ErrorCode } = require("@slack/web-api");
const web = new WebClient(process.env.SLACK_TOKEN);

const { AWAY_TYPES } = require("./data/types.js");

exports.emojiReact = async function(event, context) {
  try {
    const { item, reaction, user } = JSON.parse(event.Records[0].Sns.Message);
    const awayType = getReactionType(reaction);
    if (!awayType) {
      console.log("Wrong away type");
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

    const formattedMessage = formatMessage({ text: messageDetails.text, name });
    console.log(formattedMessage);
    return;
  } catch (err) {
    console.log(err);
    return;
  }
};

function getReactionType(reaction) {
  const typeObj = AWAY_TYPES.find(typeObj =>
    typeObj.emoji.includes(`:${reaction}:`)
  );
  if (typeObj) {
    return typeObj.type;
  }
}

async function getItemMessage({ channel, ts }) {
  const messageResult = await web.conversations.history({
    channel,
    ts,
    limit: 1,
    inclusive: true
  });
  if (messageResult.messages) {
    return messageResult.messages[0];
  }
}

function formatMessage({ text, name }) {
  let finalText = removeName({ text, name }).addName({});
  return finalText;
}

function removeName({ text, name }) {
  console.log(name);
  return text.replace(name + ",", "").replace(name, "");
}
