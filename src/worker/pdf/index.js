import { mdToPdf } from "md-to-pdf";

import {
  generateTitle,
  generateParagraph,
  getImage,
} from "../../utils/content.js";
import { ensureDirExist, ensureFileExist } from "../../utils/ensureExist.js";
import {
  userOnline,
  version,
  fakeViews,
  updated,
  randSecond,
} from "../../utils/fakeData.js";

const getFakeData = async (category) => {
  let user, update, rSecond, ver, fViews;
  switch (category) {
    case "ghack":
      user = userOnline();
      update = updated();
      rSecond = randSecond();
      ver = version();
      return { user, update, rSecond, ver, fViews: "" };
    case "movie":
    case "sport":
      update = updated();
      rSecond = randSecond();
      fViews = fakeViews();
      return { update, rSecond, fViews, user: "", ver: "" };
    default:
      user = userOnline();
      update = updated();
      rSecond = randSecond();
      ver = version();
      fViews = fakeViews();
      return { user, update, rSecond, ver, fViews };
  }
};
const generatePdf = async ({
  category,
  niche,
  folder,
  title,
  fileName,
  landingPageUrl,
}) => {
  try {
    console.log(category, niche, folder, title, fileName, landingPageUrl);

    let genTitle,
      content = "",
      pdfFileName;

    pdfFileName = fileName.replace(/.pdf/, "");

    const isDirExist = ensureDirExist(folder);
    if (!isDirExist) return { ok: false };

    if (!title) {
      genTitle = await generateTitle({ niche });
    } else {
      genTitle = title;
    }

    const paragraph = await generateParagraph({ niche });
    // console.log(paragraph);

    const image = await getImage({ category });
    const { user, update, rSecond, ver, fViews } = await getFakeData(category);

    // add title
    content += ` <center><h1>${genTitle}</h1></center> \n\n`;

    // add fake data: use, fake views...
    content += `<div style="display:flex; justify-content:space-between;">${
      update ? `<span>${update}</span>` : ""
    }  ${user ? `<span>${user}</span>` : ""} ${
      ver ? `<span>${ver}</span>` : ""
    } ${fViews ? `<span>${fViews}</span>` : ""}</div> \n\n`;

    // add clickable image with link to landing page
    content += `[![image](${image})](${landingPageUrl}) \n\n`;

    //  add random second: >>> 32 second ago
    content += `${rSecond}  `;

    //  add paragraph to content
    for (const p of paragraph) {
      content += `${p} \n\n`;
    }

    const pdf = await mdToPdf(
      { content: content },
      { dest: `${folder}/${pdfFileName}.pdf` }
    ).catch((err) => {
      console.log(err);
      return { ok: false };
    });

    if (!pdf) {
      return { ok: false };
    }
    return { ok: true, genTitle };
  } catch (error) {
    console.log(error);
    return { ok: false };
  }
};

const getLandingPage = async ({ landing_page, shorten_link }) => {
  if (shorten_link.length !== 0) {
    const randLink =
      shorten_link[Math.floor(Math.random() * shorten_link.length)];

    return randLink;
  } else {
    return landing_page;
  }
};

const checkAndGeneratePdf = async ({
  category,
  niche,
  title,
  file_path,
  fileName,
}) => {
  let folder = `upload/pdf/${category.name}`;
  const landingPageUrl = await getLandingPage({
    landing_page: niche.landing_page,
    shorten_link: niche.shorten_link,
  });

  // "file_path":"upload/pdf/ghack/mfxjgI.pdf" exist in database
  if (file_path) {
    // check is file already exist
    const isFileExist = await ensureFileExist(file_path);
    if (!isFileExist) {
      const pdf = await generatePdf({
        category: category.name,
        niche: niche.nicheId,
        folder, // upload/pdf/ghack
        title,
        fileName, // cashapp.pdf
        landingPageUrl,
      });
      if (!pdf.ok)
        return {
          ok: null,
          file_path_update: null,
          genTitle: null,
          newFile: null,
        };
      return {
        ok: true,
        file_path_update: null,
        genTitle: pdf.genTitle,
        newFile: true,
      };
    } else {
      return {
        ok: true,
        file_path_update: null,
        genTitle: null,
        newFile: null,
      };
    }
  } else {
    const isFileExist = await ensureFileExist(`${folder}/${fileName}`);

    if (!isFileExist) {
      const pdf = await generatePdf({
        category: category.name,
        niche: niche.nicheId,
        folder, // upload/pdf/ghack
        title,
        fileName,
        landingPageUrl,
      });
      if (!pdf.ok)
        return {
          ok: null,
          file_path_update: `${folder}/${fileName}`,
          genTitle: null,
          newFile: null,
        };

      return {
        ok: true,
        file_path_update: `${folder}/${fileName}`,
        genTitle: pdf.genTitle,
        newFile: true,
      };
    } else {
      return {
        ok: true,
        file_path_update: `${folder}/${fileName}`,
        genTitle: null,
        newFile: false,
      };
    }
  }
};

export default checkAndGeneratePdf;
