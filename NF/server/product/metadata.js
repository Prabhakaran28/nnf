var pool = require('../common/DbConnection');
var config = require('../config/config');
var log4js = require('../config/log4j');

const logger = log4js.getLogger('logger');
const errorlogger = log4js.getLogger('errorlogger');

module.exports = {
    getMetaDataList: function (callback) {
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
                response.return_message = "Error in Meta Data Details";
                connection.rollback();
                connection.release();
                callback(response);
                return;
            }
            connection.query(config.product.metaDataSQL, function (err, rows) {
                if (err) {
                    errorlogger.error(err);
                    response.return_code = 1;
                    response.return_message = "Error in Meta Data Details";
                    connection.release();
                    callback(response);
                } else {
                    logger.debug(rows);
                    connection.release();
                    callback((rows[0]));
                }
            });

        });
    },
    deleteMetaData: function (req, callback) {
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
                response.return_message = "Error while Deleting Metadata Details";
                connection.release();

                callback(response);
                return;
            }
            connection.query(config.product.deleteMetaData, [req.body.SEMD_ID], function (err, rows) {
                if (err) {
                    errorlogger.error(err);
                    response.return_code = 1;
                    response.return_message = "Error while Deleting Metadata Details";
                    connection.release();
                    callback(response);
                } else {
                    logger.debug(rows);
                    connection.release();
                    callback((rows[0]));
                }
            });

        });
    },
    saveMetaDataDetails: function (req, callback) {
        let response = {
            status: 200,
            return_code: 0,
            return_message: "",
            data: []
        }
        pool.getConnection(function (err, connection) {
            connection.beginTransaction();
            if (err) {
                errorlogger.error("An error occurred: " + err);
                response.return_code = 1;
                response.return_message = "Error Saving Meta Data Details";
                connection.rollback();
                connection.release();
                callback(response);
                return;
            }
            logger.debug(req.body.module);
            connection.query(config.product.saveMetaDataDetails, [req.body.module, req.body.subModule, req.body.type, req.body.subType, req.body.code, req.body.value, req.body.default, req.body.active, req.body.createdBy], function (err, rows) {
                if (err) {
                    errorlogger.error(err);
                    response.return_code = 1;
                    response.return_message = "Error Occcured while persisting data in DB";
                    connection.rollback();
                    connection.release();
                    callback(response);
                } else {
                    logger.debug(rows);
                    connection.commit();
                    connection.release();
                    callback(response);
                }
            });

        });
    }
};