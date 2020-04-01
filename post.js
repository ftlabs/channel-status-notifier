if (process.env.NODE_ENV !== "production") require("dotenv").config();
const { WebClient, ErrorCode } = require("@slack/web-api");

const web = new WebClient(process.env.SLACK_TOKEN);

async function postUpdate({ text, channel, test }) {
  try {
    const postingChannel = test ? test : channel;
    console.log("postingChannel", postingChannel);
    const result = await web.chat.postMessage({
      text,
      channel: postingChannel
    });
    console.log(
      `Successfully send message ${result.ts} in conversation ${postingChannel}`
    );
    return result.ts;
  } catch (error) {
    if (error.code === ErrorCode.PlatformError) {
      console.log(error.data);
    } else {
      console.log("Unexpected error in postUpdate()");
    }

    console.log("hello");
  }
}

async function getMembers({ channel, test }) {
  try {
    const channelType = { G: "group", C: "channel" };
    const result = await web[channelType[`${channel[0]}`] + "s"].info({
      channel
    });
    const members = result[channelType[`${channel[0]}`]].members;

    const memberSelection = await getStatuses(members);
    const awayMessage = prepMessage(memberSelection);
    let posting;
    if (awayMessage !== "") {
      posting = await postUpdate({
        text: `In the this channel today: \n\n ${awayMessage}`,
        channel,
        test
      });
    } else {
      posting = await postUpdate({
        text: `No one in this channel has a status set`,
        channel,
        test
      });
    }
    return posting;
  } catch (error) {
    console.log("getting into error");
    if (error.code === ErrorCode.PlatformError) {
      console.log(error.data);
    } else {
      console.log(error);
      console.log("Unexpected error in getMembers()");
    }
  }
}

async function getStatuses(members) {
  const results = [];
  for (let i = 0; i < members.length; ++i) {
    try {
      const memberProfile = await web.users.info({
        user: members[i]
      });

      console.log(memberProfile);

      const memberStatus = checkStatus(memberProfile.user.profile);
      if (memberStatus) {
        results.push(memberStatus);
      }
    } catch (error) {
      if (error.code === ErrorCode.PlatformError) {
        console.log(error.data);
      } else {
        console.log("Unexpected error in getStatuses()");
      }
    }
  }

  return results;
}

const { AWAY_TYPES } = require("./data/types.js");

function checkStatus(profile) {
  let status = "";

  const statusText = profile.status_text.toLowerCase();
  const statusEmoji = profile.status_emoji;

  for (let i = 0; i < AWAY_TYPES.length; ++i) {
    const type = AWAY_TYPES[i];

    const matchingWords = type.keywords.filter(word => {
      return statusText.split(" ").includes(word);
    });

    if (matchingWords.length > 0) {
      console.log(`MATCHING KEYWORD ${type.type} :: ${profile.real_name}`);
      status = type.type;
      break;
    }

    const matchingEmoji = type.emoji.filter(emoji => {
      return statusEmoji.includes(emoji);
    });

    if (matchingEmoji.length > 0) {
      console.log(`MATCHING EMOJI ${type.type} :: ${profile.real_name}`);
      status = type.type;
      break;
    }
  }

  if (status !== "") {
    return {
      user: profile.real_name,
      awayStatus: status
    };
  }

  return null;
}

function prepMessage(statuses) {
  const userStatus = {
    holiday: [],
    ill: [],
    wfh: [],
    ooo: [],
    cake: [],
    parent: [],
    caring: [],
    unavailable: [],
    walking: [],
    lunch: []
  };

  statuses.forEach(status => {
    userStatus[status.awayStatus].push(status.user);
  });

  let message = "";

  if (userStatus.holiday.length > 0) {
    message += `:palm_tree: *On holiday:* \n ${userStatus.holiday.join(
      ", "
    )} \n\n`;
  }

  if (userStatus.wfh.length > 0) {
    message += `:house_with_garden: *WFH:* \n ${userStatus.wfh.join(", ")}\n\n`;
  }

  if (userStatus.ooo.length > 0) {
    message += `:no_entry_sign: *Out of office:* \n ${userStatus.ooo.join(
      ", "
    )}\n\n`;
  }

  if (userStatus.parent.length > 0) {
    message += `:baby: *On parental leave:* \n ${userStatus.parent.join(
      ", "
    )}\n\n`;
  }

  if (userStatus.ill.length > 0) {
    message += `:ill: *Off sick:* \n ${userStatus.ill.join(", ")}\n\n`;
  }

  if (userStatus.cake.length > 0) {
    message += `:cake: *Would like some cake:* \n ${userStatus.cake.join(
      ", "
    )}\n\n`;
  }

  if (userStatus.caring.length > 0) {
    message += `${
      AWAY_TYPES.find(obj => obj.type === "caring").message
    } \n ${userStatus.caring.join(", ")}\n\n`;
  }

  if (userStatus.unavailable.length > 0) {
    message += `${
      AWAY_TYPES.find(obj => obj.type === "unavailable").message
    } \n ${userStatus.unavailable.join(", ")}\n\n`;
  }

  if (userStatus.walking.length > 0) {
    console.log("getting in walking");
    message += `${
      AWAY_TYPES.find(obj => obj.type === "walking").message
    } \n ${userStatus.walking.join(", ")}\n\n`;
  }

  if (userStatus.lunch.length > 0) {
    message += `${
      AWAY_TYPES.find(obj => obj.type === "lunch").message
    } \n ${userStatus.lunch.join(", ")}\n\n`;
  }
  console.log("message", message);
  return message;
}

async function addReactions({ channel, timestamp }) {
  for (let i = 0; i < AWAY_TYPES.length; ++i) {
    try {
      const result = await web.reactions.add({
        channel,
        timestamp,
        name: AWAY_TYPES[i].defaultEmoji
      });

      console.log(result);
    } catch (error) {
      if (error.code === ErrorCode.PlatformError) {
        console.log(error.data);
      } else {
        console.log("Unexpected error in addReactions()");
      }
    }
  }
}

exports.post = async function(event, context) {
  try {
    console.log("message", event.Records[0].Sns.Message);
    const { channel, test } = JSON.parse(event.Records[0].Sns.Message);
    const timestamp = await getMembers({
      channel,
      test
    });
    await addReactions({ channel, timestamp });
    return {
      statusCode: 200,
      body: "success"
    };
  } catch (err) {
    console.log("error");
    console.log(err);
    return {
      statusCode: 401,
      body: "fail"
    };
  }
};
