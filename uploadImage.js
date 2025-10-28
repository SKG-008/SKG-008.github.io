const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.handler = async (event) => {
    try {
        const { imageData, fileName, contentType } = JSON.parse(event.body);
        
        // Convert base64 to buffer
        const buffer = Buffer.from(imageData, 'base64');
        
        const params = {
            Bucket: 'virtual-market-images',
            Key: `listings/${Date.now()}-${fileName}`,
            Body: buffer,
            ContentType: contentType,
            ACL: 'public-read'
        };
        
        const result = await s3.upload(params).promise();
        
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST",
                "Access-Control-Allow-Headers": "Content-Type"
            },
            body: JSON.stringify({ imageUrl: result.Location })
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({ error: error.message })
        };
    }
};