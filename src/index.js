'use strict';

const create = require('./sms/create').create;
const update = require('./sms/update').update;
const scan = require('./sms/scan').scan;
const get = require('./sms/get').get;

exports.handler = (event, context, callback) => {
    console.log('## handler event : ', JSON.stringify(event, null, 2));

    const path = event.path; // /sms or /sms/100
    const method = event.httpMethod; // POST, PUT, GET

    const arr = path.split('/');
    if (arr.length < 2 || arr[1] !== 'sms') {
        callback(new Error(`Unrecognized path "${path}"`));
    }

    if (method === 'POST' && arr.length == 2) {
        create(event, context, callback);
    } else if (method === 'PUT' && arr.length == 3) {
        update(event, context, callback);
    } else if (method === 'GET' && arr.length == 2) {
        scan(event, context, callback);
    } else if (method === 'GET' && arr.length == 3) {
        get(event, context, callback);
    } else {
        callback(new Error(`Unrecognized method "${method}"`));
    }
};
