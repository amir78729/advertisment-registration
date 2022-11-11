const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const sendError = require('../utils/errorHandler');
const sendResponse = require('../utils/responseHandler');
const multer = require('multer');
const {
  getAdvertisements,
  getAdvertisementById,
  removeAdvertisementById,
  removeAllAdvertisements,
  addNewAdvertisement,
  findLastId
} = require('../dataaccess/Advertisement');

const fetch = require('node-fetch');

const publishToQueue = require('../services/ampq/publisher');
// const {GoogleAuth} = require("google-auth-library");
// const {google} = require("googleapis");
// const fs = require("fs");

const serverA = express();
serverA.use(helmet());
serverA.use(bodyParser.json());
serverA.use(cors());
serverA.use(morgan('combined'));

const PATH = './public/uploads/';

/**
 * Insert new file.
 * @return{obj} file Id
 * */
// async function uploadBasic(_filename) {
//   const fs = require('fs');
//   const {GoogleAuth} = require('google-auth-library');
//   const {google} = require('googleapis');
//
//   // Get credentials and build service
//   // TODO (developer) - Use appropriate auth mechanism for your serverA
//   const auth = new GoogleAuth({
//     scopes: 'https://www.googleapis.com/auth/drive',
//   });
//   const service = google.drive({version: 'v3', auth});
//   const fileMetadata = {
//     name: 'photo.jpg',
//   };
//   const media = {
//     mimeType: 'image/jpeg',
//     body: fs.createReadStream('./src/138728.jpg'),
//   };
//   try {
//     const file = await service.files.create({
//       resource: fileMetadata,
//       media: media,
//       fields: 'id',
//     });
//     console.log('File Id:', file.data.id);
//     return file.data.id;
//   } catch (err) {
//     // TODO(developer) - Handle error
//     throw err;
//   }
// }

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, PATH);
  },
  filename: async (req, file, cb) => {
    const index = await findLastId();
    const fileName = `${index + 1}.${file?.mimeType?.split('/')[1] || 'jpg'}`;
    req.body.id = index + 1;
    // const fileName = file.originalname.toLowerCase().split(' ').join('-');
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
    await publishToQueue(id.toString());
    // TODO: upload image to S3
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