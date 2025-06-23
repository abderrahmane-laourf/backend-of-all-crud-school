const Product = require("../models/product.model");
const StockOperation = require("../models/stock-operations.model");

exports.getOperationProducts = async function (articles) {
  // validate field
  if (!articles || !Array.isArray(articles)) {
    throw new Error("Articles non valides");
  }

  // get Products
  const pIds = articles.map((a) => a.product);
  return Product.find({ _id: { $in: pIds } });
};

exports.validateArticles = function (articles, products) {
  // check products one by one
  for ({ product: id, quantity } of articles) {
    // product should exists in DB
    const product = products.find((p) => p._id.equals(id));
    if (!product) {
      return new Error("Produit n'existe pas");
    }

    // quantity should be valid
    if (!quantity || quantity < 0) {
      return new Error("Quantité non valide");
    }
    
  }

  return true;
};

exports.updateProductsStock = async function (products) {
  return Promise.all(
    products.map(async (product) => {
      const stocks = await StockOperation.aggregate([
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

      product.stocks = stocks.length > 0 ? stocks[0].totalQuantity : 0;
      return product.save();
    })
  );
};
