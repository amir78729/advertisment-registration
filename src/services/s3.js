const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');

// Create an S3 client service object
const s3 = new S3Client({
    region: 'default',
    endpoint: 'endpoint_url',
    credentials: {
        accessKeyId: 'access_key',
        secretAccessKey: 'secret_key',
    },
});

const uploadParams = {
    Bucket: 'sample_bucket', // bucket name
    Key: 'object-name', // the name of the selected file
    ACL: 'public-read', // 'private' | 'public-read'
    Body: 'BODY',
};

// BODY (the contents of the uploaded file - leave blank/remove to retain contents of original file.)
const file = 'file.png'; //FILE_NAME (the name of the file to upload (if you don't specify KEY))

// call S3 to retrieve upload file to specified bucket
const run = async () => {
    // Configure the file stream and obtain the upload parameters
    const fileStream = fs.createReadStream(file);
    fileStream.on('error', function (err) {
        console.log('File Error', err);
    });
    uploadParams.Key = path.basename(file);
    // call S3 to upload file to specified bucket
    uploadParams.Body = fileStream;

    try {
        const data = await s3.send(new PutObjectCommand(uploadParams));
        console.log('Success', data);
    } catch (err) {
        console.log('Error', err);
    }
};

run();