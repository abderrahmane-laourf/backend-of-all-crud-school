const SellOperation = require("../models/sell-operations.model");
const {
  getOperationProducts,
  validateArticles,
  updateProductsSells,
} = require("../services/sell-operations.services");

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
    sellOp = new SellOperation(req.body);
    await sellOp.save();

    // 3- update products sells
    await updateProductsSells(products);

    // 4- send response
    return res.status(201).json(sellOp);
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
    const sellOp = await SellOperation.find(filter)
      .populate("articles.product")
      .sort({ date: -1, createdAt: -1 });

    return res.status(200).json(sellOp);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get one Operation by id
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.getOneById = async function (req, res) {
  try {
    // 1- get operation
    const sellOp = await SellOperation.findById(req.params.id).populate(
      "articles.product"
    );
    if (!sellOp) {
      return res.status(404).json({ message: "Opération non trouvé" });
    }

    // 2- return response
    return res.status(200).json(sellOp);
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
    const sellOp = await SellOperation.findById(req.params.id);
    if (!sellOp) {
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
    sellOp.set(req.body);
    await sellOp.save();

    // 4- update products sells
    await updateProductsSells(products);

    // 5- send response
    return res.status(201).json(sellOp);
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
    const sellOp = await SellOperation.findByIdAndDelete(req.params.id);
    if (!sellOp) {
      return res.status(404).json({ message: "Opération non trouvé" });
    }

    // 2- update products sells
    const products = await getOperationProducts(sellOp.articles);
    await updateProductsSells(products);

    // 3- return response
    return res.status(200).json({ message: "Opération supprimé" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
