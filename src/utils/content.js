import fs from "fs";
import TitleModel from "../model/title.js";
import ContentModel from "../model/content.js";
import db from "../database/index.js";

import { wordCount } from "./countWords.js";
import { ensureDirExist } from "./ensureExist.js";

db.connect();

export const generateTitle = async ({ niche }) => {
  const titles = await TitleModel.find({ niche: niche });
  if (!titles) return null;

  const randTitle = titles[Math.floor(Math.random() * titles.length)];
  return randTitle.title;
};

export const generateParagraph = async ({ niche, count = 1500 }) => {
  const data = await ContentModel.find({ niche: niche });
  // console.log("content.js | data: ", data);

  if (!data) return null;

  const contentArr = data.map((p) => {
    return p.paragraph;
  });

  let contentCount = wordCount(contentArr.join(" "));
  if (contentCount < 3000) {
    return null;
  }

  let tmpIndex = [];
  let tmpContentArr = [];
  let c = true;

  while (c) {
    let tmpContent = tmpContentArr.join(" ");
    let tmpCount = wordCount(tmpContent);

    if (tmpCount >= count) {
      c = false;
      return tmpContentArr;
    } else {
      const randIndex = Math.floor(Math.random() * contentArr.length);
      if (tmpIndex.indexOf(randIndex) === -1) {
        tmpIndex.push(randIndex);
        tmpContentArr.push(contentArr[randIndex]);
      }
    }
  }
};

export const getImage = async ({ category }) => {
  let folder = `upload/images/${category}`;

  const isFolderExist = ensureDirExist(folder);

  if (!isFolderExist) return null;

  const imgDirs = fs.readdirSync(folder);

  // check folder empty
  if (imgDirs.length === 0) {
    return null;
  }

  const randImage = imgDirs[Math.floor(Math.random() * imgDirs.length)];

  return `${folder}/${randImage}`;
};
