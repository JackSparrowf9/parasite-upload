import SiteModel from "../model/site.js";
import CategoryModel from "../model/category.js";
import NicheModel from "../model/niche.js";

import { uploadNewPdfJob } from "./job.js";

const upload = async ({ sites, category, niches }) => {
  if (!category.name || !category.id) return;
  if (sites.length === 0 || niches.length === 0) return;

  let data = { category };
  try {
    for (const site of sites) {
      if (!site.form_upload_enable) return false;
      data = { ...data, domain: site };

      for (const niche of niches) {
        data = { ...data, niche };
        await uploadNewPdfJob({ name: "upnew", data });
      }
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

export default upload;
