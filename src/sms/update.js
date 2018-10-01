'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.update = (event, context, callback) => {
    const data = JSON.parse(event.body);
    if (typeof data.checked !== 'boolean') {
        console.error('Validation Failed');
        callback(null, {
            statusCode: 400,
            headers: {
                'Content-Type': 'text/plain'
            },
            body: 'Couldn\'t update the sms item.',
        });
        return;
    }

    const timestamp = new Date().getTime();

    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
            id: event.pathParameters.id,
        },
        ExpressionAttributeValues: {
            ':checked': data.checked,
            ':updatedAt': timestamp,
        },
        UpdateExpression: 'SET checked = :checked, updatedAt = :updatedAt',
        ReturnValues: 'ALL_NEW',
    };

    // update the sms in the database
    dynamoDb.update(params, (error, result) => {
        // handle potential errors
        if (error) {
            console.error(error);
            callback(null, {
                statusCode: error.statusCode || 501,
                headers: {
                    'Content-Type': 'text/plain'
                },
                body: 'Couldn\'t fetch the sms item.',
            });
            return;
        }

        // create a response
        const response = {
            statusCode: 200,
            body: JSON.stringify(result.Attributes),
        };
        callback(null, response);
    });
};
