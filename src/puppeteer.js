// import puppeteer from "puppeteer";
import puppeteer from "puppeteer-core";

export default async () => {
  // chrome
  return await puppeteer.launch({
    headless: false,
    executablePath: "/usr/bin/chromium-browser",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--media-cache-size=0",
      "--disk-cache-size=0",
    ],
  });

  // firefox
  // return await puppeteer.launch({
  //   product: "firefox",
  //   headless: false,
  //   executablePath: "/usr/bin/firefox",
  //   args: [
  //     // "--no-sandbox",
  //     "--disable-setuid-sandbox",
  //     "--disable-dev-shm-usage",
  //     "--media-cache-size=0",
  //     "--disk-cache-size=0",
  //   ],
  // });
};
