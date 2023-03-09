const { Schema, model } = require("mongoose");

const associationSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
    },
    description: {
      type: String,
      trim: [true, "Description is required."],
    },
    email: {
      type: String,
      required: [true, "Email is required."]
    },
    location: {
        type: String,
        required: [true, "Location is required."]
    },
    image: {
      type: String,
      required: [true, "Image is required."]
    },
    service: {
        type: String,
        required: [true, "Service is required."]
    },
    socialMedia: {
        type: String
    },
    phone: {
        type: String
    },
    usersLikes: [
      {type: Schema.Types.ObjectId, ref: "User"}
    ]
  },
  {
    timestamps: true,
  }
);

module.exports = model("Association", associationSchema);
