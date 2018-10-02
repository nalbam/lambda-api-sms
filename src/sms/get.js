'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.get = (event, context, callback) => {
    const param = event.queryStringParameters;
    if (typeof param.phone_number !== 'string') {
        console.error('Validation Failed');
        callback(null, {
            statusCode: 400,
            body: {
                error: 'Validation Failed.'
            },
        });
        return;
    }

    const arr = event.path.split('/');

    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
            id: arr[2],
            phone_number: param.phone_number,
        },
    };

    // fetch sms from the database
    dynamoDb.get(params, (error, result) => {
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
            body: JSON.stringify(result.Item),
        };
        callback(null, response);
    });
};
