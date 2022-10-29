const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let advertisement = new Schema(
  {
    id: {
      type: Number,
    },
    description: {
      type: String
    },
    email: {
      type: String
    },
    state: {
      type: String
    },
    image: {
      type: String
    },
    category: {
      type: String
    },
  },
  { collection: "Employees" }
);

module.exports = mongoose.model("advertisement", advertisement);