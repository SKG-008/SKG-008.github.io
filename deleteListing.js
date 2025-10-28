const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    try {
        const id = event.pathParameters.id;
        
        const params = {
            TableName: "PropertyListings",
            Key: {
                id: id
            }
        };
        
        await dynamodb.delete(params).promise();
        
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, DELETE, PUT",
                "Access-Control-Allow-Headers": "Content-Type"
            },
            body: JSON.stringify({ message: "Listing deleted" })
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