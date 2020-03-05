const { WebClient, ErrorCode } = require("@slack/web-api");
const web = new WebClient(process.env.SLACK_TOKEN);

const { AWAY_TYPES } = require("./data/types.js");

exports.emojiReact = async function(event, context) {
  try {
    const { item, reaction } = JSON.parse(event.Records[0].Sns.Message);
    const awayType = getReactionType(reaction);
    if (!awayType) {
      console.log("Wrong away type");
      return;
    }
    const message = await getItemMessage(item);
    if (!message) {
      throw new Error("No message being retrieved");
    }
    console.log(message);
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
