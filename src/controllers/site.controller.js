import SiteModel from "../model/site.js";

export const list = async (req, res) => {
  try {
    // const site = await SiteModel.find({});
    const site = await SiteModel.aggregate([
      {
        $lookup: {
          from: "links",
          localField: "_id",
          foreignField: "domainId",
          as: "links",
        },
      },
    ]);
    return res.status(200).json({
      success: true,
      data: site,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: error.message,
    });
  }
};

export const get = async (req, res) => {
  const { id } = req.params;
  try {
    const domain = await SiteModel.findOne({ domain: id });
    // const data = await SiteModel.aggregate([
    //   { $match: { domain: id } },
    //   {
    //     $lookup: {
    //       from: "Link",
    //       localField: "links",
    //       foreignField: "domainId",
    //       as: "links",
    //     },
    //   },
    // ]);
    // console.log(domain);

    // use populate
    // const data = await SiteModel.findOne({ domain: id }).populate("links");

    if (!domain) {
      return res.status(404).json({
        success: false,
        data: "Domain not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: domain,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: error.message,
    });
  }
};

export const create = async (req, res) => {
  const {
    domain,
    upload_form,
    input_selector,
    submit_selector,
    result_selector,
    links = [],
  } = req.body;

  if (
    !(
      domain ||
      upload_form ||
      input_selector ||
      submit_selector ||
      result_selector
    )
  )
    return res.status(422).json({
      success: false,
      data: "Missing requirement field",
    });

  const isDomainExit = await SiteModel.findOne({ domain });
  if (isDomainExit) {
    return res.status(200).json({
      success: true,
      data: isDomainExit,
    });
  }
  try {
    const addSite = await SiteModel.create({
      domain,
      upload_form,
      input_selector,
      submit_selector,
      result_selector,
      links,
    });
    return res.json({
      success: true,
      data: await SiteModel.findById(addSite._id),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: error.message,
    });
  }
};

export const update = async (req, res) => {
  const data = {
    domain: req.params.id,
    form_upload_enable: req.body.form_upload_enable || true,
    links: req.body.links || [],
    ...req.body,
  };

  if (!data.domain)
    return res.status(422).json({ success: false, data: "Missing params" });

  if (!data.form_upload_enable || !data.links)
    return res.status(442).json({
      success: false,
      data: "Missing requirement feild",
    });

  const isDomainExit = await SiteModel.findOne({ domain: data.domain });

  if (!isDomainExit) {
    return res.status(404).json({
      success: false,
      data: "domain not found",
    });
  }
  try {
    await SiteModel.findByIdAndUpdate(isDomainExit._id, data);
    return res.status(201).json({
      success: true,
      data: await SiteModel.findById(isDomainExit._id),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: error.message,
    });
  }
};

export const remove = async (req, res) => {
  const { id } = req.params;

  if (!id)
    return res.status(422).json({
      success: false,
      data: "Missing params",
    });

  try {
    const domain = await SiteModel.findById({ _id: id });

    if (!domain) {
      return res.status(404).json({
        success: false,
        data: "Domain not found",
      });
    }
    await SiteModel.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      data: "Domain removed",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: error.message,
    });
  }
};
