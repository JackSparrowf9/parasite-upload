const date = new Date();

const year = date.getFullYear();
const month = Intl.DateTimeFormat("en-US", { month: "long" }).format(date);
const day = date.getDate();

const today = `${month} ${day}, ${year}`;

function randIntNumber(min = 0, max = 9) {
  const a = Math.floor(Math.random() * max + min);
  const b = Math.floor(Math.random() * max + min);

  return `${a}.${b}`;
}

const updated = () => {
  const updatedText = [
    "𝕌𝕡𝕕𝕒𝕥𝕖𝕕",
    "Ｕｐｄａｔｅｄ",
    "ᴜᴘᴅᴀᴛᴇᴅ",
    "🅄🄿🄳🄰🅃🄴🄳",
    "ᵤₚdₐₜₑd",
    "𝐔𝐩𝐝𝐚𝐭𝐞𝐝",
    "𝗨𝗽𝗱𝗮𝘁𝗲𝗱",
    "𝙐𝙥𝙙𝙖𝙩𝙚𝙙",
    "(っ◔◡◔)っ ♥ Updated ♥",
    "░U░p░d░a░t░e░d░",
    "˜”*°•.˜”*°• Updated •°*”˜.•°*”˜",
    "U҉p҉d҉a҉t҉e҉d҉",
    "ᑌᑭᗪᗩTEᗪ",
    "U̶p̶d̶a̶t̶e̶d̶",
  ];
  const randUpdatedText =
    updatedText[Math.floor(Math.random() * updatedText.length)];

  const updated = `${randUpdatedText}: [${today}]`;
  return updated;
};
const version = () => {
  const versionText = [
    "ᴠᴇʀsɪᴏɴ",
    "vͮeͤrͬs͛iͥoͦn",
    "ᵛᵉʳˢⁱᵒⁿ",
    "𝕧𝕖𝕣𝕤𝕚𝕠𝕟",
    "v̡̙͕e͍̙͕r̠͍͍s̡̪͖i͙̙̪o͖̺̞n̼̦̺",
    "v̲e̲r̲s̲i̲o̲n̲",
    "v̅e̅r̅s̅i̅o̅n̅",
    "𝕍𝕖𝕣𝕤𝕚𝕠𝕟",
    "Vҽɾʂισɳ",
    "𝐕𝐞𝐫𝐬𝐢𝐨𝐧",
    "𝗩𝗲𝗿𝘀𝗶𝗼𝗻",
    "V̶e̶r̶s̶i̶o̶n̶",
  ];

  const randVersionidx = Math.floor(Math.random() * versionText.length);
  const randVersionText = versionText[randVersionidx];

  const version = `(${randVersionText}: ${randIntNumber()})`;

  return version;
};

const randSecond = () => {
  const fontText = [
    "𝖘𝖊𝖈𝖔𝖓𝖉 𝖆𝖌𝖔",
    "𝕤𝕖𝕔𝕠𝕟𝕕 𝕒𝕘𝕠",
    "ｓｅｃｏｎｄ ａｇｏ",
    "ꜱᴇᴄᴏɴᴅ ᴀɢᴏ",
    "ˢᵉᶜᵒⁿᵈ ᵃᵍᵒ",
    "𝘀𝗲𝗰𝗼𝗻𝗱 𝗮𝗴𝗼",
    "𝘴𝘦𝘤𝘰𝘯𝘥 𝘢𝘨𝘰",
    "𝙨𝙚𝙘𝙤𝙣𝙙 𝙖𝙜𝙤",
    "【﻿ｓｅｃｏｎｄ　ａｇｏ】",
  ];
  const randTextIdx = Math.floor(Math.random() * fontText.length);
  const randText = fontText[randTextIdx];
  const randSecond = Math.floor(Math.random() * (60 - 15)) + 15;
  return `${randSecond} ${randText}`;
};

function userOnline() {
  const randNumber = Math.floor(Math.random() * 10000) + 500;
  return `User Online: [${randNumber}] `;
}

function fakeViews() {
  const randViews = randIntNumber(5, 100);
  return `${randViews}K Views`;
}
export { updated, version, randSecond, userOnline, fakeViews };
