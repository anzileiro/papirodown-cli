'use strict'

let questions = {
    configuration: [
        {
            type: 'input',
            name: 'email',
            message: ' => type your email: '
        },
        {
            type: 'password',
            name: 'password',
            message: ' => type your password: '
        },
        {
            type: 'organization',
            name: 'organization',
            message: ' => type your organization: '
        }
    ]
}

//https://api.enterprise.apigee.com/v1/o/
module.exports = questions