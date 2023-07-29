import mongoose from "mongoose";

const { Schema } = mongoose;
// Ex:
// url = https://forms.middlebury.edu/system/files/webform/shazam-2-fury-of-the-gods-full-movie-download-05.pdf
// file_slug = shazam-2-fury-of-the-gods-full-movie-download-05.pdf
// file_path = pdf/ghack/1/shazam-2-fury-of-the-gods-full-movie-download-05.pdf

const linkSchema = new Schema({
  file_slug: {
    type: String,
    require: true,
  },
  file_path: {
    type: String,
    require: true,
  },
  url: {
    type: String,
    require: true,
  },
  title: {
    type: String,
    default: "",
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: "Category",
  },
  nicheId: {
    type: Schema.Types.ObjectId,
    ref: "Niche",
  },
  google_indexed: {
    type: Boolean,
    default: false,
  },
  isLive: {
    type: Boolean,
    require: true,
  },
  domainId: {
    type: Schema.Types.ObjectId,
    ref: "Site",
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  updateAt: {
    type: Date,
    default: Date.now,
  },
  error: {
    type: Boolean,
    default: false,
  },
  error_message: {
    type: String,
  },
});

export default mongoose.model("Link", linkSchema);
