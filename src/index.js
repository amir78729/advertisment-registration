const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const morgan = require('morgan');
const sendError = require('./utils/errorHandler');
const sendResponse = require('./utils/responseHandler');
const mongoose = require('mongoose');
const Advertisement = require('./models/Advertisement');
const credentials = require('./credentials');
const AdvertisementDTO = require('./DTO/Advertisement');
const { sendMail } = require('./services/mailgun');
const { processImage } = require('./services/imagga');
const multer = require('multer');
// const upload = multer();

mongoose.connect(credentials?.mongoUri, { useUnifiedTopology: true, useNewUrlParser: true });

const connection = mongoose.connection;

connection.once('open', function() {
    console.log('MongoDB database connection established successfully');
});

const app = express();
app.use(helmet());
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.use(morgan('combined'));

// for parsing multipart/form-data
// app.use(upload.array());
// app.use(express.static('public'));
const PATH = './src/';

/**
 * Insert new file.
 * @return{obj} file Id
 * */
async function uploadBasic() {
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
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        console.log('file', file)
        cb(null, fileName)
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "image/gif") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Allowed only .png, .jpg, .jpeg and .gif'));
        }
    }
});

// app.post('/add', (req, res, next) => {
app.post('/add', upload.single('image'), async (req, res, next) => {
    // console.log({
    //     name: req.body.name,
    //     imageURL: req.file.path
    // })
    await uploadBasic();
    sendResponse(res, [])
})

app.get('/', (req, res) => {
    res.send([]);
});

app.get('/ad', async (req, res) => {
    try {
        const data = await Advertisement.find({});
        
        // const processingResult = await processImage('https://stackify.com/wp-content/uploads/2018/12/Node.js-Module-Exports-881x441.jpg');
        // if (processingResult?.isVehicleValid) {
        //     console.log(processingResult?.category)
        // } else {
        //     console.log('not a vehicle')
        // }
        
        sendResponse(res, data?.map(_data => AdvertisementDTO.output(_data)));
    } catch (error) {
        sendError(res, error);
    }
});

app.get('/ad/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = await Advertisement.findOne({ id });
        // res.send("recieved your request!");
        sendResponse(res, AdvertisementDTO.output(data));
    } catch (error) {
        sendError(res, error);
    }
});

app.delete('/ad/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = await Advertisement.deleteOne({ id });
        sendResponse(res, data);
    } catch (error) {
        sendError(res, error);
    }
});

app.post('/ad', async (req, res) => {
    try {
        console.log(req.body);
        // const { image, description, email } = req.body;
        // const data = new Advertisement({ image, description, email, state: 'PENDING', category: 'UNKNOWN' });
        // await data.save();
        
        // sendMail(email, 'ثبت آگهی', `آگهی شما با شناسه‌ی ${data?.id || '?'} ثبت گردید. وضعیت این آگهی پس از مدتی برای شما ارسال خواهد شد.`)
        // sendResponse(res, AdvertisementDTO.output(data), `آگهی شما با شناسه‌ی ${data?.id || '?'} ثبت گردید.`);
        sendResponse(res, {});
    } catch (error) {
        sendError(res, error);
    }
});

// starting the server
app.listen(3001, () => {
    console.log('listening on port 3001');
});