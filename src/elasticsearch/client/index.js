const { Client } = require('elasticsearch')
const { esHost } = require('../../config')

const esClient = new Client({ node: esHost, nodes: [] })

module.exports = {
    esClient
}