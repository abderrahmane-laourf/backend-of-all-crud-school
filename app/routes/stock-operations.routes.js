module.exports = function(app) {

    var stockOpsCtr = require('../controllers/stock-operations.controller');

    // Create a new Operation
    app.post('/stock-operations', stockOpsCtr.create);

    // Retrieve all Operations
    app.get('/stock-operations', stockOpsCtr.list);

    // Retrieve a single Operation with id
    app.get('/stock-operations/:id', stockOpsCtr.getOneById);

    // Update a Operation with id
    app.put('/stock-operations/:id', stockOpsCtr.update);

    // Delete a Operation with id
    app.delete('/stock-operations/:id', stockOpsCtr.delete);
}