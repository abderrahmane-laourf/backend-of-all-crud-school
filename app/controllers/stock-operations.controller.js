const StockOperation = require("../models/stock-operations.model");
const {
  validateArticles,
  getOperationProducts,
  updateProductsStock,
} = require("../services/stock-operations.services");
/**
 * Create Operation
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.create = async function (req, res) {
  try {
    const { articles } = req.body;
    const products = await getOperationProducts(articles);

    // 1- validate articles
    const validationRes = validateArticles(articles, products);
    if (validationRes instanceof Error) {
      return res.status(400).json({ message: validationRes.message });
    }

    // 2- create operation
    stockOp = new StockOperation(req.body);
    await stockOp.save();

    // 3- update product stock
    await updateProductsStock(products);

    // 4- send response
    return res.status(201).json(stockOp);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * List operations
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.list = async function (req, res) {
  try {
    // 1- build filter
    let filter = {};
    if (req.query.search) {
      filter.name = { $regex: new RegExp(req.query.search, "i") };
    }

    // 2- get operations
    const stockOps = await StockOperation.find(filter)
      .populate("articles.product")
      .sort({ date: -1, createdAt: -1 });

    // 3- send response
    return res.status(200).json(stockOps);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * GEt one Operation by id
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.getOneById = async function (req, res) {
  try {
    // 1- get operation
    const stockOp = await StockOperation.findById(req.params.id).populate(
      "articles.product"
    );
    if (!stockOp) {
      return res.status(404).json({ message: "Opération non trouvé" });
    }

    // 2- return response
    return res.status(200).json(stockOp);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * update one Operation
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.update = async function (req, res) {
  try {
    // 1- find Operation by id
    const stockOp = await StockOperation.findById(req.params.id);
    if (!stockOp) {
      return res.status(404).json({ message: "Opération non trouvé" });
    }

    const { articles } = req.body;
    const products = await getOperationProducts(articles);

    // 2- validate articles
    const validationRes = validateArticles(articles, products);
    if (validationRes instanceof Error) {
      return res.status(400).json({ message: validationRes.message });
    }

    // 3- update Operation
    stockOp.set(req.body);
    await stockOp.save();

    // 4- update products stock
    await updateProductsStock(products);

    // 5- send response
    return res.status(201).json(stockOp);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Delete one Operation
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.delete = async function (req, res) {
  try {
    // 1- find and delete operation by id
    const stockOp = await StockOperation.findByIdAndDelete(req.params.id);
    if (!stockOp) {
      return res.status(404).json({ message: "Opération non trouvé" });
    }

    // 2- update products stock
    const products = await getOperationProducts(stockOp.articles);
    await updateProductsStock(products);

    // 3- send response
    return res.status(200).json({ message: "Opération supprimé" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
