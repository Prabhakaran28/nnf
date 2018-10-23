var pool = require('../common/DbConnection');
var config = require('../config/config');
var log4js = require('../config/log4j');

const logger = log4js.getLogger('logger');
const errorlogger = log4js.getLogger('errorlogger');

module.exports = {
    getModules: function (req,callback) {
        pool.getConnection(function (err, connection) {

            if (err) {
                errorlogger.error("An error occurred: " + err);
                throw err;
            }
            connection.query(config.modulesSQL.GetModules, function (err, rows) {
                if (err) {
                    errorlogger.error(err);
                    connection.release();
                    throw err;
                } else {
                    logger.debug(rows);
                    connection.release();
                    callback((rows[0]));
                }
            });

        });
    },

    addModule: function (req, callback) {
        pool.getConnection(function (err, connection) {
            if (err) {
                errorlogger.error("An error occurred: " + err);
                throw err;
            }
            connection.beginTransaction();

            var IN_SERO_ID = req.body.role.SERO_ID;
            if (IN_SERO_ID == "") {
                IN_SERO_ID = null;
            }
            var IN_SERO_ROLE_DESCRIPTION = req.body.role.SERO_ROLE_DESCRIPTION;
            var IN_SERO_ROLE_NAME = req.body.role.SERO_ROLE_NAME;

            connection.query(config.rolesSQL.AddRole,
                [IN_SERO_ROLE_DESCRIPTION
                    , IN_SERO_ROLE_NAME
                    , null]
                , function (ERROR, RESULT) {

                    if (ERROR) {
                        connection.release();
                        errorlogger.error(ERROR, null);
                    } else {
                        logger.debug(RESULT);
                    }

                });

            for (var i = 0, len = req.body.module.length; i < len; i++) {
                logger.error((req.body.module[i]));
            }

            connection.commit();
            connection.release();

        });
    }
};