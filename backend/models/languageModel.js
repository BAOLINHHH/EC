import mongoose from "mongoose";

const languageSchema = new mongoose.Schema(
  {
    languageName: {
      type: String,
      required: true,
    },
  },
);

const Language = mongoose.model("Language", languageSchema);

export default Language;