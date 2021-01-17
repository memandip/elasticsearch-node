const { productSchema } = require('../../models')

function validateProductRequest(data) {
    const { error, value } = productSchema.validate(data)

    return { error, value }
}

module.exports = {
    validateProductRequest
}