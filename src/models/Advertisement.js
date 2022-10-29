const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const autoIncrementModelID = require('./counterModel');


const Advertisement = new Schema(
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
  {
    collection: "Employees",
    timestamps: true,
  }
);

Advertisement.pre('save', function (next) {
  if (!this.isNew) {
    next();
    return;
  }
  autoIncrementModelID('advertisement', this, next);
});


module.exports = mongoose.model("advertisement", Advertisement);