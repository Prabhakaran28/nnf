var pool = require('../common/DbConnection');
var config = require('../config/config');
var log4js = require('../config/log4j');
var dateFormat = require('dateformat');
var util = require('../common/utility')
const logger = log4js.getLogger('logger');
const errorlogger = log4js.getLogger('errorlogger');
var csv = require('csvtojson')

var CronJob = require('cron').CronJob;
new CronJob('0 */5 * * * *', function () {
    var blbs_id;
    updateBatchStatus(null, 'IP', null, (returnvalue) => {
        try {
            logger.info(returnvalue);
            if (returnvalue.return_code == 0) {
                blbs_id = returnvalue.blbs_id;
                logger.info("Batch Started batch id: " + blbs_id);
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
                                    updateBatchStatus(blbs_id, 'E', err, (returnvalue) => { });
                                }
                                connection.query(config.seo.processBacklink,
                                    ['BATCHUSER'
                                    ], function (err, rows) {
                                        try {
                                            if (err) {
                                                errorlogger.error("Error Processing File");
                                                errorlogger.error(err);
                                            } else {

                                                updateBatchStatus(blbs_id, 'C', null, (returnvalue) => {
                                                    if (returnvalue.return_code == 0) {
                                                        logger.info("Backlink File Processing Completed Successfully");
                                                        console.log("Backlink File Processing Completed Successfully");
                                                    }
                                                });
                                            }
                                        }
                                        catch (ex) {
                                            errorlogger.error(ex);
                                            updateBatchStatus(blbs_id, 'E', ex, (returnvalue) => { });
                                        }
                                    });
                            });
                        }
                        catch (ex) {
                            errorlogger.error(ex);
                            updateBatchStatus(blbs_id, 'E', ex, (returnvalue) => { });
                        }
                    }
                    else {
                        errorlogger.error(data.return_message);
                        updateBatchStatus(blbs_id, (data.return_CODE == 2)? 'C':'E', data.return_message, (returnvalue) => { });
                    }
                });
            }
        }
        catch (ex) {
            errorlogger.error(ex);
            updateBatchStatus(blbs_id, 'E', ex, (returnvalue) => { });
        }
    });
}, null, true, '');
var updateBatchStatus = function (blbs_id, status, errordescription, callback) {

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
            callback(returnvalue);
            return;
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
                    callback(returnvalue);
                    return;
                } else {
                    var string = JSON.stringify(rows);
                    var json = JSON.parse(string);
                    var status = ""
                    if (json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0) {
                        returnvalue.blbs_id = json[0][0].BLBS_ID;
                        callback(returnvalue);
                        return;
                    }
                    else {
                        returnvalue.return_code = json[json.length - 1][0].return_code;
                        returnvalue.return_message = json[json.length - 1][0].return_message;
                        errorlogger.error(returnvalue.return_message);
                        errorlogger.error(err);
                        callback(returnvalue);
                        return;
                    }
                }
            });
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
                return;
            }
            connection.query(config.seo.getloadFiles,
                ['BATCHUSER'
                ], function (err, rows) {
                    try {
                        if (err) {
                            errorlogger.error(err);
                            returnvalue.return_code = 1;
                            returnvalue.return_message = err;
                            callback(returnvalue);
                            return;
                        } else {
                            var string = JSON.stringify(rows);
                            var json = JSON.parse(string);
                            var status = ""
                            if (json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0) {

                                if (rows[0].length == 0) {
                                    returnvalue.return_code = 2;
                                    returnvalue.return_message = "No files to update";
                                    callback(returnvalue);
                                    return;

                                }
                                else {
                                    try {
                                        var i = 0;
                                        if (rows[0].length == 0) {
                                            returnvalue.return_code = 2;
                                            returnvalue.return_message = "No files to update";
                                            callback(returnvalue);
                                            return;
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
                                                            callback(returnvalue);
                                                            return;
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
                                        callback(returnvalue);
                                        return;
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
                                return;

                            }

                        }
                    }
                    catch (ex) {
                        errorlogger.error(ex);
                        returnvalue.return_code = 1;
                        returnvalue.return_message = ex;
                        callback(returnvalue);
                        return;
                    }
                });
        }
        catch (ex) {
            errorlogger.error(ex);
            returnvalue.return_code = 1;
            returnvalue.return_message = ex;
            callback(returnvalue);
            return;
        }
    });
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
                        callback();
                        return;
                    }
                    else {
                        callback();
                        return;
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
                        callback();
                        return;
                    }
                    else {
                        errorlogger.debug("File successfully  loaded and status updated for BLBF: " + BLBF_ID);
                        errorlogger.debug(err);
                        callback();
                        return;
                    }

                });

        }
    });

};