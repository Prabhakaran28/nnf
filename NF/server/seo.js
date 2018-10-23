var express = require('express');
var router = express.Router();
var child = require('child_process');

var config = require('./config/config');
var log4js = require('./config/log4j');
var backlink = require('./seo/backlink.js');
var icv = require('./seo/icv.js');
var website = require('./seo/website.js');
var reports = require('./seo/reports.js');
var disavow = require('./seo/disavow.js');
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

router.get('/api/getWebsites', (req, res) => {
  try {
    backlink.getWebsites(req, function (result) {
      res.status(result.status);
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }

});
router.get('/api/getBacklinkFile', (req, res) => {
  try {
    backlink.getBacklinkFile(req, function (result) {
      res.status(result.status);
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }

});
router.get('/api/getICVCount', (req, res) => {
  try {
    icv.getICVCount(req, function (result) {
      res.status(result.status);
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }

});

router.post('/api/uploadBacklinks', (req, res) => {
  try {
    backlink.uploadBacklinks(req, res, function (result) {
      res.status(result.status);
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }


});
router.post('/api/getBacklinkReportData', (req, res) => {
  try {
    reports.getBacklinkReportData(req, function (result) {
      res.status(result.status);
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }


});
router.post('/api/getIcvReportData', (req, res) => {
  try {
    reports.getIcvReportData(req, function (result) {
      res.status(result.status);
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }


});
router.post('/api/getDisavowReportData', (req, res) => {
  try {
    reports.getDisavowReportData(req, function (result) {
      res.status(result.status);
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }


});
router.post('/api/getCompareReportData', (req, res) => {
  try {
    reports.getCompareReportData(req, function (result) {
      res.status(result.status);
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }


});

router.post('/api/searchBacklink', (req, res) => {
  try {
    backlink.searchBacklink(req, function (result) {
      res.status(result.status);
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }
});
router.post('/api/searchCreatedBacklink', (req, res) => {
  try {
    backlink.searchCreatedBacklink(req, function (result) {
      res.status(result.status);
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }
});
router.post('/api/searchVisibleBacklink', (req, res) => {
  try {
    backlink.searchVisibleBacklink(req, function (result) {
      res.status(result.status);
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }
});
router.post('/api/searchBacklinkBatch', (req, res) => {
  try {
    backlink.searchBacklinkBatch(req, function (result) {
      res.status(result.status);
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }
});
router.post('/api/getMetadataFromTable', (req, res) => {
  try {
    backlink.getMetadataFromTable(req, function (result) {
      res.status(result.status);
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }
});

router.post('/api/searchICV', (req, res) => {
  try {
    icv.searchICV(req, function (result) {
      res.status(result.status);
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }
});
router.post('/api/searchDisavow', (req, res) => {
  try {
    disavow.searchDisavow(req, function (result) {
      res.status(result.status);
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }
});
router.post('/api/deleteBacklinkFile', (req, res) => {
  try {
    backlink.deleteBacklinkFile(req, function (result) {
      res.status(result.status);
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }
});
router.get('/api/processFiles', (req, res) => {
  try {
    backlink.processFiles(req, function (result) {
      res.status(result.status);
      res.json(result);
      var childTask = child.fork('server/seo/processBacklinkFiles.js');
      childTask.send(result.data.blbs_id);

    });
  }
  catch (error) {
    throw error;
  }


});
router.post('/api/saveIcvDetails', (req, res) => {
  try {
    icv.saveIcvDetails(req, function (result) {
      res.status(result.status);
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }
});
router.get('/api/getICVMetaData', (req, res) => {
  try {
    icv.getICVMetaData(req, function (result) {
      res.status(result.status);
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }
});

router.get('/api/getIcvDetails', (req, res) => {
  try {
    icv.getIcvDetails(req, function (result) {
      res.status(result.status);
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }

});
router.post('/api/searchWebsite', (req, res) => {
  try {
    website.searchWebsite(req, function (result) {
      res.status(result.status);
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }
});
router.get('/api/getWebsiteDetails', (req, res) => {
  try {
    website.getWebsiteDetails(req, function (result) {
      res.status(result.status);
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }

});
router.post('/api/saveWebsiteDetails', (req, res) => {
  try {
    website.saveWebsiteDetails(req, function (result) {
      res.status(result.status);
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }
});
module.exports = router;