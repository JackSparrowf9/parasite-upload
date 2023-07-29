import mongoose from "mongoose";

const { Schema } = mongoose;

const ContentSchema = new Schema({
  paragraph: {
    type: String,
    require: true,
  },
  niche: {
    type: String,
    require: true,
  },
  nicheId: {
    type: Schema.Types.ObjectId,
    ref: "Niche",
  },
});

export default mongoose.model("Content", ContentSchema);
