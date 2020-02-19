"use strict";

if (process.env.NODE_ENV !== "production") require("dotenv").config();
const { WebClient, ErrorCode } = require("@slack/web-api");

const web = new WebClient(process.env.SLACK_TOKEN);

async function postUpdate({ text, channel }) {
  try {
    const result = await web.chat.postMessage({
      text,
      channel
    });

    console.log(
      `Successfully send message ${result.ts} in conversation ${channel}`
    );
  } catch (error) {
    if (error.code === ErrorCode.PlatformError) {
      console.log(error.data);
    } else {
      console.log("Unexpected error in postUpdate()");
    }
  }
}

async function getMembers({ channel }) {
  try {
    const result = await web.groups.info({
      channel
    });

    const memberSelection = await getStatuses(result.group.members);
    const awayMessage = prepMessage(memberSelection);

    if (awayMessage !== "") {
      const posting = await postUpdate({
        text: `In the this channel today: \n\n ${awayMessage}`,
        channel
      });
    }
  } catch (error) {
    if (error.code === ErrorCode.PlatformError) {
      console.log(error.data);
    } else {
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
    parent: []
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

  return message;
}

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
