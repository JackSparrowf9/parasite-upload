import TitleModel from "../model/title.js";

export const list = async (req, res) => {
  try {
    const title = await TitleModel.find({});

    return res.status(200).json({
      success: true,
      count: title.length,
      data: title,
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
    const title = await TitleModel.find({ niche: niche });

    if (!title)
      return res.status(404).json({
        success: false,
        data: "title for that niche not found",
      });

    return res.status(200).json({
      success: true,
      count: title.length,
      data: title,
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
    title: req.body.title,
    niche: req.body.niche,
    nicheId: req.body.nicheId,
  };

  if (!(data.title || data.niche || data.nicheId))
    return res
      .status(422)
      .json({ success: false, data: "Missing required field" });

  try {
    const title = await TitleModel.create(data);

    return res.status(200).json({
      success: true,
      data: await TitleModel.findById(title._id),
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
    await TitleModel.insertMany(data)
      .then(() => {
        console.log("add bulk title in database");
      })
      .catch((err) => {
        console.log(err);
      });

    return res.status(200).json({
      success: true,
      data: "all title added",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: error.message,
    });
  }
};

export const removeByNiche = async (req, res) => {
  const niche = req.params.niche;

  const title = await TitleModel.findOne({ nicheId: niche });

  if (!title)
    return res.status(404).json({
      success: false,
      data: "Title for this niche not found",
    });

  try {
    await TitleModel.findByIdAndRemove(title._id);

    return res.status(200).json({
      success: true,
      data: "title removed",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: error.message,
    });
  }
};

export const removeById = async (req, res) => {
  const { id } = req.params;
  console.log({ id });

  const title = await TitleModel.findById({ _id: id });

  if (!title)
    return res.status(404).json({
      success: false,
      data: "Title for this niche not found",
    });

  try {
    await TitleModel.findByIdAndRemove(title._id);

    return res.status(200).json({
      success: true,
      data: "title removed",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: error.message,
    });
  }
};
