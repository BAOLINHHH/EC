import mongoose from "mongoose";

const formSchema = new mongoose.Schema(
  {
    form: {
      type: String,
      required: true,
    },
  },
);

const Form = mongoose.model("Form", formSchema);

export default Form;
