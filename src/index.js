const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const sendError = require('./utils/errorHandler');
const sendResponse = require('./utils/responseHandler');
const mongoose = require("mongoose");
const advertisement = require("./model");
const credentials = require('./credentials');

mongoose.connect(credentials?.mongoUri, { useUnifiedTopology: true, useNewUrlParser: true });

const connection = mongoose.connection;

connection.once("open", function() {
    console.log("MongoDB database connection established successfully");
});


const app = express();
app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('combined'));

app.get('/', (req, res) => {
    res.send([]);
});

app.get('/ad', async (req, res) => {
    try {
        const data = await advertisement.find({});
        sendResponse(res, data);
    } catch (error) {
        sendError(res, error);
    }
});

app.get('/ad/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = await advertisement.find({ id });
        sendResponse(res, data);
    } catch (error) {
        sendError(res, error);
    }
});

app.delete('/ad/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = await advertisement.deleteOne({ id });
        sendResponse(res, data);
    } catch (error) {
        sendError(res, error);
    }
});

app.post('/ad', async (req, res) => {
    try {
        const { image, description, email } = req.body;
        const data = await advertisement.insertMany({ id: 1, image, description, email, state: 'PENDING', category: 'UNKNOWN' });
        // const data = { image, description, email };
        sendResponse(res, data);
    } catch (error) {
        sendError(res, error);
    }
});

// starting the server
app.listen(3001, () => {
    console.log('listening on port 3001');
});