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
 *      - in: query
 *        name: text
 *        schema:
 *          type: string
 *        required: true
 *        description: Search Query 
 *      - in: query
 *        name: limit
 *        schema:
 *          type: integer
 *        required: false
 *        description: Maximum total number of results 
 *     responses:
 *       200:
 *         description: A list of products.
 *         content:
 *          application/json:
 *            schema:
 *              type: object  
 */

// ----------------------------------------------------------------------------------------------------------------------- //

 /**
 * Populate fake data for elastic search 
 * 
 * @swagger
 * /populate-fake-data:
 *   get:
 *     summary: Populates fake data
 *     description: It populates fake product data in product index. 
 *     parameters:
 *      - in: query
 *        name: limit
 *        schema:
 *          type: integer
 *        required: false
 *        description: Total fake data to populate
 *     responses:
 *       200:
 *         description: Populate fake data.
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 */