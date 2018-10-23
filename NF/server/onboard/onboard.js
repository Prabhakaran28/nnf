var pool = require('../common/DbConnection');
var config = require('../config/config');
var log4js = require('../config/log4j');
var dateFormat = require('dateformat');
var util = require('../common/utility')
const logger = log4js.getLogger('logger');
const errorlogger = log4js.getLogger('errorlogger');

module.exports = {
    getMetaData: function (req, callback) {
        let response = {
            status: 200,
            return_code: 0,
            return_message: "",
            data: []
        }
        pool.getConnection(function (err, connection) {

            if (err) {
                errorlogger.error("An error occurred in retrieving Metadata: " + err);
                response.return_code = 1;
                response.return_message = "An error occurred in retrieving Metadata";
                connection.release();
                callback(response);
            }
            else {
                connection.query(config.common.GetMetaData,
                    [req.query.module
                        , req.query.submodule
                        , util.getuserId(req.headers.token)
                    ], function (err, result) {
                        if (err) {
                            errorlogger.error(err);
                            connection.release();
                            response.return_code = 1;
                            response.return_message = "Error Retrieving MetaData"
                            callback(response);
                        } else {
                            var string = JSON.stringify(result);
                            var json = JSON.parse(string);
                            if (json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0) {
                                logger.debug(json[0]);
                                response.data = json[0];
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

                            }

                        }


                    });
            }
        });
    },
}