'use strict';

const create = require('./sms/create').create;
const update = require('./sms/update').update;
const scan = require('./sms/scan').scan;

exports.handler = (event, context, callback) => {
    console.log('## handler event : ', JSON.stringify(event, null, 2));

    const httpMethod = event.httpMethod;

    switch (httpMethod) {
    case 'POST':
        create(event, context, callback);
        break;
    case 'PUT':
        update(event, context, callback);
        break;
    case 'GET':
        scan(event, context, callback);
        break;
    default:
        callback(new Error(`Unrecognized operation "${httpMethod}"`));
    }
};
