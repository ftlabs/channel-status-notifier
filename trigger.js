const AWS = require("aws-sdk");

exports.trigger = async function(event, context) {
  try {
    const eventBody = JSON.parse(event.body).event;
    if (isReactionToOtherPost(eventBody)) {
      return {
        statusCode: 200,
        body: "ok"
      };
    }

    let snsOpts = {
      region: "eu-west-1"
    };

    if (process.env.IS_OFFLINE) {
      snsOpts.endpoint = "http://127.0.0.1:4002";
    }

    let sns = new AWS.SNS(snsOpts);

    let messageData;
    switch (eventBody.type) {
      case "app_mention":
        messageData = {
          Message: eventBody.channel,
          TopicArn: process.env.mySnsTopicArn
        };
        break;
      case "reaction_added":
        console.log("getting into reaction");
        console.log();
        messageData = {
          Message: JSON.stringify({
            item: eventBody.item,
            reaction: eventBody.reaction,
            user: eventBody.user
          }),
          TopicArn: process.env.emojiReactionSnsArn
        };
        break;
    }

    console.log("PUBLISHING MESSAGE TO SNS:", messageData);
    await sns.publish(messageData).promise();
    console.log("PUBLISHED MESSAGE TO SNS:", messageData);

    return {
      statusCode: 200,
      body: "ok"
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 200,
      body: "ok"
    };
  }
};

function isReactionToOtherPost({ type, item_user }) {
  return type === "reaction_added" && item_user !== process.env.APP_ID;
}
