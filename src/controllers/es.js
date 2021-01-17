const { esClient } = require("../elasticsearch/client")
const { validateProductRequest } = require("../utils/validators")

async function createProductIndex(req, res) {
    let { error, value } = await validateProductRequest(req.body)

    if (error) {
        return res.status(500).json({
            message: "Error",
            errors: map(error.details, 'message')
        })
    }

    try {
        await esClient.index({
            index: 'products',
            body: value
        })
        return res.json({ message: 'Indexing successful.' })
    } catch (err) {
        console.log('err', err)
        return res.status(500).json({ message: 'Something went wrong.' })
    }
}

module.exports = {
    createProductIndex
}