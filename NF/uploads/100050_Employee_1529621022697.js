var pool = require('../common/DbConnection');
var config = require('../config/config');
var log4js = require('../config/log4j');
var generator = require('generate-password');
const logger = log4js.getLogger('Employee');
const errorlogger = log4js.getLogger('errorlogger');

module.exports = {
    searchEmployee: function (req, callback) {
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
            logger.debug(req.body.employee);
            connection.query(config.onBoard.searchEmployee,
                [req.body.employee.EMPH_ID,
                req.body.employee.EMPH_FIRSTNAME,
                req.body.employee.EMPH_MIDNAME,
                req.body.employee.EMPH_LASTNAME,
                req.body.employee.EMPH_DATEOFBIRTH,
                req.body.employee.EMPH_DATEOFJOINING,
                req.body.employee.EMPH_DESIGNATION,
                req.body.employee.EMPH_MANAGER_ID,
                req.body.employee.EMPH_ROLE,
                req.body.employee.EMPH_SHIFT,
                req.body.USER_NAME
                ], function (err, rows) {
                    if (err) {
                        errorlogger.error(err);
                        connection.release();
                        response.return_code = 1;
                        response.return_message = "Error Retrieving Employee"
                        callback(response);
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
                        }
                        else {
                            logger.debug(json[json.length - 1][0].return_message);
                            logger.debug(json[json.length - 1][0].return_code);
                            response.return_code = json[json.length - 1][0].return_code;
                            response.return_message = json[json.length - 1][0].return_message;
                            connection.rollback();
                            connection.release();
                            callback(response);
                        }

                    }

                });

        });
    },
   
}