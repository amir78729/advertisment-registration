const mongoose = require('mongoose');
const Advertisement = require('../models/Advertisement');
const credentials = require('../credentials');
const AdvertisementDTO = require("../DTO/Advertisement");

mongoose.connect(credentials?.mongodb.url, { useUnifiedTopology: true, useNewUrlParser: true });

const connection = mongoose.connection;

connection.once('open', function() {
  console.log('MongoDB database connection established successfully');
});

const getAdvertisements = async () => {
  const advertisements = await Advertisement.find({});
  return advertisements?.map(advertisement => AdvertisementDTO.output(advertisement));
};

const removeAdvertisementById = async (id) => {
  return Advertisement.deleteOne({id});
};

const removeAllAdvertisements = async () => {
  return Advertisement.deleteMany({});
};

const getAdvertisementById = async (id) => {
  const advertisement = await Advertisement.deleteOne({ id });
  return AdvertisementDTO.output(advertisement);
};

const addNewAdvertisement = async ({ image, description, email, state, category }) => {
  const data = new Advertisement({ image, description, email, state, category });
  data.save();
  return AdvertisementDTO.output(data);
};

const findLastId = async () => {
  const data = await Advertisement.find({}).sort({id: -1}).limit(1);
  return data[0]?.id || -1;
}


module.exports = { getAdvertisements, removeAdvertisementById, getAdvertisementById, addNewAdvertisement, findLastId, removeAllAdvertisements }
