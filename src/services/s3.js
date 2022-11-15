const uploadFileIntoS3 = async (file, key) => {
    const { S3Client, PutObjectCommand, ListObjectsCommand } = require('@aws-sdk/client-s3');
    const fs = require('fs');
    const path = require('path');
    const credentials = require('../credentials');

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
    // call S3 to upload file to specified bucket
    uploadParams.Body = fileStream;

    try {
        const data = await s3.send(new PutObjectCommand(uploadParams));
        console.log('Success', data);
    } catch (err) {
        console.log('Error', err);
    }
};

module.exports = { uploadFileIntoS3 };