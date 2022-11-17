const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const sendError = require('../utils/errorHandler');
const sendResponse = require('../utils/responseHandler');
const credentials = require('../credentials');
const multer = require('multer');
const {
  getAdvertisements,
  getAdvertisementById,
  removeAdvertisementById,
  removeAllAdvertisements,
  addNewAdvertisement,
  findLastId
} = require('../dataaccess/Advertisement');
const { uploadFileIntoS3 } = require('../services/s3');
const publishToQueue = require('../services/ampq/publisher');

const serverA = express();
serverA.use(helmet());
serverA.use(bodyParser.json());
serverA.use(cors());
serverA.use(morgan('combined'));

const PATH = './public/uploads/';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, PATH);
  },
  filename: async (req, file, cb) => {
    const index = await findLastId();
    const fileName = `${index + 1}.${file?.mimeType?.split('/')[1] || 'jpg'}`;
    req.body.id = index + 1;
    req.body.image = `${credentials.s3.bucketContentUrlPrefix}${index + 1}.jpg`
    cb(null, fileName)
  }
});

const upload = multer({ dest: PATH, storage });

serverA.get('/', async (req, res) => {
  sendResponse({res, message: 'Server A is UP!'})
});

serverA.get('/ad', async (req, res) => {
  try {
    const data = await getAdvertisements();
    sendResponse({res, data});
  } catch (error) {
    sendError(res, error);
  }
});

serverA.get('/ad/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await getAdvertisementById(id);
    sendResponse({res, data});
  } catch (error) {
    sendError(res, error);
  }
});

serverA.delete('/ad/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await removeAdvertisementById(id);
    sendResponse({res, data});
  } catch (error) {
    sendError(res, error);
  }
});

serverA.delete('/ad', async (req, res) => {
  try {
    const data = await removeAllAdvertisements();
    sendResponse({res, data});
  } catch (error) {
    sendError(res, error);
  }
});

serverA.post('/ad', upload.single('image'), async (req, res) => {
  try {
    const { image, description, email, id } = req.body;
    await addNewAdvertisement({ image, description, email, state: 'PENDING', category: 'UNKNOWN' });
    await uploadFileIntoS3(`${PATH}${id}.jpg`, id ); // TODO: test this
    await publishToQueue(id?.toString());
    sendResponse({res, message: `آگهی شما با شناسه‌ی ${id ?? '?'} ثبت گردید.`});
  } catch (error) {
    sendError(res, error);
  }
});

module.exports = {
  core: serverA,
  name: 'ServerA',
  port: 3001
};