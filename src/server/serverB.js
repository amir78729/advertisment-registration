const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
// const path = require('path');
const morgan = require('morgan');
const sendError = require('../utils/errorHandler');
const sendResponse = require('../utils/responseHandler');
const AdvertisementDTO = require('../DTO/Advertisement');
const { sendMail } = require('../services/mailgun');
const { processImage } = require('../services/imagga');
const multer = require('multer');
const { getAdvertisements,
  getAdvertisementById,
  removeAdvertisementById,
  removeAllAdvertisements,
  addNewAdvertisement,
  findLastId } = require('../dataaccess/Advertisement');

const subscribeFromQueue = require('../services/ampq/subscriber');
const publishToQueue = require('../services/ampq/publisher');
const {GoogleAuth} = require("google-auth-library");
const {google} = require("googleapis");
const fs = require("fs");

const serverB = express();
serverB.use(helmet());
serverB.use(bodyParser.json());
serverB.use(cors());
serverB.use(morgan('combined'));

serverB.get('/', async (req, res) => {
  sendResponse({res, message: 'response from server B'})
});

module.exports = {
  name: 'SERVER B',
  configs: serverB,
  port: 3002,
};