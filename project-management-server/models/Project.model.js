const { Schema, model } = require("mongoose");

const projectSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    tasks: [
      { type: Schema.Types.ObjectId, ref: "Task" }, // "Task" always singular, always capitalized
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = model("Project", projectSchema);
