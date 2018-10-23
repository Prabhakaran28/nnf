var pool = require('../common/DbConnection');
var config = require('../config/config');
var log4js = require('../config/log4j');
var dateFormat = require('dateformat');
var util = require('../common/utility')
const logger = log4js.getLogger('logger');
const errorlogger = log4js.getLogger('errorlogger');

module.exports = {
    getBacklinkReportData: function (req, callback) {
        let response = {
            status: 200,
            return_code: 0,
            return_message: "",
            data: []
        }


        pool.getConnection(function (err, connection) {

            if (err) {

                logger.error("An error occurred: " + err);
                response.return_message = "Error getting DB connection"
                response.return_code = 1
                callback(response);
                return;
            }
            else {
                connection.query(config.seo.getBacklinkReportData,
                    [req.body.reportType,
                    dateFormat(req.body.fromDate, "yyyy-mm-dd h:MM:ss"),
                    dateFormat(req.body.toDate, "yyyy-mm-dd h:MM:ss"),
                    //new Date(req.body.fromDate),
                    //new Date(req.body.toDate),
                    req.body.site,
                    req.body.category,
                    req.body.resource,
                    req.body.source,
                    req.body.visiblesource,
                    req.body.daterange,
                    util.getuserId(req.headers.token)], function (err, rows) {
                        if (err) {
                            errorlogger.error(err);
                            response.return_message = "Error getting Report data for " + req.body.reportType;
                            response.return_code = 1;
                            connection.release();
                            callback(response);
                            return;
                        } else {
                            logger.debug(rows);
                            response.data = rows[0];
                            connection.release();
                            callback(response);
                            return;
                        }

                    });
            }
        });
    },
    getIcvReportData: function (req, callback) {
        let response = {
            status: 200,
            return_code: 0,
            return_message: "",
            data: []
        }


        pool.getConnection(function (err, connection) {

            if (err) {

                logger.error("An error occurred: " + err);
                response.return_message = "Error getting DB connection"
                response.return_code = 1
                callback(response);
                return;

            }
            else {
                connection.query(config.seo.getIcvReportData,
                    [req.body.reportType,
                    dateFormat(req.body.fromDate, "yyyy-mm-dd h:MM:ss"),
                    dateFormat(req.body.toDate, "yyyy-mm-dd h:MM:ss"),
                    req.body.resource,
                    req.body.status,
                    req.body.website,
                    req.body.rejectReason,
                    util.getuserId(req.headers.token)], function (err, rows) {
                        if (err) {
                            errorlogger.error(err);
                            response.return_message = "Error getting Report data for " + req.body.reportType;
                            response.return_code = 1;
                            connection.release();
                            callback(response);
                            return;
                        } else {
                            logger.debug(rows);
                            response.data = rows[0];
                            connection.release();
                            callback(response);
                            return;
                        }

                    });
            }
        });
    },
    getDisavowReportData: function (req, callback) {
        let response = {
            status: 200,
            return_code: 0,
            return_message: "",
            data: []
        }


        pool.getConnection(function (err, connection) {

            if (err) {

                logger.error("An error occurred: " + err);
                response.return_message = "Error getting DB connection"
                response.return_code = 1
                callback(response);
                return;

            }
            else {
                connection.query(config.seo.getDisavowReportData,
                    [req.body.reportType,
                    req.body.website,
                    req.body.source,
                    util.getuserId(req.headers.token)], function (err, rows) {
                        if (err) {
                            errorlogger.error(err);
                            response.return_message = "Error getting Report data for " + req.body.reportType;
                            response.return_code = 1;
                            connection.release();
                            callback(response);
                            return;
                        } else {
                            logger.debug(rows);
                            response.data = rows[0];
                            connection.release();
                            callback(response);
                            return;
                        }

                    });
            }
        });
    },
    getCompareReportData: function (req, callback) {
        let response = {
            status: 200,
            return_code: 0,
            return_message: "",
            data: []
        }


        pool.getConnection(function (err, connection) {

            if (err) {

                logger.error("An error occurred: " + err);
                response.return_message = "Error getting DB connection"
                response.return_code = 1
                callback(response);
                return;

            }
            else {
                connection.query(config.seo.getCompareReportData,
                    [req.body.reportType,
                    req.body.src_website,
                    req.body.src_source,
                    req.body.tgt_website,
                    req.body.tgt_source,
                    util.getuserId(req.headers.token)], function (err, rows) {
                        if (err) {
                            errorlogger.error(err);
                            response.return_message = "Error getting Report data for " + req.body.reportType;
                            response.return_code = 1;
                            connection.release();
                            callback(response);
                            return;
                        } else {
                            logger.debug(rows);
                            response.data = rows[0];
                            connection.release();
                            callback(response);
                            return;
                        }

                    });
            }
        });
    },

}