const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    try {
        const params = {
            TableName: "PropertyListings"
        };
        
        const data = await dynamodb.scan(params).promise();
        
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, DELETE, PUT",
                "Access-Control-Allow-Headers": "Content-Type"
            },
            body: JSON.stringify(data.Items)
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