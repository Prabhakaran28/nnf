
var pool = require('../common/DbConnection');
var config = require('../config/config');
var log4js = require('../config/log4j');
var dateFormat = require('dateformat');
var util = require('../common/utility')
const logger = log4js.getLogger('logger');
const errorlogger = log4js.getLogger('errorlogger');
var csv = require('csvtojson')


process.on('message', function (blbs_id) {
    procesFiles(blbs_id);
});

var procesFiles = function (blbs_id) {
    try {
        processBacklink((data) => {
            if (data.return_code == 0) {
                try {
                    logger.info("Loading Status: " + data.return_message);
                    logger.info("Loading Status: " + data.return_code);
                    console.log("Loading Status: " + data.return_message);
                    console.log("Loading Status: " + data.return_code);
                    pool.getConnection(function (err, connection) {
                        if (err) {
                            returnvalue.return_code = 1;
                            returnvalue.return_message = "Error Getting DB connection";
                            errorlogger(returnvalue.return_message);
                            errorlogger.error(err);
                            module.exports.updateBatchStatus(blbs_id, 'E', err, (returnvalue) => { });
                        }
                        connection.query(config.seo.processBacklink,
                            ['BATCHUSER'
                            ], function (err, rows) {
                                try {
                                    if (err) {
                                        errorlogger.error("Error Processing File");
                                        errorlogger.error(err);
                                        connection.release();
                                    } else {

                                        module.exports.updateBatchStatus(blbs_id, 'C', null, (returnvalue) => {
                                            if (returnvalue.return_code == 0) {
                                                connection.release();
                                                logger.info("Backlink File Processing Completed Successfully");
                                                console.log("Backlink File Processing Completed Successfully");
                                            }
                                        });
                                    }
                                }
                                catch (ex) {
                                    errorlogger.error(ex);
                                    module.exports.updateBatchStatus(blbs_id, 'E', ex, (returnvalue) => { });
                                }
                            });
                    });
                }
                catch (ex) {
                    errorlogger.error(ex);
                    module.exports.updateBatchStatus(blbs_id, 'E', ex, (returnvalue) => { });
                }
            }
            else {
                errorlogger.error(data.return_message);
                module.exports.updateBatchStatus(blbs_id, (data.return_code == 2) ? 'C' : 'E', data.return_message, (returnvalue) => { });
            }
        });

    }
    catch (ex) {
        errorlogger.error(ex);
        module.exports.updateBatchStatus(blbs_id, 'E', ex, (returnvalue) => { });
    }

};



var loadfiles = function (connection, loadcmd, BLBF_ID, BLBF_FILE_TYPE, callback) {

    connection.query(loadcmd, function (err, rows) {
        if (err) {
            errorlogger.error(err);
            connection.query(config.seo.updateFileStatus,
                [
                    BLBF_ID,
                    BLBF_FILE_TYPE,
                    'ER',
                    "Error Code: " + err.code + " " + "Error Description: " + err.sqlMessage,
                    'E',
                    'BATCHUSER'
                ], function (err, rows) {
                    if (err) {
                        errorlogger.error("Error Updating File status for: " + BLBF_ID);
                        errorlogger.error(err);
                        connection.release();
                        callback();
                    }
                    else {
                        try {
                            connection.release();
                            callback();
                        }
                        catch (exe) {
                            callback();
                        }
                    }

                });
        } else {
            logger.debug(rows);
            connection.query(config.seo.updateFileStatus,
                [
                    BLBF_ID,
                    BLBF_FILE_TYPE,
                    'IP',
                    null,
                    null,
                    'BATCHUSER'
                ], function (err, rows) {

                    if (err) {
                        errorlogger.error("Error Updating File status after succesful load");
                        errorlogger.error(err);
                        try {
                            connection.release();
                            callback();
                        }
                        catch (exe) {
                            callback();
                        }
                    }
                    else {
                        errorlogger.debug("File successfully  loaded and status updated for BLBF: " + BLBF_ID);
                        errorlogger.debug(err);
                        try {
                            connection.release();
                            callback();
                        }
                        catch (ex) {
                            callback();
                        }

                    }

                });

        }
    });

};
var processBacklink = function (callback) {
    returnvalue = {
        return_code: 0,
        return_message: "",
    };
    pool.getConnection(function (err, connection) {
        try {
            if (err) {
                errorlogger.error(err);
                returnvalue.return_code = 1;
                returnvalue.return_message = err;
                callback(returnvalue);
            }
            connection.query(config.seo.getloadFiles,
                ['BATCHUSER'
                ], function (err, rows) {
                    try {
                        if (err) {
                            errorlogger.error(err);
                            returnvalue.return_code = 1;
                            returnvalue.return_message = err;
                            connection.release();
                            callback(returnvalue);
                        } else {
                            var string = JSON.stringify(rows);
                            var json = JSON.parse(string);

                            var status = ""
                            if (json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0) {

                                if (rows[0].length == 0) {
                                    returnvalue.return_code = 2;
                                    returnvalue.return_message = "No files to update";
                                    connection.release();
                                    callback(returnvalue);

                                }
                                else {
                                    try {
                                        var i = 0;
                                        if (rows[0].length == 0) {
                                            returnvalue.return_code = 2;
                                            returnvalue.return_message = "No files to update";
                                            connection.release();
                                            callback(returnvalue);
                                        }
                                        else {
                                            rows[0].forEach(element => {
                                                //await new Promise(next => {

                                                loadfiles(connection, element.LOADCMD, element.BLBF_ID, element.BLBF_FILE_TYPE,
                                                    function () {
                                                        i++;
                                                        if (i == rows[0].length) {
                                                            returnvalue.return_code = 0;
                                                            returnvalue.return_message = "File load completed successfully";
                                                            try {
                                                                connection.release();
                                                                callback(returnvalue);
                                                            }
                                                            catch (ex) {
                                                                logger.error(ex);
                                                                callback(returnvalue);
                                                            }
                                                        }

                                                    });
                                                // }

                                            });
                                        }
                                    }
                                    catch (ex) {
                                        errorlogger.error(ex);
                                        returnvalue.return_code = 1;
                                        returnvalue.return_message = ex;
                                        connection.release();
                                        callback(returnvalue);
                                    }

                                }


                            }
                            else {
                                logger.error(json[json.length - 1][0].return_message);
                                logger.debug(json[json.length - 1][0].return_code);
                                connection.release();
                                returnvalue.return_code = json[json.length - 1][0].return_code;
                                returnvalue.return_message = json[json.length - 1][0].return_message;
                                callback(returnvalue);

                            }

                        }
                    }
                    catch (ex) {
                        errorlogger.error(ex);
                        returnvalue.return_code = 1;
                        returnvalue.return_message = ex;
                        callback(returnvalue);
                    }
                });
        }
        catch (ex) {
            errorlogger.error(ex);
            returnvalue.return_code = 1;
            returnvalue.return_message = ex;
            callback(returnvalue);
        }
    });
};
module.exports = {
    updateBatchStatus: function (blbs_id, status, errordescription, callback) {

        returnvalue = {
            return_code: 0,
            return_message: "",
            blbs_id: "",
        };
        pool.getConnection(function (err, connection) {
            if (err) {
                returnvalue.return_code = 1;
                returnvalue.return_message = "Error Getting DB connection";
                errorlogger(returnvalue.return_message);
                errorlogger.error(err);
                connection.release();
                callback(returnvalue);
            }
            connection.query(config.seo.batchStatus,
                [blbs_id,
                    status,
                    errordescription,
                    'BATCHUSER'
                ], function (err, rows) {
                    if (err) {
                        returnvalue.return_code = 1;
                        returnvalue.return_message = "Error Updating Batch Status";
                        errorlogger.error(returnvalue.return_message);
                        errorlogger.error(err);
                        connection.release();
                        callback(returnvalue);
                    } else {
                        var string = JSON.stringify(rows);
                        var json = JSON.parse(string);
                        var status = ""
                        if (json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0) {
                            returnvalue.blbs_id = json[0][0].BLBS_ID;
                            connection.release();
                            callback(returnvalue);
                        }
                        else {
                            returnvalue.return_code = json[json.length - 1][0].return_code;
                            returnvalue.return_message = json[json.length - 1][0].return_message;
                            errorlogger.error(returnvalue.return_message);
                            errorlogger.error(err);
                            connection.release();
                            callback(returnvalue);
                        }
                    }
                });
        });
    },

}