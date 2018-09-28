'use strict';

const url = require('url');
const https = require('https');

const hookUrl = process.env.SLACK_HOOK_URL;

function postMessage(message, callback) {
    const body = JSON.stringify(message);
    const options = url.parse(hookUrl);
    options.method = 'POST';
    options.headers = {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
    };

    const postReq = https.request(options, (res) => {
        const chunks = [];
        res.setEncoding('utf8');
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => {
            if (callback) {
                callback({
                    body: chunks.join(''),
                    statusCode: res.statusCode,
                    statusMessage: res.statusMessage,
                });
            }
        });
        return res;
    });

    postReq.write(body);
    postReq.end();
}

function processEvent(event, callback) {
    const body = JSON.parse(event.body);

    const message = {
        username: body.id,
        icon_emoji: ':vibration_mode:',
        attachments: [{
            text: body.message,
            footer: body.phone_number,
        }]
    };

    postMessage(message, (response) => {
        if (response.statusCode < 400) {
            console.info('Message posted successfully');
            callback(null);
        } else if (response.statusCode < 500) {
            console.error(`Error posting message to Slack API: ${response.statusCode} - ${response.statusMessage}`);
            callback(null);  // Don't retry because the error is due to a problem with the request
        } else {
            // Let Lambda retry
            callback(`Server error when processing message: ${response.statusCode} - ${response.statusMessage}`);
        }
    });
}

exports.handler = (event, context, callback) => {
    console.log('## handler event : ', JSON.stringify(event, null, 2));

    if (hookUrl) {
        processEvent(event, callback);
    } else {
        callback('Hook URL has not been set.');
    }
};
