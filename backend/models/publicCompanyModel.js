import mongoose from "mongoose";

const publicCompanySchema = new mongoose.Schema(
  {
    publicCompanyName: {
      type: String,
      required: true,
    },
  },
);

const PublicCompany = mongoose.model("PublicCompany", publicCompanySchema);

export default PublicCompany;