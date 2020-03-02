const AWS = require("aws-sdk");

exports.trigger = async function(event, context) {
  try {
    let snsOpts = {
      region: "eu-west-1"
    };

    if (process.env.IS_OFFLINE) {
      snsOpts.endpoint = "http://127.0.0.1:4002";
    }

    let sns = new AWS.SNS(snsOpts);
    let messageData = {
      Message: JSON.parse(event.body).event.channel,
      TopicArn: process.env.mySnsTopicArn
    };

    console.log("PUBLISHING MESSAGE TO SNS:", messageData);
    await sns.publish(messageData).promise();
    console.log("PUBLISHED MESSAGE TO SNS:", messageData);

    return {
      statusCode: 200,
      body: "ok"
    };
  } catch (err) {
    console.log("error", err);
    console.error(err);
    return {
      statusCode: 200,
      body: "ok"
    };
  }
};
