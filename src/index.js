const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
// const path = require('path');
const morgan = require('morgan');
const sendError = require('./utils/errorHandler');
const sendResponse = require('./utils/responseHandler');
const AdvertisementDTO = require('./DTO/Advertisement');
const { sendMail } = require('./services/mailgun');
const { processImage } = require('./services/imagga');
const multer = require('multer');
const { getAdvertisements,
    getAdvertisementById,
    removeAdvertisementById,
    removeAllAdvertisements,
    addNewAdvertisement,
    findLastId } = require('./dataaccess/Advertisement');

const subscribeFromQueue = require('./services/ampq/subscriber');
const publishToQueue = require('./services/ampq/publisher');

// const upload = multer();

const app = express();
app.use(helmet());
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.use(morgan('combined'));

const PATH = './public/uploads/';
// const PATH = './src/';

/**
 * Insert new file.
 * @return{obj} file Id
 * */
async function uploadBasic(_filename) {
    const fs = require('fs');
    const {GoogleAuth} = require('google-auth-library');
    const {google} = require('googleapis');
    
    // Get credentials and build service
    // TODO (developer) - Use appropriate auth mechanism for your app
    const auth = new GoogleAuth({
        scopes: 'https://www.googleapis.com/auth/drive',
    });
    const service = google.drive({version: 'v3', auth});
    const fileMetadata = {
        name: 'photo.jpg',
    };
    const media = {
        mimeType: 'image/jpeg',
        body: fs.createReadStream('./src/138728.jpg'),
    };
    try {
        const file = await service.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id',
        });
        console.log('File Id:', file.data.id);
        return file.data.id;
    } catch (err) {
        // TODO(developer) - Handle error
        throw err;
    }
}

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

// const storage = multer.memoryStorage()

// const upload = multer({
//     // dest: PATH,
//     storage,
//     fileFilter: (req, file, cb) => {
//         console.log('filtering');
//         if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "image/gif") {
//             cb(null, true);
//         } else {
//             cb(null, false);
//             return cb(new Error('Allowed only .png, .jpg, .jpeg and .gif'));
//         }
//     }
// });
const upload = multer({ dest: PATH, storage });


// app.post('/add', (req, res, next) => {
app.post('/add', upload.single('image'), async (req, res, next) => {
    // console.log({
    //     name: req.body,
    //     imageURL: req.file.path
    // })
    // await uploadBasic();
    sendResponse({res, data: []})
})

app.get('/', async (req, res) => {
    await publishToQueue('this is a test');
    const data = await subscribeFromQueue();
    console.log('data', data)
    sendResponse({res, data})
});

app.get('/x', async (req, res) => {
    const data = await subscribeFromQueue();
    sendResponse({res, data});
});

app.get('/ad', async (req, res) => {
    try {
        const data = await getAdvertisements();
        sendResponse({res, data});
    } catch (error) {
        sendError(res, error);
    }
});

app.get('/ad/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = await getAdvertisementById(id);
        sendResponse({res, data});
    } catch (error) {
        sendError(res, error);
    }
});

app.delete('/ad/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = await removeAdvertisementById(id);
        sendResponse({res, data});
    } catch (error) {
        sendError(res, error);
    }
});

app.delete('/ad', async (req, res) => {
    try {
        const data = await removeAllAdvertisements();
        sendResponse({res, data});
    } catch (error) {
        sendError(res, error);
    }
});

app.post('/ad', upload.single('image'), async (req, res) => {
    try {
        const { image, description, email, id } = req.body;
        const data = await addNewAdvertisement({ image, description, email, state: 'PENDING', category: 'UNKNOWN' });
        await publishToQueue(id.toString());
        
        
        // await uploadBasic(data.id);
        
        // sendMail(email, 'ثبت آگهی', `آگهی شما با شناسه‌ی ${data?.id || '?'} ثبت گردید. وضعیت این آگهی پس از مدتی برای شما ارسال خواهد شد.`)
        sendResponse({res, message: `آگهی شما با شناسه‌ی ${id ?? '?'} ثبت گردید.`});
    } catch (error) {
        sendError(res, error);
    }
});

// starting the server
app.listen(3001, () => {
    console.log('listening on port 3001');
});