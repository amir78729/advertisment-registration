const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const counterSchema = new Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

counterSchema.index({ _id: 1, seq: 1 }, { unique: true });

const counterModel = mongoose.model('counter', counterSchema);

const autoIncrementModelID = function (modelName, doc, next) {
  counterModel.findByIdAndUpdate(
    modelName,
    { $inc: { seq: 1 } }, // The update
    { new: true, upsert: true }, // The options
    (error, counter) => {
      if (error) return next(error);
      doc.id = counter.seq;
      next();
    },
  );
};

module.exports = autoIncrementModelID;
