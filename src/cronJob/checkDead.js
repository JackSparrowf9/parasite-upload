import { CronJob } from "cron";
import axios from "axios";
import UserAgent from "user-agents";
import { HttpsProxyAgent } from "https-proxy-agent";
import fetch from "node-fetch";

import LinkModel from "../model/link.js";
import db from "../database/index.js";
import getProxy from "../utils/proxy.js";
import { addJob } from "./job.js";

db.connect();

// "0 */30 * * * *",  every 30 minute
// "0 */59 * * * ",   every 2 hours
const job = new CronJob(
  "0 */59 * * * *", // 30 minute interval
  // "0 */2 * * *", // 2 hours interval
  async () => {
    const d = new Date();
    console.log("Check Dead Job Runing at:", d);

    const links = await LinkModel.find({}).exec();
    for (const link of links) {
      const { alive, proxyDead } = await checkDead(link.url);

      if (proxyDead) {
        await LinkModel.findByIdAndUpdate(link._id, {
          isLive: true,
          error: true,
          error_message: "proxy",
        });
      } else if (!alive) {
        // link is dead
        await LinkModel.findByIdAndUpdate(link._id, {
          isLive: false,
          error: false,
          error_message: null,
        });

        await addJob({
          name: "reup",
          id: link._id.toHexString(),
          milliseconds: 5000,
        });
      } else {
        // link is live but isLive field = false => update to true
        if (!link.isLive) {
          await LinkModel.findByIdAndUpdate(link._id, {
            isLive: true,
            error: false,
            error_message: null,
          });
        }
      }
    }
    console.log("Check Dead Done!");
  },
  null,
  true,
  "Asia/Ho_Chi_Minh"
);

const checkDead = async (url) => {
  try {
    // const proxy = await getProxy();
    // const proxyAgent = new HttpsProxyAgent(
    //   `http://${proxy.auth.username}:${proxy.auth.password}@${proxy.host}:${proxy.port}`
    // );

    const { data } = new UserAgent({ deviceCategory: "desktop" });
    const { userAgent } = data;
    const response = await fetch(url, {
      method: "GET",
      // agent: proxyAgent,
      headers: {
        "Cache-Control": "no-cache",
        "User-Agent": userAgent,
      },
    });
    const { status } = response;
    if (status !== 200) {
      console.log(`${url} | status: ${status} - dead`);
      return { alive: false, proxyDead: false };
    } else {
      console.log(`${url} | status: ${status} - live`);
      return { alive: true, proxyDead: false };
    }
  } catch (error) {
    console.log(error);
    console.log(`${url} | Proxy Dead`);
    return { alive: true, proxyDead: true };

    // if (error.response) {
    //   // The request was made and the server responded with a status code
    //   // that falls out of the range of 2xx
    //   const { status } = error.response;
    //   // console.log(`${url} | status: ${status} - dead`);
    //   // return { alive: false, proxyDead: false };
    //   if (status === 404) {
    //     console.log(`${url} | status: ${status} - dead`);
    //     return { alive: false, proxyDead: false };
    //   } else {
    //     console.log(`${url} | status: ${status} - live`);
    //     return { alive: true, proxyDead: false };
    //   }
    // } else if (error.request) {
    //   // The request was made but no response was received
    //   // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    //   // http.ClientRequest in node.js
    //   // console.log(error.request);
    //   console.log(`${url} | Proxy Dead`);
    //   return { alive: true, proxyDead: true };
    // } else {
    //   // Something happened in setting up the request that triggered an Error
    //   // console.log("Error", error.message);
    //   console.log(`${url} | Proxy Dead`);
    //   return { alive: true, proxyDead: true };
    // }
  }
};
// const checkDead = async (url) => {
//   try {
//     const proxy = await getProxy();
//     const userAgent = new UserAgent({ deviceCategory: "desktop" });
//     // console.log(
//     //   `proxy: http://${proxy.host}:${proxy.port}@${proxy.auth.username}:${proxy.auth.password}`
//     // );

//     const response = await axios.get(url, {
//       proxy: proxy,
//       headers: {
//         "Cache-Control": "no-cache",
//         "User-Agent": userAgent,
//       },
//     });
//     const { status } = response;
//     if (status !== 200) {
//       console.log(`${url} | status: ${status} - dead`);
//       return { alive: false, proxyDead: false };
//     } else {
//       console.log(`${url} | status: ${status} - live`);
//       return { alive: true, proxyDead: false };
//     }
//   } catch (error) {
//     if (error.response) {
//       // The request was made and the server responded with a status code
//       // that falls out of the range of 2xx
//       const { status } = error.response;
//       // console.log(`${url} | status: ${status} - dead`);
//       // return { alive: false, proxyDead: false };
//       if (status === 404) {
//         console.log(`${url} | status: ${status} - dead`);
//         return { alive: false, proxyDead: false };
//       } else {
//         console.log(`${url} | status: ${status} - live`);
//         return { alive: true, proxyDead: false };
//       }
//     } else if (error.request) {
//       // The request was made but no response was received
//       // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
//       // http.ClientRequest in node.js
//       // console.log(error.request);
//       console.log(`${url} | Proxy Dead`);
//       return { alive: true, proxyDead: true };
//     } else {
//       // Something happened in setting up the request that triggered an Error
//       // console.log("Error", error.message);
//       console.log(`${url} | Proxy Dead`);
//       return { alive: true, proxyDead: true };
//     }
//   }
// };

job.start();
console.log(job.running);
