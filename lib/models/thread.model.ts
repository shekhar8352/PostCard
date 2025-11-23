import mongoose from "mongoose";

const threadSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  communities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  parentId: {
    type: String,
  },
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread",
    },
  ],
  likedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: [],
    },
  ],
  mentionedUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: [],
    },
  ],
  tags: [
    {
      type: String,
    },
  ],
});

// Ensure `likedBy` and `mentionedUsers` are always set, even in old docs
threadSchema.pre("save", function (next) {
  if (!this.likedBy) {
    this.likedBy = [];
  }
  if (!this.mentionedUsers) {
    this.mentionedUsers = [];
  }
  next();
});

// Check if the model exists and if it has the new 'communities' field
if (mongoose.models.Thread && !mongoose.models.Thread.schema.paths.communities) {
  delete mongoose.models.Thread;
}

const Thread = mongoose.models.Thread || mongoose.model("Thread", threadSchema);

export default Thread;