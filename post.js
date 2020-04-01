if (process.env.NODE_ENV !== "production") require("dotenv").config();
const { WebClient, ErrorCode } = require("@slack/web-api");

const web = new WebClient(process.env.SLACK_TOKEN);

async function postUpdate({ text, channel, test }) {
  try {
    const postingChannel = test ? test : channel;
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

  Object.keys(userStatus).forEach(key => {
    message += addStatus({
      statuses: userStatus[key],
      statusType: key
    });
  });

  return message;
}

function addStatus({ statuses, statusType }) {
  console.log(
    "AWAY_TYPES.find(typeObj => typeObj.type === statusType).message;",
    AWAY_TYPES.find(typeObj => typeObj.type === statusType).message
  );
  console.log("statuses", statuses);
  console.log("statusType", statusType);
  message = "";
  message += AWAY_TYPES.find(typeObj => typeObj.type === statusType).message;
  if (statuses.length > 0) {
    message += `${statuses.join(", ")}`;
  }
  message += `\n\n`;

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
