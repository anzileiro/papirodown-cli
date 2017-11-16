'use strict'

const fs = require(`fs`)
    , axios = require(`axios`)
    , path = require(`path`)

const PATHS = {
    CONFIG: path.join(__dirname, `./config.json`)
}

const URLS = {
    APIGEE: `https://api.enterprise.apigee.com/v1/organizations`
}

const createJsonFile = (dir, payload) => {
    return new Promise((resolve, reject) => {
        try {
            fs.writeFile(dir, JSON.stringify(payload), (error) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(payload)
                }
            })
        } catch (exception) {
            reject(exception)
        }
    })
}

const readJsonFile = (dir) => {
    return new Promise((resolve, reject) => {
        try {
            fs.readFile(dir, 'UTF8', (error, data) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(JSON.parse(data))
                }
            })
        } catch (exception) {
            reject(exception)
        }
    })
}

const rest = () => {

    return readJsonFile(PATHS.CONFIG).then(data => {

        return axios.create({
            auth: {
                username: data.data.email,
                password: data.data.password
            }
        })
    })
}

const user = () => {
    return readJsonFile(PATHS.CONFIG).then(data => {
        return JSON.parse(data)
    })
}

module.exports = {
    rest,
    readJsonFile,
    createJsonFile,
    user,
    PATHS,
    URLS
}