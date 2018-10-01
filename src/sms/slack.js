'use strict';

const url = require('url');
const https = require('https');

const slack_hook_url = process.env.SLACK_HOOK_URL;

function postMessage(message, callback) {
    const body = JSON.stringify(message);
    const options = url.parse(slack_hook_url);
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
        username: 'sms',
        icon_emoji: ':vibration_mode:',
        attachments: [{
            title: body.phone_number,
            text: body.message,
            footer: body.id,
        }]
    };

    postMessage(message, (response) => {
        if (response.statusCode < 400) {
            console.info('Message posted successfully');
            callback(null);
        } else if (response.statusCode < 500) {
            console.error(`Error posting message to Slack API: ${response.statusCode} - ${response.statusMessage}`);
            callback(null); // Don't retry because the error is due to a problem with the request
        } else {
            // Let Lambda retry
            callback(`Server error when processing message: ${response.statusCode} - ${response.statusMessage}`);
        }
    });
}
