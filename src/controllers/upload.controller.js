import upload from "../cronJob/uploadNew.js";

export const uploadNewPdf = async (req, res) => {
  const { data } = req.body;
  const { category, niches, sites } = data;

  await upload({ sites, category, niches });
  return res.status(200).json({
    success: true,
    data,
  });
};
