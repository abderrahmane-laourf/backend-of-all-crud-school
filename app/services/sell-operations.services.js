const Product = require("../models/product.model");
const SellOperation = require("../models/sell-operations.model");

/**
 * get Product operation
 * @param {*} articles 
 * @returns 
 */
exports.getOperationProducts = async function (articles) {
  // validate field
  if (!articles || !Array.isArray(articles)) {
    throw new Error("Articles non valides");
  }

  // get Products
  const pIds = articles.map((a) => a.product);
  return Product.find({ _id: { $in: pIds } });
};

/**
 * validate Articles of operation
 * @param {*} articles 
 * @param {*} products 
 * @returns 
 */
exports.validateArticles = function (articles, products) {
  // check products one by one
  for ({ product: id, quantity } of articles) {
    // product should exists in DB
    const product = products.find((p) => p._id.equals(id));
    if (!product) {
      return new Error("Produit n'existe pas");
    }
    console.log('valider', product.title);

    // quantity should be valid 
    if (!quantity || quantity < 0 ) {
      return new Error("Quantité non valide");
    }
    // sotkc should be available
    if(quantity > product.stock_available){
      return new Error(`Le stock du produit ${product.title} est insuffisant:`)
    }
  };

  return true;
};

/**
 * updates Sells field of products
 * @param {*} products 
 * @returns 
 */
exports.updateProductsSells = async function (products) {
  return Promise.all(
    products.map(async (product) => {
      const result = await SellOperation.aggregate([
        { $unwind: "$articles" },
        {
          $match: { "articles.product": product._id },
        },
        {
          $group: {
            _id: null,
            totalQuantity: { $sum: "$articles.quantity" },
          },
        },
      ]);

      product.sells = result.length > 0 ? result[0].totalQuantity : 0;
      return product.save();
    })
  );
};
