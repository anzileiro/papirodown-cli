'use strict'

const commander = require('commander')
    , util = require('util')
    , prompt = require('inquirer')
    , apigee = require('./apigee')
    , questions = require('./questions')

commander
    .version('0.0.1')
    .description('papirodown-cli')

commander
    .command('config')
    .description('set user data configuration')
    .action(() => {
        prompt.prompt(questions.configuration).then(answers => {
            apigee
                .setUserConfiguration(answers)
                .then(result => apigee.response(`successfully saved`))
                .catch(({ message }) => apigee.response(message))
        })
    })

commander
    .command('backup-proxies')
    .description('download of all proxies and their revivions')
    .action(() => {
        apigee
            .backupOfProxies()
            .then(result => apigee.response(result))
            .catch(({ message }) => apigee.response(message))
    })

commander
    .parse(process.argv)