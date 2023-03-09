const { Schema, model } = require("mongoose");

const petSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "Description is required."]
    },
    species: {
      type: String,
      required: [true, "Species is required."]
    },
    breed: {
      type: String
    },
    age: {
      type: Number
    },
    weight: {
      type: Number
    },
    birthDate: {
      type: Date
    },
    gender: {
      type: Boolean,
      required: [true, "Gender is required."]
    },
    sterilized: {
      type: Boolean
    },
    image: {
      type: String,
      required: [true, "Image is required."]
    },
    owner: [
      {type: Schema.Types.ObjectId, ref: "User"}
    ],
    location: {
      type: String,
      required: [true, "Location is required."]
    },
    interestedUsers: [
      {type: Schema.Types.ObjectId, ref: "User"}
    ],
    adoptedBy: [
      {type: Schema.Types.ObjectId, ref: "User"}
    ]
  },
  {
    timestamps: true,
  }
);

module.exports = model("Pet", petSchema);
