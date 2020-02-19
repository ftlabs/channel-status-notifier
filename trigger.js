const axios = require("axios");

exports.trigger = async function(event, context) {
  axios({
    method: "post",
    url: "http://localhost:3000/handler",
    data: event.body
  });

  return {
    statusCode: 200,
    body: "success"
  };
};
