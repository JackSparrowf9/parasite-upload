import ContentModel from "../model/content.js";

export const list = async (req, res) => {
  try {
    const content = await ContentModel.find({});

    return res.status(200).json({
      success: true,
      count: content.length,
      data: content,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: error.message,
    });
  }
};

export const get = async (req, res) => {
  const niche = req.params.id;

  try {
    const content = await ContentModel.find({ niche: niche });

    if (!content)
      return res.status(404).json({
        success: false,
        data: "content for that niche not found",
      });

    return res.status(200).json({
      success: true,
      count: content.length,
      data: content,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: error.message,
    });
  }
};

export const create = async (req, res) => {
  console.log(req.body);

  const data = {
    paragraph: req.body.paragraph,
    niche: req.body.niche,
    nicheId: req.body.nicheId,
  };
  console.log(data);

  if (!(data.paragraph || data.niche || data.nicheId))
    return res
      .status(422)
      .json({ success: false, data: "Missing required field" });

  try {
    const content = await ContentModel.create(data);

    return res.status(200).json({
      success: true,
      data: await ContentModel.findById(content._id),
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
    await ContentModel.insertMany(data)
      .then(() => {
        console.log("add bulk content in database");
      })
      .catch((err) => {
        console.log(err);
      });

    return res.status(200).json({
      success: true,
      data: "all content added",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: error.message,
    });
  }
};

export const remove = async (req, res) => {
  const niche = req.params.id;

  const content = await ContentModel.findOne({ nicheId: niche });

  if (!niche)
    return res.status(404).json({
      success: false,
      data: "content for this niche not found",
    });

  try {
    await ContentModel.findByIdAndRemove(content._id);

    return res.status(200).json({
      success: true,
      data: "content removed",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: error.message,
    });
  }
};
