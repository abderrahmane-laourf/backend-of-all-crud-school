const { seedProducts } = require("./products.-seeder")

/**
 * Seeds data in database
 */
module.exports = async function run(){
    // Seed products
    await seedProducts()
}