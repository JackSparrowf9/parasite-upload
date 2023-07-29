import mongoose from "mongoose";

const { Schema } = mongoose;

// Ex: cpa, movie, sport
const CategorySchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  nicheId: [
    {
      type: Schema.Types.ObjectId,
      ref: "Niche",
    },
  ],
  links: [
    {
      type: Schema.Types.ObjectId,
      ref: "Link",
    },
  ],
  createAt: {
    type: Date,
    default: Date.now,
  },
  modifiedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Category", CategorySchema);
