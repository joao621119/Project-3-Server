const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    name: {
      type: String,
      required: [true, "Name is required."],
    },
    description: {
      type: String,
      required: [true, "Description is required."]
    },
    location: {
      type: String
    },
    age: {
      type: Number
    },
    userType: {
      type: String,
      required: [true, "User type is required."],
      enum: ["valid", "invalid"]
    },
    phone: {
      type: String
    },
    image: {
      type: String
    },
    gender: {
      type: String
    },
    interestedPets: [
      {type: Schema.Types.ObjectId, ref: "Pet"}
    ],
    petsToAdopt: [
      {type: Schema.Types.ObjectId, ref: "Pet"}
    ],
    adoptedPets: [
      {type: Schema.Types.ObjectId, ref: "Pet"}
    ],
    reviews: [
      {type: Schema.Types.ObjectId, ref: "Comment"}
    ],
    likedAssociations: [
      {type: Schema.Types.ObjectId, ref: "Association"}
    ]
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt` in mongo
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
