var pool = require('../common/DbConnection');
var config = require('../config/config');
var log4js = require('../config/log4j');
var dateFormat = require('dateformat');
var util = require('../common/utility')

const logger = log4js.getLogger('logger');
const errorlogger = log4js.getLogger('errorlogger');

module.exports = {

    saveEmploymentDetails: function (req, callback) {
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
                connection.rollback();
                connection.release();
                callback(response);
                return;
            }
            var errorflag = false;
            connection.beginTransaction();
            for (var i = 0, len = req.body.employment.length; i < len; i++) {
                await new Promise(next => {
                    if (!errorflag) {
                        connection.query(config.onBoard.saveEmploymentDetails, [
                              req.body.employment[i].emeh_id
                            , req.body.emp_id
                            , req.body.employment[i].employerName
                            , req.body.employment[i].designation
                            , req.body.employment[i].responsibility
                            , dateFormat(req.body.employment[i].startdate, "yyyy-mm-dd h:MM:ss")
                            , dateFormat(req.body.employment[i].enddate, "yyyy-mm-dd h:MM:ss")
                            , req.body.employment[i].location
                            , req.body.employment[i].flag
                            , util.getuserId(req.headers.token)
                        ]
                            , function (error, result) {
                                if (error) {
                                    logger.error(error);
                                    connection.rollback();
                                    connection.release();
                                    response.return_code = 1;
                                    response.return_message = "Error Saving Employee employment Details";
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
                                        connction.release();
                                        callback(response);
                                    }
                                    if (i == req.body.employment.length - 1) {
                                            connection.commit();
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

    getEmploymentDetails: function (req, IN_EMP_ID, callback) {
        let response = {
            status: 200,
            return_code: 0,
            return_message: "",
            data: []
        }


        pool.getConnection(function (err, connection) {
            
            if (err) {

                logger.error("An error occurred: " + err);
                connection.release();
                response.return_code = 1;
                response.return_message = "Error Saving Employee employment Details";

                callback(response);

            }
            else {
                logger.error(err);
                connection.query(config.onBoard.getEmploymentDetails, [IN_EMP_ID, util.getuserId(req.headers.token)], function (err, rows) {
                    if (err) {
                        errorlogger.error(err);
                        connection.release();
                        response.return_code = 1;
                        response.return_message = "Error Saving Employee employment Details";
        
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