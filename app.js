const express = require('express')
const { Client } = require('@elastic/elasticsearch')
const bodyParser = require('body-parser')
const faker = require('faker')
const uuid = require('uuid')
const app = express()
const esController = require('./src/controllers/es')
const { port, esHost } = require('./src/config')

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

/**
 * Next, let’s create the GET /products endpoint. 
 * It handles GET requests with text queries for a product user is searching for. 
 * We use this text query to search the name fields of the products indexed in 
 * Elasticsearch so that the server can respond with a list of products similar to 
 * what the user is looking for.
 */
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

    const searchText = req.query.text || ''
    esClient.search({
        index: 'products',
        body: {
            query: {
                match: {
                    name: searchText.trim()
                }
            }
        }
    }).then(response => {
        return res.json(response)
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