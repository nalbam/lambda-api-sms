'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.scan = (event, context, callback) => {
    const data = event.queryStringParameters;
    if (!data || typeof data.phone_number !== 'string' || typeof data.checked !== 'string') {
        console.error('Validation Failed');
        callback(null, {
            statusCode: 400,
            body: {
                error: 'Validation Failed.'
            },
        });
        return;
    }

    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        FilterExpression: 'phone_number = :phone_number and checked = :checked',
        ExpressionAttributeValues: {
            ':phone_number': data.phone_number,
            ':checked': (data.checked === 'true'),
        },
    };

    // fetch all sms from the database
    dynamoDb.scan(params, (error, result) => {
        // handle potential errors
        if (error) {
            console.error(error);
            callback(null, {
                statusCode: error.statusCode || 501,
                body: error,
            });
            return;
        }

        // create a response
        const response = {
            statusCode: 200,
            body: JSON.stringify(result.Items),
        };
        callback(null, response);
    });
};
