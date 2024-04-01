// import AWS SDK
const AWS = require('aws-sdk');

// AWS configuration
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS,
    secretAccessKey: process.env.AWS_SECRET,
    region: process.env.AWS_REGION,
});

// Create a S3 object
const s3 = new AWS.S3();
const S3_BUCKET = process.env.AWS_BUCKET;

// handle upload image file to AWS S3
const uploadAWS = async (file) => {
    try{
        // File configuration
        const uploadImg = {
            Bucket: S3_BUCKET,
            Key: file.originalname + '-' + Date.now().toString(),
            Body: file.buffer,
            ContentType: file.mimetype,
        }
        // Upload the file to S3
        const result = await s3.upload(uploadImg).promise();

        // Logs the AWS URL of the image, after successful image upload
        console.log("Image Uploaded Successfully: ", result.Location);
        return result;
    } catch (error) {
        console.error("Error Uploading Image:", error)
        throw error();
    }
};

console.log("Successful Connection To AWS!");

// Export the S3 object, S3 bucket and uploadAWS function to be used for routes
module.exports = {s3, S3_BUCKET, uploadAWS};
