import mongoose from "mongoose";

const { Schema } = mongoose;

// ex: roblox, cashapp || tt1192233558 for movie
const NicheSchema = new Schema({
  nicheId: {
    type: String,
    require: true,
  },
  name: {
    type: String,
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: "Category",
  },
  landing_page: {
    type: String,
    require: true,
  },
  shorten_link: {
    type: Array,
  },

  createAt: {
    type: Date,
    default: Date.now,
  },
  modifiedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Niche", NicheSchema);
