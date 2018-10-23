var pool = require('../common/DbConnection');
var config = require('../config/config');
var log4js = require('../config/log4j');
var dateFormat = require('dateformat');
var util = require('../common/utility')

const logger = log4js.getLogger('logger');
const errorlogger = log4js.getLogger('errorlogger');

module.exports = {

    saveAddressDetails: function (req, callback) {
        let response = {
            status: 200,
            return_code: 0,
            return_message: "",
            data: []
        }
        pool.getConnection(async function (err, connection) {
            if (err) {
                errorlogger.error("An error occurred: " + err);
                response.return_code = 1;
                response.return_message = "Error Saving Employee Address Details";
                connection.release();

                callback(response);
                return;
            }
            var errorflag = false;
            connection.beginTransaction();
            for (var i = 0, len = req.body.address.length; i < len; i++) {
                await new Promise(next => {
                    if (!errorflag) {
                        logger.debug("req.body.address[i].streetAddress2: " + req.body.address[i].streetAddress2);
                        logger.debug("req.body.address[i].addr_type: " + req.body.address[i].addr_type);
                        logger.debug("req.body.address[i].city: " + req.body.address[i].city);
                        logger.debug("req.body.address[i].phone: " + req.body.address[i].phone);
                        logger.debug("req.body.address[i].state: " + req.body.address[i].state);
                        logger.debug("req.body.address[i].zip: " + req.body.address[i].zip);
                        logger.debug("req.body.address[i].emp_id: " + req.body.address[i].emp_id);
                        
                        connection.query(config.onBoard.saveaddressDetail, [
                            req.body.address[i].streetAddress1
                            , req.body.address[i].streetAddress2
                            , req.body.address[i].addr_type
                            , req.body.address[i].city
                            , req.body.address[i].phone
                            , req.body.address[i].state
                            , req.body.address[i].country
                            , req.body.address[i].zip
                            , req.body.address[i].emp_id
                            , util.getuserId(req.headers.token)
                        ]
                            , function (error, result) {
                                if (error) {
                                    logger.error(error);
                                    connection.rollback();
                                    connection.release();
                                    response.return_code = 1;
                                    response.return_message = "Error Saving Employee Address Details";
                                    callback(response);
                                } else {

                                    var string = JSON.stringify(result);
                                    var json = JSON.parse(string);
                                    if (!(json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0)) {

                                        response.return_code = json[json.length - 1][0].return_code;
                                        response.return_message = json[json.length - 1][0].return_message;
                                        errorflag = true;
                                        logger.error("Iteration: " + i + ": " + json[json.length - 1][0].return_message);
                                        connection.rollback();
                                        connection.release();
                                        callback(response);
                                    }
                                    if (i == req.body.address.length - 1) {
                                            connection.commit()
                                            connection.release();
                                            callback(response);

                                    }
                                    else {
                                        next();
                                    }
                                }

                            });
                    }
                });
            }

        });
    },
    getAddressDetails: function (req, IN_EMP_ID, callback) {
        let response = {
            status: 200,
            return_code: 0,
            return_message: "",
            data: []
        }


        pool.getConnection(function (err, connection) {
            
            if (err) {

                logger.error("An error occurred: " + err);
                response.return_code = 1;
                response.return_message = "Error Saving Employee Address Details";
                connection.release();
                callback(response);

            }
            else {
                logger.error(err);
                connection.query(config.onBoard.getAddressDetails, [IN_EMP_ID, util.getuserId(req.headers.token)], function (err, rows) {
                    if (err) {
                        errorlogger.error(err);
                        response.return_code = 1;
                        response.return_message = "Error Saving Employee Address Details";
                        connection.release();
                        callback(response);
                    } else {
                        logger.debug(rows);
                        response.data = rows[0];
                        connection.release();
                        callback(response);
                    }
                    
                });
            }
        });
    },


};