module.exports = function(app) {

    var sellOpsCtr = require('../controllers/sell-operations.controller');

    // Create a new Operation
    app.post('/sell-operations', sellOpsCtr.create);

    // Retrieve all Operations
    app.get('/sell-operations', sellOpsCtr.list);

    // Retrieve a single Operation with id
    app.get('/sell-operations/:id', sellOpsCtr.getOneById);

    // Update a Operation with id
    app.put('/sell-operations/:id', sellOpsCtr.update);

    // Delete a Operation with id
    app.delete('/sell-operations/:id', sellOpsCtr.delete);
}