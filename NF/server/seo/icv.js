var pool = require('../common/DbConnection');
var config = require('../config/config');
var log4js = require('../config/log4j');
var dateFormat = require('dateformat');
var util = require('../common/utility')
const logger = log4js.getLogger('logger');
const errorlogger = log4js.getLogger('errorlogger');

module.exports = {
    searchICV: function (req, callback) {
        let response = {
            status: 200,
            return_code: 0,
            return_message: "",
            data: []
        }
        pool.getConnection(function (err, connection) {

            if (err) {
                errorlogger.error("An error occurred: " + err);
                throw err;
            }

            connection.query(config.seo.searchICV,
                [
                    (req.body.dateIdenfiiedFrom == null) ? null : dateFormat(req.body.dateIdenfiiedFrom, "yyyy-mm-dd h:MM:ss"),
                    (req.body.dateIdenfiiedTo == null) ? null : dateFormat(req.body.dateIdenfiiedTo, "yyyy-mm-dd h:MM:ss"),
                    req.body.backlinkSite,
                    req.body.category,
                    req.body.process,
                    req.body.domainAuthorityFrom,
                    req.body.domainAuthorityTo,
                    req.body.source,
                    req.body.sourceURL,
                    req.body.followFlag,
                    req.body.addedBy,
                    req.body.rejectionReason,
                    req.body.status,
                    req.body.modifiedby,
                    util.getuserId(req.headers.token),
                ], function (err, rows) {
                    if (err) {
                        errorlogger.error(err);
                        connection.release();
                        response.return_code = 1;
                        response.return_message = "Error Retrieving Backlink Batch Details"
                        callback(response);
                        return;
                        //throw err;
                    } else {
                        var string = JSON.stringify(rows);
                        var json = JSON.parse(string);
                        //logger.debug(json);
                        if (json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0) {
                            logger.debug(rows[0]);
                            response.data = rows[0];
                            connection.release();
                            callback(response);
                        }
                        else {
                            logger.debug(json[json.length - 1][0].return_message);
                            logger.debug(json[json.length - 1][0].return_code);
                            response.return_code = json[json.length - 1][0].return_code;
                            response.return_message = json[json.length - 1][0].return_message;
                            connection.release();
                            callback(response);
                            return;
                        }

                    }

                });

        });
    },
    saveIcvDetails: function (req, callback) {
        let response = {
            status: 200,
            return_code: 0,
            return_message: "",
            data: []
        }
        pool.getConnection(function (err, connection) {

            if (err) {
                errorlogger.error("An error occurred: " + err);
                response.return_code = 1;
                response.return_message = "Error gettign DB Conneciton";
                callback(response);
                return;
            }
            connection.beginTransaction();
            connection.query(config.seo.saveIcvDetails, [
                req.body.blic_id,
                dateFormat(req.body.dateIdenfiied, "yyyy-mm-dd h:MM:ss"),
                req.body.backlinkSite,
                req.body.category,
                req.body.process,
                req.body.domainAuthority,
                req.body.source,
                req.body.sourceURL,
                req.body.followFlag,
                req.body.remarks,
                req.body.status,
                req.body.rejectionReason,
                req.body.mode,
                util.getuserId(req.headers.token)], function (err, result) {
                    if (err) {
                        errorlogger.error(err);
                        response.return_code = 1;
                        response.return_message = "Error Occcured while saving ICV details";
                        try {
                            connection.rollback();
                            connection.release();
                            callback(response);
                            return;
                        }
                        catch (ex) {
                            errorlogger.log(ex)
                            callback(response);
                            return;
                        }

                    } else {
                        var string = JSON.stringify(result);
                        var json = JSON.parse(string);

                        if (json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0) {
                            response.return_code = 0;
                            response.data = [{ BLIC_ID: json[0][0].BLIC_ID }];
                            response.return_message = json[json.length - 1][0].return_message;
                            connection.commit();
                            connection.release();
                            callback(response);
                            return;
                        }
                        else {
                            response.return_code = json[json.length - 1][0].return_code;
                            response.return_message = json[json.length - 1][0].return_message;
                            errorlogger.error(json[json.length - 1][0].return_message);
                            try {
                                connection.rollback();
                                connection.release();
                                callback(response);
                                return;
                            }
                            catch (ex) {
                                errorlogger.log(ex)
                                callback(response);
                                return;
                            }
                        }
                    }
                });

        });
    },
    getICVCount: function (req, callback) {
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
                connection.query(config.seo.getICVCount,
                    [util.getuserId(req.headers.token)], function (err, rows) {
                        if (err) {
                            errorlogger.error(err);
                            response.return_message = "Error getting ICV details"
                            response.return_code = 1
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
    getIcvDetails: function (req, callback) {
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
                connection.query(config.seo.getIcvDetails,
                    [req.query.blic_id,
                    util.getuserId(req.headers.token)], function (err, rows) {
                        if (err) {
                            errorlogger.error(err);
                            response.return_message = "Error getting ICV details"
                            response.return_code = 1
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
    getICVMetaData: function (req, callback) {
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
                connection.query(config.seo.getICVMetaData,
                    [req.query.metadata,
                    util.getuserId(req.headers.token)], function (err, rows) {
                        if (err) {
                            errorlogger.error(err);
                            response.return_message = "Error getting ICV MetaData "
                            response.return_code = 1
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