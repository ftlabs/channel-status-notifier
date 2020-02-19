exports.handler = async function(event, context) {
  console.log("EVENT: \n" + JSON.stringify(event, null, 2));
  const result = await getMembers({
    channel: JSON.parse(event.body).event.channel
  });

  return {
    statusCode: 200,
    body: JSON.stringify(result)
  };
};
