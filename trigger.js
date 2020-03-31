const AWS = require("aws-sdk");

exports.trigger = async function(event, context) {
  try {
    const eventBody = JSON.parse(event.body).event;
    console.log("eventBody", eventBody);
    if (isReactionToOtherPost(eventBody)) {
      console.log("not valid emoji react");
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
    console.log("eventBody.type", eventBody.type);
    switch (eventBody.type) {
      case "app_mention":
        const eventMessage = eventBody.text
          .split(">")[1]
          .trim()
          .toLowerCase();
        let channel;
        let test;
        if (eventMessage[0] === "g" || eventMessage[0] === "c") {
          channel = eventMessage.toUpperCase();
          test = eventBody.channel;
        } else {
          channel = eventBody.channel;
          test = "";
        }
        messageData = {
          Message: JSON.stringify({
            channel,
            test
          }),
          TopicArn: process.env.mySnsTopicArn
        };
        break;
      case "reaction_added":
        console.log("eventBody.item", eventBody.item);
        console.log("eventBody", eventBody);

        messageData = {
          Message: JSON.stringify({
            item: eventBody.item,
            reaction: eventBody.reaction,
            user: eventBody.user,
            type: eventBody.type
          }),
          TopicArn: process.env.emojiReactionSnsArn
        };
        break;
      case "reaction_removed":
        console.log("eventBody", eventBody);

        messageData = {
          item: eventBody.item,
          reaction: eventBody.reaction,
          user: eventBody.user,
          type: eventBody.type
        };
        return;
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
  return (
    (type === "reaction_added" || type === "reaction_removed") &&
    item_user !== process.env.APP_ID
  );
}
