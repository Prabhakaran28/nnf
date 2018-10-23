var pool = require('../common/DbConnection');
var config = require('../config/config');
var log4js = require('../config/log4j');
var dateFormat = require('dateformat');
var users = require('../security/users.js');
const logger = log4js.getLogger('personaldetails');
const errorlogger = log4js.getLogger('errorlogger');
var util = require('../common/utility');
var generator = require('generate-password');

module.exports = {

    savePersonalDetails: function (req, callback) {
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
                response.return_message = "Error Saving Employee Personal Details";
                connection.rollback();
                connection.release();
                callback(response);
                return;
            }
            logger.debug(req.body.emp_id);
            logger.debug(req.body.firstName);
            logger.debug(req.body.middlename);
            logger.debug(req.body.lastName);
            logger.debug(dateFormat(req.body.dob, "yyyy-mm-dd h:MM:ss"));
            logger.debug(dateFormat(req.body.doj, "yyyy-mm-dd h:MM:ss"));
            logger.debug(req.body.designation);
            logger.debug(req.body.manager_id);
            logger.debug(req.body.role);
            logger.debug(req.body.salary);
            logger.debug(req.body.shift);
            
            var password;
            connection.query(config.onBoard.savepersonalDetail, [
                req.body.emp_id,
                req.body.firstname,
                req.body.middlename,
                req.body.lastname,
                dateFormat(req.body.dob, "yyyy-mm-dd h:MM:ss"),
                dateFormat(req.body.doj, "yyyy-mm-dd h:MM:ss"),
                req.body.designation,
                req.body.manager_id,
                req.body.role,
                req.body.salary,
                req.body.shift,
                req.body.email,
                req.body.sequenceType,
                req.body.autoCreateUser,
                req.body.securityRole,
                req.body.mode,
                util.encrypt(password = generator.generate({
                    length: 10,
                    numbers: true,
                    uppercase: true,
                    strict: true
                })),
                util.getuserId(req.headers.token)], function (err, result) {
                    if (err) {
                        errorlogger.error(err);
                        response.return_code = 1;
                        response.return_message = "Error Occcured while persisting data in DB";
                        connection.rollback();
                        connection.release();
                        callback(response);
                    } else {
                        
                        
                        var string = JSON.stringify(result);
                        var json = JSON.parse(string);
                        
                        if (json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0) {

                            response.return_code = 0;
                            response.data = [{ EMP_ID: json[0][0].EMP_ID, USER_ID: json[0][0].USER_ID }];
                            response.return_message = json[json.length - 1][0].return_message;
                            connection.commit();
                            connection.release();
                            if (json[0][0].USERCREATED =='Y') {
                                var variables = [req.body.firstname + " " + req.body.lastname, json[0][0].USER_ID, password];
                                util.sendEmail("USERCREATION", req.body.email, variables);
                                callback(response);
                            }
                            else {
                                callback(response);

                            }

                        }
                        else {
                            response.return_code = json[json.length - 1][0].return_code;
                            response.return_message = json[json.length - 1][0].return_message;
                            errorlogger.error(json[json.length - 1][0].return_message);
                            connection.rollback();
                            connection.release();
                            callback(response);
                        }
                    }
                });

        });
    },
    getPersonalDetails: function (req, IN_EMP_ID, callback) {
        let response = {
            status: 200,
            return_code: 0,
            return_message: "",
            data: []
        }


        pool.getConnection(function (err, connection) {

            if (err) {

                logger.error("An error occurred: " + err);
                //throw err;
                response.status = 501;
                callback(response);

            }
            else {
                logger.error(err);
                connection.query(config.onBoard.getPersonalDetails, [IN_EMP_ID, util.getuserId(req.headers.token)], function (err, rows) {
                    if (err) {
                        errorlogger.error(err);
                        response.status = 501;
                        callback(response);
                    } else {
                        logger.debug(rows);
                        response.data = rows[0];
                        callback(response);
                    }
                    connection.release();
                });
            }
        });
    },
};