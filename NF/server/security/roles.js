var pool = require('../common/DbConnection');
var config = require('../config/config');
var log4js = require('../config/log4j');

const logger = log4js.getLogger('logger');
const errorlogger = log4js.getLogger('errorlogger');

module.exports = {

    getRoles: function (callback) {
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
                response.return_message = "Error getting Role Details";
                connection.release();
                callback(response);

            }
            connection.query(config.rolesSQL.GetRolesList, function (err, rows) {
                if (err) {
                    errorlogger.error(err);
                    connection.release();
                    response.return_code = 1;
                    response.return_message = "Error Retrieving Roles"

                    //throw err;
                } else {
                    logger.debug(rows[0]);
                    response.data = rows[0];

                }
                connection.release();
                callback(response);

            });

        });
    },
    getRolePermissions: function (req, IN_SERO_ID, callback) {
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
                response.return_message = "Error getting Role Permission Details";
                connection.release();
                callback(response);

            }
            connection.query(config.rolesSQL.GetRolePermissions, IN_SERO_ID, function (err, rows) {
                if (err) {
                    errorlogger.error(err);
                    response.return_code = 1;
                    response.return_message = "Error getting Role Permission Details";
                    connection.release();
                    callback(response);
                } else {
                    logger.debug(rows);
                    response.data = rows[0];
                    connection.release();
                    callback((response));
                }

            });

        });
    },
    getRoleUsers: function (req, IN_SERO_ID, callback) {
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
                response.return_message = "Error getting Role User Details";
                connection.release();
                callback(response);

            }
            connection.query(config.rolesSQL.GetRoleUsers, IN_SERO_ID, function (err, rows) {
                if (err) {
                    errorlogger.error(err);
                    response.return_code = 1;
                    response.return_message = "Error getting Role User Details";
                    connection.release();
                    callback(response);

                } else {
                    logger.debug(rows);
                    response.data = rows[0];
                    connection.release();
                    callback((response));
                }

            });

        });
    },
    getRole: function (req, IN_SERO_ID, callback) {
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
                response.return_message = "Error getting Role Detail";
                connection.release();
                callback(response);
            }
            connection.query(config.rolesSQL.GetRole, IN_SERO_ID, function (err, rows) {
                if (err) {
                    errorlogger.error(err);
                    response.return_code = 1;
                    response.return_message = "Error getting Role Detail";
                    connection.release();
                    callback(response);
                } else {
                    logger.debug(rows);
                    response.data = rows[0];
                    connection.release();
                    callback(response);
                }

            });

        });
    },
    saveRole: function (req, callback) {
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
                response.return_message = "Error Saving Role";
                callback(response);
            }

            logger.debug(req.body.module);
            connection.beginTransaction();
            var IN_SERO_ID = req.body.role.SERO_ID;
            logger.info("IN_SERO_ID from request: " + IN_SERO_ID);
            var IN_SERO_IS_ACTIVE = "Y";
            var IN_USER_NAME = null;
            if (IN_SERO_ID == "") {
                IN_SERO_ID = null;
            }
            var mode;
            if (IN_SERO_ID == "" || IN_SERO_ID == null) {
                mode = " created ";
            }
            else {
                mode = " saved ";
            }
            var IN_SERO_ROLE_DESCRIPTION = req.body.role.SERO_ROLE_DESCRIPTION;
            var IN_SERO_ROLE_NAME = req.body.role.SERO_ROLE_NAME;
            logger.info(config.rolesSQL.SaveRole, [IN_SERO_ID, IN_SERO_IS_ACTIVE
                , IN_SERO_ROLE_DESCRIPTION
                , IN_SERO_ROLE_NAME
                , IN_USER_NAME
            ])
            connection.query(config.rolesSQL.SaveRole, [IN_SERO_ID, IN_SERO_IS_ACTIVE
                , IN_SERO_ROLE_DESCRIPTION
                , IN_SERO_ROLE_NAME
                , IN_USER_NAME
            ]
                , function (error, result) {
                    if (error) {
                        errorlogger.error(error, null);
                        connection.rollback();
                        connection.release();
                        response.return_code = 1;
                        response.return_message = "Error Saving Role";
                        callback(response);
                    } else {

                        var string = JSON.stringify(result);
                        var json = JSON.parse(string);

                        if (json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0) {
                            logger.debug("SERO_ID: " + json[0][0].SERO_ID);
                            logger.debug("Module Length: " + req.body.module.length);
                            module.exports.saveModules(connection, json[0][0].SERO_ID, req.body.module, null, function (result) {
                                logger.debug("before checking result.return_code: " + result.return_code);

                                if (result.return_code == 0) {
                                    logger.debug("req.body.user.length: " + req.body.user.length);
                                    logger.debug("req.body.user: " + req.body.user);
                                    logger.debug(result);
                                    module.exports.saveUsers(connection, json[0][0].SERO_ID, req.body.user, null, function (result) {
                                        logger.debug(result);
                                        if (result.return_code == 0) {
                                            connection.commit();
                                            connection.release();
                                            result.return_code = 0;
                                            result.return_message = "Role " + IN_SERO_ROLE_NAME + mode + " successfully";
                                            callback(result);
                                        }
                                        else {
                                            connection.rollback;
                                            connection.commit();
                                            callback(result);
                                        }
                                    });
                                }
                                else {
                                    connection.rollback;
                                    connection.commit();
                                    callback(result);
                                }

                            });
                        }
                        else {
                            logger.debug(json[json.length - 1][0].return_message);
                            logger.debug(json[json.length - 1][0].return_code);
                            response.return_code = json[json.length - 1][0].return_code;
                            response.return_message = json[json.length - 1][0].return_message;
                            connection.rollback();
                            connection.commit();
                            callback(response);
                        }

                    }

                });
        });
    },
    saveModules: function (connection, SERO_ID, modules, userid, callback) {
        logger.info("inside saveModules");
        let response = {
            status: 200,
            return_code: 0,
            return_message: "",
            data: []
        }
        if (modules.length == 0) {

            callback(response);
        }
        else {
            for (var i = 0, len = modules.length; i < len; i++) {
                logger.error(("SEMO_ID" + modules[i].SEMO_ID));
                connection.query(config.rolesSQL.AddRolePermissions, [SERO_ID
                    , modules[i].SEMO_ID
                    , modules[i].FLAG
                    , userid
                ]
                    , function (error, result) {
                        if (error) {
                            logger.error(error);
                            connection.rollback();
                            response.return_code = 1;
                            response.return_message = "Error Saving Role";
                            callback(response);
                        } else {

                            var string = JSON.stringify(result);
                            var json = JSON.parse(string);
                            if (!json[json.length - 1][0].return_code == null) {
                                logger.debug(json[json.length - 1][0].return_message);
                                logger.debug(json[json.length - 1][0].return_code);
                                logger.debug(req.body.module);
                                logger.debug(req.body.module.length);
                                response.return_code = json[json.length - 1][0].return_code;
                                response.return_message = json[json.length - 1][0].return_message;
                                connection.rollback();
                                callback(response);
                            }
                        }
                    });
                if (i == modules.length - 1) {

                    callback(response);
                }
            }
        }
    },
    saveUsers: function (connection, SERO_ID, users, userid, callback) {
        logger.debug("inside saveUsers");
        let response = {
            status: 200,
            return_code: 0,
            return_message: "",
            data: []
        }
        if (users.length == 0) {

            callback(response);
        }
        else {
            for (var i = 0, len = users.length; i < len; i++) {
                logger.error(("SERO_ID" + users[i].SERO_ID));
                connection.query(config.rolesSQL.AddRoleUser, [SERO_ID
                    , users[i].SEUS_ID
                    , users[i].FLAG
                    , null
                ]
                    , function (error, result) {
                        if (error) {
                            errorlogger.error(error, null);
                            connection.rollback();
                            response.return_code = 1;
                            response.return_message = "Error Saving UserRole";
                            callback(response);
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
                                callback(response);
                            }
                        }
                    });
                if (i == users.length - 1) {
                    callback(response);
                }

            }
        }
    }
};

