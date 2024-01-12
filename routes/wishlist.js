/* eslint-disable new-cap */
const express = require('express');
const router = express.Router();

const wishlistDAO = require('./../models/wishlistDAO'); // Adjust the path as needed


router.get('/checkWishlist/:wishId', async (req, res, next) => {
  const params = req.params.wishId;

  wishlistDAO.checkWishlist(params, (resp) => {
    res.json(resp);
  });
});

router.get('/getWishlist', async (req, res, next) => {
  wishlistDAO.getWishlist((resp) => {
    res.json(resp);
  });
});

router.post('/addWishlist', async (req, res, next) => {
  const data = req.body; 

  wishlistDAO.addWishlist(data, (resp) => {
    res.json(resp);
  });
});

router.delete('/deleteWishlist/:wishId', async (req, res, next) => {
  const params = req.params.wishId;

  wishlistDAO.deleteWishlist(params, (resp) => {
    res.json(resp);
  });
});


module.exports = router;