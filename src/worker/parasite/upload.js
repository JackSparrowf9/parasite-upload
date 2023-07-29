import puppeteer from "../../puppeteer.js";
import UserAgent from "user-agents";

import delay from "../../utils/delay.js";
import { identifySelectorKind } from "../../utils/selector.js";

const upload = async ({
  url,
  filePath,
  inputSelector,
  submitSelector,
  resultSelector,
  pdfLink,
}) => {
  const browser = await puppeteer();
  let pdfLinkStatus = "";
  try {
    const { data } = new UserAgent({ deviceCategory: "desktop" });
    const { userAgent } = data;

    const page = await browser.newPage();
    await page.setUserAgent(`${userAgent}`);

    // recheck link is live or not
    if (pdfLink) {
      await page.goto(pdfLink, {
        waitUntil: "load",
        timeout: 90000,
      });
      await delay(2000); // 2 second

      // reload pdf link because server maybe cache and show link 404
      const checkLink = await page.reload({
        waitUntil: "load",
        timeout: 90000,
      });
      pdfLinkStatus = checkLink.status();
    }
    console.log(`PDF Link: ${pdfLink} || status: ${pdfLinkStatus}`);

    // if link still live >> return and not upload new one
    if (pdfLinkStatus !== 404) {
      await browser.close();
      return {
        uploadLink: pdfLink,
        error: false,
        error_message: null,
      };
    }

    await page.goto(url, {
      waitUntil: "load",
      timeout: 90000, // 90 second
    });

    if (page.url() === url) {
      const inputCss = await identifySelectorKind(inputSelector);

      const inputSelectorExist = await page.waitForSelector(inputCss);
      if (!inputSelectorExist) {
        return {
          uploadLink: null,
          error: true,
          error_message: "form upload disable",
        };
      }
      const [fileChooser] = await Promise.all([
        page.waitForFileChooser(),
        page.click(inputCss),
      ]);

      await fileChooser.accept([filePath]);

      // click submit/upload button
      const submitCss = await identifySelectorKind(submitSelector);
      await page.click(submitCss);

      // await for result appear
      const resultCss = await identifySelectorKind(resultSelector);
      const result = await page.waitForSelector(resultCss);

      // Get upload link
      const uploadLink = await result.$eval("a", (el) => el.href);

      // console.log(uploadLink);

      await delay(5000);

      // await page.reload();
      await browser.close();

      return uploadLink;
    } else {
      console.log("error when upload, url not matching with form upload");
      return null;
    }
  } catch (error) {
    await browser.close();
    throw error;
  }
};

export default upload;
