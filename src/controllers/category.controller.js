import CategoryModel from "../model/category.js";

export const list = async (req, res) => {
  try {
    const list = await CategoryModel.find({}).populate("nicheId");
    return res.status(200).json({
      success: true,
      data: list,
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
    const category = await CategoryModel.findOne({ name: id });
    if (!category) {
      return res.status(404).json({
        success: false,
        data: "Category not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: category,
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
    name: req.body.name,
    nicheId: req.body.nicheId || [],
    link: req.body.linkId || [],
  };

  if (!data.name)
    return res
      .status(422)
      .json({ success: false, data: "Missing requirement field" });

  const isCategoryExit = await CategoryModel.findOne({ name: data.name });
  // console.log(isCategoryExit);

  if (isCategoryExit) {
    return res.status(200).json({
      success: false,
      message: "Category already exits",
      data: isCategoryExit,
    });
  }

  try {
    const category = await CategoryModel.create(data);
    return res.status(200).json({
      success: true,
      data: await CategoryModel.findById(category._id),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: error.message,
    });
  }
};

export const update = async (req, res) => {
  const { id } = req.params;
  const data = {
    nicheId: req.body.nicheId || [],
    links: req.body.linkId || [],
    modifiedAt: Date.now(),
  };
  if (!id)
    return res
      .status(422)
      .json({ success: false, data: "Missing requirement field" });

  try {
    const category = await CategoryModel.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        data: "Category not found",
      });
    }

    await CategoryModel.findByIdAndUpdate(id, data);

    return res.status(201).json({
      success: true,
      data: await CategoryModel.findById(id),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: error.message,
    });
  }
};

export const remove = async (req, res) => {
  const name = req.params.id;

  try {
    const category = await CategoryModel.findOne({ name: name });
    if (!category) {
      return res.status(404).json({
        success: true,
        data: "Category not found",
      });
    }

    await CategoryModel.findByIdAndDelete(category._id);

    return res.status(200).json({
      success: true,
      data: "Category removed",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: error.message,
    });
  }
};
