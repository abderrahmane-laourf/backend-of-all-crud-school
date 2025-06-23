const Product = require("../models/product.model")

const data = [
    {title: "Iphone 13"},
    {title: "Iphone 12"},
    {title: "Iphone 14"},
    {title: "Samsung A10"},
    {title: "Samsung A05"},
    {title: "Pochette Iphone 13"},
    {title: "Clé USB SanDisk 123"},
]
/**
 * seeds products in db
 */
exports.seedProducts = async function(){
    for await (const el of data){
        const exists = await Product.exists({title: el.title});
        if(exists) continue;

        const product = new Product(el);
        await product.save()
    }
}