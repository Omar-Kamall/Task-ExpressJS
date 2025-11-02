const Product = require("../models/Product");

exports.getProducts = async (req, res) => {
  try {
    const data = await Product.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

exports.getProduct = async (req, res) => {
    try {
    const data = await Product.findById(req.params.id);
    if (!data) return res.status(404).json({message: "Product Nt Found"})
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
}

exports.postProducts = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const data = await newProduct.save();
    res.status(200).json({
      message: "Add Product Succsessfuly ...!",
      data: data,
    });
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const newDataProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!newDataProduct) {
      return res.status(404).json("Product Not Found");
    }
    res.status(200).json({
      message: "Product added successfully!",
      data: newDataProduct,
    });
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const findProduct = await Product.findByIdAndDelete(req.params.id);
    if (!findProduct) {
      return res.status(404).json("Product Not Found");
    }
    res.status(200).json("Delete Product Succsessfuly ...!");
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};
