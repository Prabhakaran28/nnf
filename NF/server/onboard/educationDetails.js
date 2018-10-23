var pool = require('../common/DbConnection');
var config = require('../config/config');
var log4js = require('../config/log4j');
var dateFormat = require('dateformat');

const logger = log4js.getLogger('logger');
const errorlogger = log4js.getLogger('errorlogger');
var util = require('../common/utility')
module.exports = {

    saveEducationDetails: function (req, callback) {
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
            for (var i = 0, len = req.body.education.length; i < len; i++) {
                await new Promise(next => {
                    if (!errorflag) {
                        connection.query(config.onBoard.saveEducationDetails, [
                              req.body.education[i].emed_id
                            , req.body.emp_id
                            , req.body.education[i].degree
                            , req.body.education[i].specialization
                            , req.body.education[i].percentage
                            , req.body.education[i].institutionName
                            , req.body.education[i].locationName
                            , req.body.education[i].month
                            , req.body.education[i].flag
                            , util.getuserId(req.headers.token)]
                            , function (error, result) {
                                if (error) {
                                    logger.error(error);
                                    connection.rollback();
                                    connection.release();
                                    response.return_code = 1;
                                    response.return_message = "Error Saving Employee Education Details";
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
                                    if (i == req.body.education.length - 1) {
                                            connection.commit();
                                            conenction.release();
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
    getEducationDetails: function (req, IN_EMP_ID, callback) {
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
                response.return_message = "Error Saving Employee Education Details";
                connection.release();
                callback(response);

            }
            else {
                logger.error(err);
                connection.query(config.onBoard.getEducationDetails, [IN_EMP_ID, util.getuserId(req.headers.token)], function (err, rows) {
                    if (err) {
                        errorlogger.error(err);
                        response.return_code = 1;
                        response.return_message = "Error Saving Employee Education Details";
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