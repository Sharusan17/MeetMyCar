const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS,
    secretAccessKey: process.env.AWS_SECRET,
    region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();
const S3_BUCKET = process.env.AWS_BUCKET;

const uploadAWS = async (file) => {
    try{
        const uploadImg = {
            Bucket: S3_BUCKET,
            Key: file.originalname + '-' + Date.now().toString(),
            Body: file.buffer,
            ContentType: file.mimetype,
        }
        const result = await s3.upload(uploadImg).promise();

        console.log("Image Uploaded Successfully: ", result.Location);
        return result;
    } catch (error) {
        console.error("Error Uploading Image:", error)
        throw error();
    }
};

console.log("Successful Connection To AWS!");

module.exports = {s3, S3_BUCKET, uploadAWS};
