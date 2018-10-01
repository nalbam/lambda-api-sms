'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
    const data = JSON.parse(event.body);
    if (typeof data.message !== 'string') {
        console.error('Validation Failed');
        callback(null, {
            statusCode: 400,
            headers: {
                'Content-Type': 'text/plain'
            },
            body: 'Couldn\'t create the sms item.',
        });
        return;
    }

    const timestamp = new Date().getTime();

    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Item: {
            id: `${data.id}`,
            device_id: data.device_id,
            event: data.event,
            from: data.from,
            phone_number: data.phone_number,
            message: data.message,
            checked: false,
            createdAt: timestamp,
            updatedAt: timestamp,
        },
    };

    // write the sms to the database
    dynamoDb.put(params, (error) => {
        // handle potential errors
        if (error) {
            console.error(error);
            callback(null, {
                statusCode: error.statusCode || 501,
                headers: {
                    'Content-Type': 'text/plain'
                },
                body: 'Couldn\'t create the sms item.',
            });
            return;
        }

        // create a response
        const response = {
            statusCode: 200,
            body: JSON.stringify(params.Item),
        };
        callback(null, response);
    });
};
