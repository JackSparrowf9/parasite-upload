import mongoose from "mongoose";

const { Schema } = mongoose;

const TitleSchema = new Schema({
  title: {
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

export default mongoose.model("Title", TitleSchema);
