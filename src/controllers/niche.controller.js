import NicheModel from "../model/niche.js";
import CategoryModel from "../model/category.js";

export const list = async (req, res) => {
  try {
    const niche = await NicheModel.find({});

    return res.status(200).json({
      success: true,
      data: niche,
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

  if (!id)
    return res.status(442).json({ success: false, data: "Missing params" });
  try {
    const niche = await NicheModel.findOne({ nicheId: id });

    if (!niche)
      return res.status(404).json({
        success: false,
        data: "Niche not found",
      });

    return res.status(200).json({
      success: true,
      data: niche,
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
    nicheId: req.body.nicheId,
    name: req.body.name || "",
    categoryId: req.body.categoryId,
    links: req.body.links || [],
    landing_page: req.body.landing_page,
    shorten_link: req.body.shorten_link || [],
    titles: req.body.titleId || [],
    contents: req.body.contentId || [],
  };
  if (!data.nicheId)
    return res.status(422).json({
      success: false,
      data: "Missing Params nicheId",
    });

  if (!data.categoryId || !data.landing_page)
    return res
      .status(422)
      .json({ success: false, data: "Missing requirement field" });

  const niche_in_db = await NicheModel.findOne({ nicheId: data.nicheId });

  if (niche_in_db) {
    return res.status(200).json({
      success: false,
      message: "Niche already exits",
      data: niche_in_db,
    });
  }
  try {
    const niche = await NicheModel.create(data);

    // update niche in category
    await CategoryModel.updateOne(
      { _id: data.categoryId },
      {
        $push: {
          nicheId: niche._id,
        },
      }
    );

    return res.status(200).json({
      success: true,
      data: await NicheModel.findById(niche._id),
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
    nicheId: req.params.id,
    ...req.body,
  };

  if (!data.nicheId)
    return res.status(422).json({
      success: false,
      data: "Missing params",
    });

  try {
    const niche = await NicheModel.findOne({ nicheId: data.nicheId });

    if (!niche)
      return res.status(404).json({
        success: false,
        data: "Niche not found",
      });

    await NicheModel.findByIdAndUpdate(niche._id, data);

    return res.status(200).json({
      success: true,
      data: await NicheModel.findById(niche._id),
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
    return res.status(422).json({ success: false, data: "Missing params" });

  const niche_in_db = await NicheModel.findOne({ nicheId: id });

  if (!niche_in_db)
    return res.status(404).json({
      success: false,
      data: "Niche not found",
    });

  try {
    await NicheModel.findByIdAndRemove(niche_in_db._id);

    return res.status(200).json({
      success: true,
      data: "Niche removed",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: error.message,
    });
  }
};
