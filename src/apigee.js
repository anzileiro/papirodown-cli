'use strict'

const axios = require('axios')
    , util = require('util')
    , fs = require('fs')
    , path = require('path')
    , qs = require('qs')
    , utils = require('./utils')
    , http = require('https')
    , mime = require('mime')

let apigee = {
    response: (data) => {
        console.log(util.inspect(data, false, null))
    },
    setUserConfiguration: (data) => {
        return utils.createJsonFile(utils.PATHS.CONFIG, { data }).then(result => {
            return result
        })
    },
    getUserConfiguration: () => {
        return utils.readJsonFile(utils.PATHS.CONFIG)
    },
    getOrgProxies: (orgName) => {
        return utils.rest().then(call => call.get(`${utils.URLS.APIGEE}/${orgName}/apis`).then(result => {
            return result
        }))
    },
    getProxyRevisions: (orgName, proxyName) => {
        return utils.rest().then(call => call.get(`${utils.URLS.APIGEE}/${orgName}/apis/${proxyName}`).then(result => {
            return result
        }))
    },
    downloadProxy: (orgName, proxyName, revisionNumber) => {
        return utils.rest().then(call => call.get(`${utils.URLS.APIGEE}/${orgName}/apis/${proxyName}/revisions/${revisionNumber}?format=bundle`, {
            responseType: 'arraybuffer'
        }).then(result => {
            return result
        }))
    },
    writeFile: (data, name) => {
        return new Promise((resolve, reject) => {
            try {
                fs.writeFile(path.join(__dirname, `../backup/${name}.zip`), data, 'utf-8', (error) => {
                    if (error) {
                        reject(error)
                    } else {
                        resolve(data)
                    }
                })
            } catch (exception) {
                reject(exception)
            }
        })
    },
    backupOfProxies: async () => {

        let user = await apigee.getUserConfiguration()
        let proxies = await apigee.getOrgProxies(user.data.organization)

        let proxiesAndTheirRevisions = await proxies.data.map(async proxy => {
            let actual = await proxy

            let revisions = await apigee.getProxyRevisions(user.data.organization, actual)

            return {
                name: actual,
                revisions: revisions.data.revision
            }
        })

        return Promise.all(proxiesAndTheirRevisions).then(data => {

            let queue = []

            data.forEach(item => {
                item.revisions.forEach(revision => {
                    queue.push({ proxy: item.name, revision: revision })
                })
            })

            queue.forEach(item => {
                let fileName = `proxy_${item.proxy}_revision_${item.revision}`
                apigee.downloadProxy(user.data.organization, `${item.proxy}`, `${item.revision}`).then(data => {
                    let blob = new Buffer(data.data, 'utf-8').toString('base64')
                    apigee.writeFile(Buffer.from(blob, 'base64'), fileName).then(file => {
                        console.log(`${fileName} saved`)
                    })
                })
            })

        }).then(status => {
            return `all proxies revision have been saved`
        })
    }
}

module.exports = apigee
