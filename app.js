const express = require('express')
const { Client } = require('@elastic/elasticsearch')
const bodyParser = require('body-parser')
const faker = require('faker')
const uuid = require('uuid')
const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const app = express()
const esController = require('./src/controllers/es')
const { port, esHost, baseUrl } = require('./src/config')
const { map } = require('lodash')
const YAML = require('yamljs')
const swaggerDoc = YAML.load('./src/swaggerDefs/config.yaml')

// const options = {
//     definition: {
//         openapi: "3.0.0",
//         info: {
//             title: "Elastic Search Express API with Swagger",
//             version: "0.1.0",
//             description: "This is a Elastic search API application made with Express and documented with Swagger",
//         },
//         servers: [
//             {
//                 url: baseUrl,
//                 description: "Development Server"
//             },
//         ],
//     },
//     apis: ["./src/swaggerDefs/*.yaml"],
// };

const specs = swaggerJsdoc(swaggerDoc);
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs)
);

app.use(bodyParser.json())

/**
 * We can start working with Elasticsearch by creating an Elasticsearch client.
 */
const esClient = new Client({ node: esHost, nodes: [] })

/**
 * Next, we will create the POST /products endpoint. 
 * It accepts POST requests to index new products into an index called products in Elasticsearch.
 * For this, we can use the index method in the elasticsearch module.
 */
app.post('/products', esController.createProductIndex)

app.get('/products', (req, res) => {
    /**
     * to match against multiple fields
     */
    // query: {
    //     multi_match: {
    //         query: searchText.trim(),
    //         fields: ['name', 'description']
    //     }
    // }
    const t1 = Date.now()
    const searchText = req.query.text || ''
    const limit = req.query.limit || 1000
    esClient.search({
        index: 'products',
        body: {
            query: {
                match: {
                    product: searchText.trim()
                }
            }
        },
        size: limit
    }).then(response => {
        let data = map(response.body.hits.hits, '_source')
        const t2 = Date.now()
        return res.json({
            total: response.body.hits.total.value,
            limit,
            took: `${response.body.took / 1000} seconds`,
            expressTook: `${(t2 - t1) / 1000} seconds`,
            data
        })
    }).catch(err => {
        console.log('err', err)
        return res.status(500).json({ message: 'Something went wrong.' })
    })
})

/**
 * Populate fake data
 * @param int limit in query
 */
app.get('/populate-fake-data', (req, res) => {
    let t1 = Date.now()
    let limit = Number(req.query.limit) || 100
    let fakeData = []

    for (let index = 0; index < limit; index++) {
        let c = faker.commerce
        fakeData[index] = {
            id: uuid.v4(),
            product: c.product(),
            price: c.price(),
            description: c.productDescription(),
            color: c.color(),
            department: c.department(),
            material: c.productMaterial(),
            imageUrl: faker.image.image()
        }
    }

    const data = fakeData.flatMap(doc => [{ index: { _index: 'products' } }, doc])

    esClient.bulk({ body: data })
        .then(response => {
            let t2 = Date.now()
            let executionTime = (t2 - t1) / 1000
            return res.json({ message: `${limit} fake data populated in ${executionTime} seconds.` })
        })
        .catch(err => {
            console.log('err', err)
            return res.status(500).json({ message: 'Something went wrong.' })
        })
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}.`);
})