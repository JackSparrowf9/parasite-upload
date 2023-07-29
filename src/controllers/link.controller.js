import LinkModel from "../model/link.js";
// import SiteModel from "@/model/site";

export const list = async (req, res) => {
  try {
    const { type } = req.query;
    // console.log(type);
    if (type === "new") {
      const list = await LinkModel.find({ google_indexed: false }).sort({
        _id: -1,
      });
      return res.status(200).json({
        success: true,
        data: list,
      });
    } else {
      const list = await LinkModel.find({});
      return res.status(200).json({
        success: true,
        data: list,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: error.message,
    });
  }
};

export const get = async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.status(422).json({ success: false, data: "Missing params" });
  console.log(id);

  try {
    const link = await LinkModel.findOne({ file_slug: id });

    if (!link) {
      return res.status(404).json({
        success: false,
        data: "Link not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: link,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: error.message,
    });
  }
};

export const create = async (req, res) => {
  const data = {
    file_slug: req.body.file_slug,
    file_path: req.body.file_path || "",
    url: req.body.url,
    categoryId: req.body.categoryId,
    nicheId: req.body.nicheId,
    isLive: req.body.isLive,
    domainId: req.body.domainId,
  };

  if (
    !data.file_slug ||
    !data.url ||
    !data.categoryId ||
    !data.nicheId ||
    !data.domainId
  )
    return res
      .status(422)
      .json({ success: false, data: "Missing requirement feild" });

  const link_in_db = await LinkModel.findOne({ file_slug: data.file_slug });

  if (link_in_db) {
    return res.status(200).json({
      success: false,
      message: "Link already exits",
      data: link_in_db,
    });
  }
  try {
    const link = await LinkModel.create(data);

    return res.status(200).json({
      success: true,
      data: await LinkModel.findById(link._id),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: error.message,
    });
  }
};

export const addBulk = async (req, res) => {
  const { data } = req.body;

  if (!data || data.length === 0)
    return res.status(422).json({ success: false, data: "missing data" });

  try {
    await LinkModel.insertMany(data)
      .then(() => {
        console.log("add bulk link in database");
      })
      .catch((err) => {
        console.log(err);
      });

    return res.status(200).json({
      success: true,
      data: "all link added",
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
    file_slug: req.params.id,
    ...req.body,
  };

  if (!data.file_slug)
    return res.status(422).json({
      success: false,
      data: "missing params",
    });

  if (!data.isLive)
    return res
      .status(200)
      .json({ success: false, data: "Missing requirement field" });

  const link = await LinkModel.findOne({ file_slug: data.file_slug });

  if (!link)
    return res.status(404).json({ success: false, data: "Link not found" });

  try {
    await LinkModel.findByIdAndUpdate(link._id, data);

    return res.status(200).json({
      success: true,
      data: await LinkModel.findById(link._id),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: error.message,
    });
  }
};

export const remove = async (req, res) => {
  const file_slug = req.params.id;

  if (!file_slug)
    return res.status(422).json({
      success: false,
      data: "Missing params",
    });

  const link = await LinkModel.findOne({ file_slug });

  if (!link)
    return res.status(404).json({
      success: false,
      data: "Link not found",
    });

  try {
    await LinkModel.findByIdAndRemove(link._id);

    return res.status(200).json({
      success: true,
      data: "Link removed",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: error.message,
    });
  }
};
