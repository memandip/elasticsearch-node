const path = require('path')
const dotenv = require('dotenv')

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') })

module.exports = {
    port: process.env.PORT,
    esHost: process.env.ES_HOST
}