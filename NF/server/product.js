var express = require('express');
var router = express.Router();
var pool = require('./common/DbConnection');
var config = require('./config/config');
var log4js = require('./config/log4j');
var metadata = require('./product/metadata.js');
var auth = require('./auth/auth.js');

const logger = log4js.getLogger('logger');

let response = {
  status: 200,
  message: null,
  data: []
}
var sendError = (err, res) => {
  response.status = 501;
  respnse.message = typeof err == "object" ? err.message : err;
  res.status(501).json(respnse);
}
router.get('/api/getMetaDataList', (req, res) => {
  try {
    metadata.getMetaDataList(function (result) {
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }
});
router.post('/api/deletaMetaData', (req, res) => {
  try {
    metadata.deleteMetaData(req, res, function (result) {
      res.status(result.status);
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }
});
router.post('/api/saveMetaDataDetails', (req, res) => {
  try {
    metadata.saveMetaDataDetails(req, function (result) {
      res.json(result);
    });
  }
  catch (error) {
    console.log('error meta');
    throw error;
  }
});
module.exports = router;