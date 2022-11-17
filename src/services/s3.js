const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');
const credentials = require('../credentials');

const uploadFileIntoS3 = async (file, key) => {
    const s3 = new S3Client({
        region: credentials.s3.region,
        endpoint: credentials.s3.endpointUrl,
        credentials: {
            accessKeyId: credentials.s3.accessKey,
            secretAccessKey: credentials.s3.secretKey,
        },
    });

    const uploadParams = {
        Bucket: credentials.s3.bucketName, 
        Key: key, 
        ACL: 'public-read',
        Body: 'BODY',
    };

    const fileStream = fs.createReadStream(file);
    fileStream.on('error', function (err) {
        console.log('File Error', err);
    });

    uploadParams.Key = path.basename(file);
    uploadParams.Body = fileStream;

    try {
        console.log(`⏳ [ServerA/S3] sending file to s3...`);
        const data = await s3.send(new PutObjectCommand(uploadParams));
        console.log('✅ [ServerA/S3] file was sent successfully', data);
    } catch (err) {
        console.log('❌ [ServerA/S3] error while sending file', err);
    }
};

module.exports = { uploadFileIntoS3 };