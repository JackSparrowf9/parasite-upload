import mongoose from "mongoose";

const { Schema } = mongoose;

const siteSchema = new Schema({
  domain: {
    type: String,
    require: true,
  },
  upload_form: {
    type: String,
    require: true,
  },
  input_selector: {
    type: String,
    require: true,
  },
  submit_selector: {
    type: String,
    require: true,
  },
  result_selector: {
    type: String,
    require: true,
  },
  form_upload_enable: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.model("Site", siteSchema);
