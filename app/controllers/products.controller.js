const Product = require("../models/product.model");
/**
 * Controller : Create Product
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.create = async function (req, res) {
  try {
    // 01- validate body
    console.log(req.body);
    if (!req.body.title) {
      res.status(400).send({ message: "Le titre ne doit pas être vide." });
    }

    // 2- create product
    product = new Product(req.body);
    await product.save();

    // 3- send response
    return res.status(201).json(product);
  } catch (error) {
    return res.status(500).json({error: error.message})
  }
};

/**
 * Controller: List Products
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.list = async function (req, res) {
  try {
    // 1- build filter
    let filter = {};
    if( req.query.search){
        filter.title = { $regex: new RegExp( req.query.search, 'i') };
    }

    // 2- get products
    const products = await Product.find(filter);

    // 3- send response
    return res.status(200).json(products);
  } catch (error) {
    res.status(500).json({error: error.message})
  }
};

/**
 * Controller: Get one Product by id
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.getOneById = async function (req, res) {
  try {
    // 1- get product
    const product = await Product.findById(req.params.id);
    if(!product){
      return res.status(404).json({message: 'Produit non trouvé'})
    }

    // 2- send response
    return res.status(200).json(product);

  } catch (error) {
    res.status(500).json({error: error.message})
  }
};

/**
 * Controller: update one product
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.update = async function (req, res) {
  try {
    // 1- find product by id
    console.log(req.params)
    const product = await Product.findById(req.params.id);
    if(!product){
      return res.status(404).json({message: 'Produit non trouvé'})
    }
    // 2- update product
    product.set(req.body);
    await product.save();

    // 3- return product
    return res.status(200).json(product);

  } catch (error) {
    res.status(500).json({error: error.message})
  }
};

/**
 * Controller: Delete one product
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.delete = async function (req, res) {
  try {
    // 1- find and delete product by id
    const product = await Product.findByIdAndDelete(req.params.id);
    if(!product){
      return res.status(404).json({message: 'Produit non trouvé'})
    }
    
    // 3- return response
    return res.status(200).json({message: "Produit supprimé"});

  } catch (error) {
    res.status(500).json({error: error.message})
  }
};
