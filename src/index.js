'use strict';

var create = require('./sms/create');

exports.handler = (event, context, callback) => {
    console.log('## handler event : ', JSON.stringify(event, null, 2));

    const httpMethod = event.httpMethod;

    switch (httpMethod) {
    case 'POST':
        create(event, context, callback);
        break;
    default:
        callback(new Error(`Unrecognized operation "${httpMethod}"`));
    }
};
