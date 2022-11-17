const mongoose = require('mongoose');
const Advertisement = require('../models/Advertisement');
const credentials = require('../credentials');
const AdvertisementDTO = require("../DTO/Advertisement");

mongoose.connect(credentials?.mongodb.url, { useUnifiedTopology: true, useNewUrlParser: true });

const connection = mongoose.connection;

connection.once('open', function() {
  console.log('💿 [MongoDB] connection established successfully');
});

const getAdvertisements = async () => {
  console.log('💿 [MongoDB] getting list of advertisements...');
  const advertisements = await Advertisement.find({});
  return advertisements?.map(advertisement => AdvertisementDTO.output(advertisement));
};

const removeAdvertisementById = async (id) => {
  console.log(`💿 [MongoDB] removing advertisement with id = ${id}...`);
  return Advertisement.deleteOne({id});
};

const removeAllAdvertisements = async () => {
  console.log(`💿 [MongoDB] removing all advertisements...`);
  return Advertisement.deleteMany({});
};

const getAdvertisementById = async (id) => {
  console.log(`💿 [MongoDB] getting advertisement with id = ${id}...`);
  const advertisement = await Advertisement.deleteOne({ id });
  return AdvertisementDTO.output(advertisement);
};

const addNewAdvertisement = async ({ image, description, email, state, category }) => {
  console.log('💿 [MongoDB] adding new advertisement...');
  const data = new Advertisement({ image, description, email, state, category });
  data.save();
  return AdvertisementDTO.output(data);
};

const findLastId = async () => {
  console.log(`💿 [MongoDB] finding last advertisement's id...`);
  const data = await Advertisement.find({}).sort({id: -1}).limit(1);
  return data[0]?.id || -1;
};

const updateAdById = async (id, update) => {
  console.log(`💿 [MongoDB] update add with id = ${id}...`);
  const data = await Advertisement.findOneAndUpdate({ id }, update, { new: true });
  return data;
}


module.exports = {
  getAdvertisements,
  removeAdvertisementById,
  getAdvertisementById,
  addNewAdvertisement,
  findLastId,
  removeAllAdvertisements,
  updateAdById,
};
