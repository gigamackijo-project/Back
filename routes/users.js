/* eslint-disable camelcase */
/* eslint-disable new-cap */
const express = require('express');
const router = express.Router();

const userDAO = require('./../models/userDAO');

router.post('/checkId', (req, res, next) => {
  const body = req.body;
  userDAO.checkId(body, (resp) => {
    res.json(resp);
  })
});

router.get('/userId/:user_id', (req, res, next) => {
  const params = req.params;

  userDAO.userId(params, (resp) => {
    res.json(resp);
  });
});
router.post('/signup', async (req, res, next) => {
  const data = req.body;

  userDAO.signup(data, (resp) => {
    res.json(resp)
  });
});

router.post('/login', (req, res, next) => {
  const body = req.body;
  // console.log(body);
  userDAO.login(body, (resp) => {
    res.json(resp);
  })
});

router.put('/update', (req, res, next) => {
  const body = req.body;

  userDAO.update(body, (resp) => {
    res.json(resp);
  });
});

router.delete('/delete/:email', (req, res, next) => {
  const params = req.params;
  userDAO.delete(params, (resp) => {
    res.json(resp);
  });
});

router.put('/updatePoint', (req, res, next) => {
  const data = req.body;

  userDAO.updatePoint(data, (resp) => {
    res.json(resp);
  });
});

module.exports = router;
