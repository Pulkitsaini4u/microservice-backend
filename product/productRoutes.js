const express = require('express');
const Product = require('./databaseConnection/models/product');
const app = express();
const { CreateChannel } = require('./productUtil');
var channel;
(async function () {
  channel = await CreateChannel();
})();

// Get all products
app.get('/getAllProducts', async (req, res) => {
  try {
    let products = await getAllProducts(req.query.page, req.query.pageSize);
    res.json(products);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// Add a new product
app.post('/products', async (req, res) => {
  try {
    let savedProduct = await createProduct(req.body);
    res.json(savedProduct);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// Update a product
app.put('/products/:id', async (req, res) => {
  try {
    let updatedProduct = await updateProduct(req.params.id, req.body);
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

app.put('/updateProductStock', async (req, res) => {
  try {
    let updatedProduct = await updateProductStock(req.body);
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// Delete a product
app.delete('/products/:id', async (req, res) => {
  try {
    await deleteProduct(req.params.id);
    res.json({
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

async function getAllProducts(page, pageSize) {
  return new Promise(async function (resolve, reject) {
    try {
      let offset = (page - 1) * pageSize;
      const products = await Product.find().skip(offset).limit(pageSize);
      resolve(products);
    } catch (error) {
      reject(error);
    }
  });
}

async function createProduct(incomingData) {
  return new Promise(async function (resolve, reject) {
    try {
      const newProduct = new Product(incomingData);
      const savedProduct = await newProduct.save();
      resolve(savedProduct);
    } catch (error) {
      reject(error);
    }
  });
}

async function updateProduct(id, incomingData) {
  return new Promise(async function (resolve, reject) {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        incomingData, {
        new: true
      }
      );
      resolve(updatedProduct);
    } catch (error) {
      reject(error);
    }
  });
}

async function updateProductStock({productId, quantity}) {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $inc: { stock: -quantity } },
      { new: true }
    );
    if (!updatedProduct) {
      throw new Error('Product not found');
    }
    return updatedProduct;
  } catch (error) {
    throw error;
  }
}


async function deleteProduct(id) {
  return new Promise(async function (resolve, reject) {
    try {
      await Product.findByIdAndDelete(id);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = app;