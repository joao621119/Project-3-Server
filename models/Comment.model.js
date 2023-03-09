const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
  {
    author: [
      {type: Schema.Types.ObjectId, ref: "User",
      required: [true, "Author is required."]},
    ],
    text: {
      type: String,
      required: [true, "Text is required."],
      trim: true
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Comment", commentSchema);
