/**
 * Next, let’s create the GET /products endpoint. 
 * It handles GET requests with text queries for a product user is searching for. 
 * We use this text query to search the name fields of the products indexed in 
 * Elasticsearch so that the server can respond with a list of products similar to 
 * what the user is looking for.
 * 
 * @swagger
 * /products:
 *   get:
 *     summary: Retrieve a list of products
 *     description: It handles GET requests with text queries for a product user is searching for. 
 *     parameters:
 *      - in: path
 *        name: text
 *        schema:
 *          type: string
 *        required: true
 *        description: Search Query 
 *      - in: path
 *        name: limit
 *        schema:
 *          type: integer
 *        required: false
 *        description: Maximum total number of results 
 *     responses:
 *       200:
 *         description: A list of products.
 */