var pool = require('../common/DbConnection');
var config = require('../config/config');
var log4js = require('../config/log4j');
var generator = require('generate-password');
const logger = log4js.getLogger('users');
const errorlogger = log4js.getLogger('errorlogger');
var util = require('../common/utility');

module.exports = {
    getUsers: function (req,callback) {
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
            connection.query(config.usersSQL.GetUsersList, [ util.getuserId(req.headers.token)], function (err, rows) {
                if (err) {
                    errorlogger.error(err);
                    connection.release();
                    response.return_code = 1;
                    response.return_message = "Error Retrieving Roles"
                    callback(response);
                    return;
                    //throw err;
                } else {
                    var string = JSON.stringify(rows);
                    var json = JSON.parse(string);
                    logger.debug(json);
                    if (json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0) {
                        logger.debug(rows[0]);
                        response.data = rows[0];
                        connection.release();
                        callback(response);
                        return;
                    }
                    else {
                        logger.debug(json[json.length - 1][0].return_message);
                        logger.debug(json[json.length - 1][0].return_code);
                        response.return_code = json[json.length - 1][0].return_code;
                        response.return_message = json[json.length - 1][0].return_message;
                        connection.rollback();
                        connection.release();
                        callback(response);
                        return;
                    }

                }

            });

        });
    },
    searchUsers: function (req, callback) {
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
            connection.query(config.usersSQL.SearchUsersList,
                [req.body.user.SEUS_IS_ACTIVE,
                req.body.user.SEUS_IS_LOCKED,
                req.body.user.SEUS_USER_ID,
                req.body.user.SEUS_USER_NAME,
                req.body.user.SEUS_EMAIL,
                util.getuserId(req.headers.token),
                ], function (err, rows) {
                    if (err) {
                        errorlogger.error(err);
                        connection.release();
                        response.return_code = 1;
                        response.return_message = "Error Retrieving Roles"
                        callback(response);
                        return;
                        //throw err;
                    } else {
                        var string = JSON.stringify(rows);
                        var json = JSON.parse(string);
                        logger.debug(json);
                        if (json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0) {
                            logger.debug(rows[0]);
                            response.data = rows[0];
                            connection.release();
                            callback(response);
                            return;
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
    deleteUser: function (req, callback) {
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
            connection.beginTransaction();
            connection.query(config.usersSQL.DeleteUser,
                [req.body.user.SEUS_ID,
                req.body.user.USER_ID, util.getuserId(req.headers.token) ,
                ], function (err, rows) {
                    if (err) {
                        errorlogger.error(err);
                        connection.rollback();
                        connection.release();
                        response.return_code = 1;
                        response.return_message = "Error deleting User"
                        callback(response);
                        return;
                        //throw err;
                    } else {
                        var string = JSON.stringify(rows);
                        var json = JSON.parse(string);
                        logger.debug(json);
                        if (json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0) {
                            logger.debug(rows[0]);
                            response.return_message = json[json.length - 1][0].return_message;
                            response.data = rows[0];
                            connection.commit();
                            connection.release();
                            callback(response);
                            return;
                        }
                        else {
                            logger.debug(json[json.length - 1][0].return_message);
                            logger.debug(json[json.length - 1][0].return_code);
                            response.return_code = json[json.length - 1][0].return_code;
                            response.return_message = json[json.length - 1][0].return_message;
                            connection.rollback();
                            connection.release();
                            callback(response);
                            return;
                        }

                    }

                });

        });

    },
    getUserRoles: function (req, IN_SEUS_ID, callback) {
        let response = {
            status: 200,
            return_code: 0,
            return_message: "",
            data: []
        }
        logger.debug("inside getUserRoles");
        pool.getConnection(function (err, connection) {

            if (err) {
                errorlogger.error("An error occurred: " + err);
                response.code = 1;
                response_message = "Error Getting User Roles";
                connection.release();
            }
            logger.error(config.usersSQL.GetUserRoles);
            connection.query(config.usersSQL.GetUserRoles, IN_SEUS_ID, function (err, rows) {
                if (err) {
                    errorlogger.error(err);
                    response.code = 1;
                    response_message = "Error Getting User Roles";
                    connection.release();
                    callback(response);
                    return;
                } else {
                    logger.debug(rows);
                    response.data = rows[0];
                    connection.release();
                    callback((response));
                    return;
                }

            });

        });
    },
    getUser: function (req, IN_SEUS_ID, callback) {
        let response = {
            status: 200,
            return_code: 0,
            return_message: "",
            data: []
        }

        pool.getConnection(function (err, connection) {

            if (err) {
                errorlogger.error("An error occurred: " + err);
                response.code = 1;
                response_message = "Error Getting User";
                connection.release();
                callback(response);
                return;
            }
            connection.query(config.usersSQL.GetUser, IN_SEUS_ID, function (err, rows) {
                if (err) {
                    errorlogger.error(err);
                    response.code = 1;
                    response_message = "Error Getting User Roles";
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

        });
    },
    saveUser: function (req, callback) {
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
                response.return_message = "Error Saving User";
                connection.release();
                callback(response);
                return;
            }

            connection.beginTransaction();
            var IN_SEUS_ID = req.body.user.SEUS_ID;

            logger.info("IN_SEUS_ID from request: " + IN_SEUS_ID);

            var IN_USER_NAME = null;
            if (IN_SEUS_ID == "") {
                IN_SEUS_ID = null;
            }
            var mode;
            if (IN_SEUS_ID == "" || IN_SEUS_ID == null) {
                mode = " created ";
            }
            else {
                mode = " saved ";
            }
            var IN_SEUS_USER_ID = req.body.user.SEUS_USER_ID;
            var IN_SEUS_USER_NAME = req.body.user.SEUS_USER_NAME;
            var IN_SEUS_EMAIL = req.body.user.SEUS_EMAIL;
            var IN_SEUS_IS_ACTIVE = req.body.user.SEUS_IS_ACTIVE;
            var IN_SEUS_IS_LOCKED = req.body.user.SEUS_IS_LOCKED;
            var password;
            connection.query(config.usersSQL.SaveUser, [
                IN_SEUS_ID
                , IN_SEUS_IS_ACTIVE
                , IN_SEUS_IS_LOCKED
                , IN_SEUS_USER_ID
                , IN_SEUS_USER_NAME
                , IN_SEUS_EMAIL
                //, ((IN_SEUS_ID == null) ? util.encrypt("123123123") : null)
                , (IN_SEUS_ID == null) ? util.encrypt(password = generator.generate({
                    length: 10,
                    numbers: true,
                    uppercase: true,
                    strict: true
                })) : null,
                , util.getuserId(req.headers.token)
            ]
                , function (error, result) {
                    if (error) {
                        errorlogger.error(error, null);
                        connection.rollback();
                        connection.release();
                        response.return_code = 1;
                        response.return_message = "Error Saving User";
                        callback(response);
                        return;
                    } else {

                        var string = JSON.stringify(result);
                        var json = JSON.parse(string);
                        if (json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0) {
                            logger.debug("SEUS_ID: " + json[0][0].SEUS_ID);

                            module.exports.saveUsers(req,connection, json[0][0].SEUS_ID, req.body.role, null, function (result) {
                                logger.debug(result);
                                if (result.return_code == 0) {
                                    connection.commit();
                                    connection.release();
                                    result.return_code = 0;
                                    result.return_message = "User " + IN_SEUS_USER_NAME + mode + " successfully";
                                    var variables = [IN_SEUS_USER_NAME, IN_SEUS_USER_ID, password];
                                    if (mode == " created ") {
                                        util.sendEmail("USERCREATION", IN_SEUS_EMAIL, variables);
                                        callback(result);
                                        return;
                                    }
                                    else {
                                        callback(result);
                                        return;

                                    }
                                }
                                else {
                                    connection.rollback;
                                    connection.release();
                                    callback(result);
                                    return;
                                }
                            });

                        }
                        else {
                            logger.debug(json[json.length - 1][0].return_message);
                            logger.debug(json[json.length - 1][0].return_code);
                            response.return_code = json[json.length - 1][0].return_code;
                            response.return_message = json[json.length - 1][0].return_message;
                            connection.rollback();
                            connection.release();
                            callback(response);
                            return;
                        }

                    }

                });

        });
    },

    resetPassword: function (req, callback) {
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
                response.return_message = "Error getting DB connection";
                connection.release();
                callback(response);
                return;
            }

            connection.beginTransaction();
            var IN_SEUS_ID = req.body.SEUS_ID;

            logger.info("IN_SEUS_ID from request: " + IN_SEUS_ID);


            var IN_SEUS_PASSWORD = req.body.SEUS_PASSWORD;
            var IN_SEUS_ID = req.body.SEUS_ID;
            connection.query(config.usersSQL.resetPassword, [
                IN_SEUS_ID
                , null
                , util.encrypt(IN_SEUS_PASSWORD)
                , util.getuserId(req.headers.token)
            ]
                , function (error, result) {
                    if (error) {
                        errorlogger.error(error, null);
                        connection.rollback();
                        connection.release();
                        response.return_code = 1;
                        response.return_message = "Error Resetting password";
                        callback(response);
                        return;
                    } else {

                        var string = JSON.stringify(result);
                        var json = JSON.parse(string);
                        if (json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0) {
                            connection.commit();
                            connection.release();
                            response.return_message = json[json.length - 1][0].return_message;
                            response.data = result[0];
                            callback(response);
                            return;
                        }
                        else {
                            logger.debug(json[json.length - 1][0].return_message);
                            logger.debug(json[json.length - 1][0].return_code);
                            response.return_code = json[json.length - 1][0].return_code;
                            response.return_message = json[json.length - 1][0].return_message;
                            connection.rollback();
                            connection.release();
                            callback(response);
                            return;
                        }

                    }

                });

        });
    },
    generatepassword: function (callback) {
        callback(generator.generate({
            length: 10,
            numbers: true,
            uppercase: true,
            strict: true
        }));
    },
    saveUsers: function (req,connection, SEUS_ID, roles, userid, callback) {
        let response = {
            status: 200,
            return_code: 0,
            return_message: "",
            data: []
        }

        if (roles.length == 0 || typeof roles.length == 'undefined') {

            callback(response);
            return;
        }
        else {
            for (var i = 0, len = roles.length; i < len; i++) {
                connection.query(config.rolesSQL.AddRoleUser, [roles[i].SERO_ID
                    , SEUS_ID
                    , roles[i].FLAG
                    , util.getuserId(req.headers.token)
                ]
                    , function (error, result) {
                        if (error) {
                            errorlogger.error(error, null);
                            connection.rollback();
                            connection.release();
                            response.return_code = 1;
                            response.return_message = "Error Saving UserRole";
                            callback(response);
                            return;
                        } else {

                            var string = JSON.stringify(result);
                            var json = JSON.parse(string);
                            if (!json[json.length - 1][0].return_code == null) {
                                logger.debug(json[json.length - 1][0].return_message);
                                logger.debug(json[json.length - 1][0].return_code);
                                logger.debug(req.body.user);
                                logger.debug(req.body.user.length);
                                response.return_code = json[json.length - 1][0].return_code;
                                response.return_message = json[json.length - 1][0].return_message;
                                connection.rollback();
                                connection.release();
                                callback(response);
                                return;
                            }
                        }
                    });
                if (i == roles.length - 1) {
                    callback(response);
                    return;
                }

            }
        }
    }

}