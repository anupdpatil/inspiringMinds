import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
    service: {
      type: String,
      required: true,
      enum: [
        "Custom software development",
        "AI & business automation",
        "Web application development",
        "IT consulting",
        "Something else",
      ],
    },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
    status: { type: String, enum: ["new", "contacted", "closed"], default: "new" },
  },
  { timestamps: true }
);

export default mongoose.model("Enquiry", enquirySchema);
