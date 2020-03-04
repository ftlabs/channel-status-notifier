exports.emojiReact = async function(event, context) {
  try {
    console.log(event);
    console.log(JSON.stringify(event));
    console.log(event.Records[0].Sns.Message);
    console.log(JSON.parse(event.Records[0].Sns.Message));
    return {
      statusCode: 200,
      body: "success"
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 401,
      body: "fail"
    };
  }
};
