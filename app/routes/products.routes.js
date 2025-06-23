module.exports = function(app) {

    var productsCtr = require('../controllers/products.controller');

    // Create a new Product
    app.post('/products', productsCtr.create);

    // Retrieve all Products
    app.get('/products', productsCtr.list);

    // Retrieve a single Product with id
    app.get('/products/:id', productsCtr.getOneById);

    // Update a Product with id
    app.put('/products/:id', productsCtr.update);

    // Delete a Product with id
    app.delete('/products/:id', productsCtr.delete);
}