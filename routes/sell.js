/* eslint-disable camelcase */
/* eslint-disable new-cap */
const express = require('express');
const router = express.Router();

const sellDAO = require('./../models/sellDAO');

router.post('/createSellList', (req, res, next) => {
  const data = req.body

  sellDAO.createSellList(data, (resp) => {
    res.json(resp);
  });
});

router.get('/getSellList', (req, res, next) => {
  const data = req.body

  sellDAO.getSellList(data.user_id, (resp) => {
    res.json(resp);
  });
});

router.get('/getBuyList', (req, res, next) => {
  const data = req.body

  sellDAO.getBuyList(data.user_id, (resp) => {
    res.json(resp);
  });
});

router.delete('/deleteSell/:sell_id', async (req, res, next) => {
  const params = req.params.sell_id;

  sellDAO.deleteSell(params, (resp) => {
    res.json(resp);
  });
});


module.exports = router;
