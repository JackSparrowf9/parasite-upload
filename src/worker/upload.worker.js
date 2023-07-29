import { Worker } from "bullmq";

// import LinkModel from "@/model/link";
// import redisClient from "@/redis";
// import checkAndGeneratePdf from "./pdf";
// import upload from "./parasite/upload";
import LinkModel from "../model/link.js";
import redisClient from "../redis.js";
import checkAndGeneratePdf from "./pdf/index.js";
import upload from "./parasite/upload.js";

// import db from "@/database";
// import { createSlug } from "@/utils/createSlug";
import db from "../database/index.js";
import { createSlug } from "../utils/createSlug.js";

db.connect();

const workerProcess = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const objectId = db.ObjectId(id);

      const link = await LinkModel.aggregate([
        { $match: { _id: objectId } },
        {
          $lookup: {
            from: "sites", // sites => mongdb collection|Work, Site => mongoose Schema|not work
            localField: "domainId",
            foreignField: "_id",
            as: "site",
          },
        },
        { $unwind: "$site" },
        {
          $lookup: {
            from: "categories", // categories => mongodb collection
            localField: "categoryId",
            foreignField: "_id",
            as: "category",
          },
        },
        { $unwind: "$category" },
        {
          $lookup: {
            from: "niches",
            localField: "nicheId",
            foreignField: "_id",
            as: "niche",
          },
        },
        { $unwind: "$niche" },
        {
          $project: {
            "site.__v": 0,
            "site._id": 0,
            "site.links": 0,
            "category.__v": 0,
            "category._id": 0,
            "category.links": 0,
            "category.nicheId": 0,
            "niche.__v": 0,
            "niche._id": 0,
            "niche.categoryId": 0,
            "niche.links": 0,
            "niche.titles": 0,
            "niche.contents": 0,
            __v: 0,
          },
        },
      ]);

      if (!link[0]) {
        console.log(`${id} >>> Link not found in db`);
        reject();
      }

      const {
        file_slug,
        file_path,
        url,
        title,
        isLive,
        google_indexed,
        site,
        category,
        niche,
      } = link[0];

      if (!site.form_upload_enable) {
        console.log(`${site.domain} form upload disable`);
        resolve({ url, error: true, error_message: "form upload disable" });
      }

      // if (!google_indexed) {
      //   console.log(`${url} deindexed`);
      //   resolve({ url, error: true, error_message: "google deindexed" });
      // }
      if (isLive) {
        console.log(`${url} still live`);
        resolve({ url, error: false, error_message: null });
      }
      //  check if pdf file existing, generate if not
      const pdfFile = await checkAndGeneratePdf({
        category,
        niche,
        title,
        file_path,
        fileName: file_slug,
      });
      if (!pdfFile.ok) {
        console.log(`>>> Fail to generate pdf`);
        resolve({ url, error: true, error_message: "pdf fail" });
      }
      const { upload_form, input_selector, submit_selector, result_selector } =
        site;

      const uploadLink = await upload({
        url: upload_form,
        filePath: file_path || pdfFile.file_path_update,
        inputSelector: input_selector,
        submitSelector: submit_selector,
        resultSelector: result_selector,
        pdfLink: url,
      });

      if (!uploadLink) {
        console.log(`${url} || upload fail`);
        resolve({ url, error: true, error_message: "upload fail" });
      }

      if (!pdfFile.file_path_update) {
        console.log(`${uploadLink} - reupload success`);
        resolve({ url: uploadLink, error: false, error_message: null });
      } else {
        console.log(`${uploadLink} - reupload success + upload file path`);
        resolve({
          url: uploadLink,
          error: false,
          error_message: null,
          file_path_update: pdfFile.file_path_update,
        });
      }
    } catch (error) {
      console.log(error);

      reject(error);
    }
  });
};

const upNewWorkerProcess = async ({ category, domain, niche }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const fileName = createSlug(niche.name) + ".pdf";
      const pdfFile = await checkAndGeneratePdf({
        category,
        niche,
        fileName,
      });

      if (!pdfFile.ok) {
        resolve({ error: true, error_message: "pdf fail" });
      }
      const {
        upload_form,
        input_selector,
        submit_selector,
        result_selector,
        form_upload_enable,
      } = domain;
      if (!form_upload_enable) {
        resolve({ error: true, error_message: "form upload" });
      }
      const uploadLink = await upload({
        url: upload_form,
        filePath: pdfFile.file_path_update,
        inputSelector: input_selector,
        submitSelector: submit_selector,
        resultSelector: result_selector,
      });
      if (!uploadLink) {
        resolve({ error: true, error_message: "upload fail" });
      }

      if (!pdfFile.file_path_update) {
        resolve({ error: true, error_message: "upload fail" });
      } else {
        resolve({
          url: uploadLink,
          file_slug: fileName,
          file_path: pdfFile.file_path_update,
          title: pdfFile.genTitle,
          categoryId: category.id,
          nicheId: niche._id,
          domainId: domain._id,
          error: false,
          error_message: null,
        });
      }
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

const worker = new Worker(
  "pdf",
  async (job) => {
    const jobType = job.name;

    try {
      if (jobType === "reup") {
        const id = job.data.id;
        console.log(jobType, id);
        const upload = await workerProcess(id);
        if (upload.error) {
          await LinkModel.findByIdAndUpdate(id, {
            error: true,
            error_message: upload.error_message,
          });
        } else if (!upload.file_path_update) {
          await LinkModel.findByIdAndUpdate(id, {
            isLive: true,
            error: false,
            error_message: null,
          });
        } else {
          await LinkModel.findByIdAndUpdate(id, {
            isLive: true,
            error: false,
            error_message: null,
            file_path: upload.file_path_update,
          });
        }
      }

      if (jobType === "upnew") {
        console.log("upload new");

        const { category, domain, niche } = job.data;
        const upload = await upNewWorkerProcess({ category, domain, niche });
        if (upload.error) {
          return;
        }
        const data = {
          ...upload,
          isLive: true,
          createAt: Date.now(),
          updateAt: Date.now(),
        };
        await LinkModel.create(data);
      }
    } catch (error) {
      console.error(error.message);
    }
    return;
  },
  { concurrency: 2, connection: redisClient }
);

worker.on("completed", (job) => {
  console.log(`${job.id} has completed!`);
});

worker.on("failed", async (job, err) => {
  console.log(`${job.id} has failed with ${err.message}`);
  await job.remove();
});
