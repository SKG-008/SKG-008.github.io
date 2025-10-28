const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    try {
        const listing = JSON.parse(event.body);
        const timestamp = new Date().toISOString();
        
        const item = {
            id: uuidv4(),
            ...listing,
            createdAt: timestamp
        };
        
        const params = {
            TableName: "PropertyListings",
            Item: item
        };
        
        await dynamodb.put(params).promise();
        
        return {
            statusCode: 201,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, DELETE, PUT",
                "Access-Control-Allow-Headers": "Content-Type"
            },
            body: JSON.stringify(item)
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