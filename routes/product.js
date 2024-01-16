/* eslint-disable camelcase */
/* eslint-disable new-cap */
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const productDAO = require('./../models/productDAO');

const imageUploadPath = 'http://localhost:8000/images/products/';


const uploadName = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'public', 'images', 'products')),
    filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`),
  }),
  limits: {fileSize: 1024 * 1024 * 3},
});


router.get('/checkProduct/:product_id', async (req, res, next) => {
  const params = req.params.product_id;

  productDAO.checkProduct(params, (resp) => {
    res.json(resp);
  });
});

router.post('/addProduct', uploadName.single('profile'), async (req, res, next) => {
  const data = JSON.parse(req.body.data);
  const imageName = req.file ? `${imageUploadPath}${req.file.filename}` : `${imageUploadPath}noimage.jpg`;
  const imagePath = req.file ? req.file.path : '';

  const insertData = {
    ...data,
    imageName, // req.file.filename,
    imagePath,
  };

  productDAO.addProduct(insertData, (resp) => {
    res.json(resp);
  });
});

router.delete('/deleteProduct/:product_id', async (req, res, next) => {
  const params = req.params.product_id;

  productDAO.deleteProduct(params, (resp) => {
    res.json(resp);
  });
});

router.get('/getProductList', async (req, res, next) => {
  const data = req.query;

  productDAO.getProductList(data, (resp) => {
    res.json(resp);
  });
});

router.put('/updateState', async (req, res, next) => {
  const data = req.body;

  productDAO.updateState(data, (resp) => {
    res.json(resp);
  });
});

router.put('/likeCount', async (req, res, next) => {
  const data = req.body;

  productDAO.likeCount(data, (resp) => {
    res.json(resp);
  });
});

module.exports = router;