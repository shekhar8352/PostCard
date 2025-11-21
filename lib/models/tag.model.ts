import mongoose from "mongoose";

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  threads: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread",
    },
  ],
  createdOn: {
    type: Date,
    default: Date.now,
  },
});

const Tag = mongoose.models.Tag || mongoose.model("Tag", tagSchema);

export default Tag;
