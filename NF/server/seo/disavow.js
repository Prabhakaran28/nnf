var pool = require('../common/DbConnection');
var config = require('../config/config');
var log4js = require('../config/log4j');
var dateFormat = require('dateformat');
var util = require('../common/utility')
const logger = log4js.getLogger('logger');
const errorlogger = log4js.getLogger('errorlogger');

module.exports = {
    searchDisavow: function (req, callback) {
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

            connection.query(config.seo.searchDisavow,
                [
                    req.body.domain,
                    util.getuserId(req.headers.token),
                ], function (err, rows) {
                    if (err) {
                        errorlogger.error(err);
                        connection.release();
                        response.return_code = 1;
                        response.return_message = "Error Retrieving Disavow Details"
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
}