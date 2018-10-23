var pool = require('../common/DbConnection');
var config = require('../config/config');
var log4js = require('../config/log4j');
var dateFormat = require('dateformat');
var multer = require('multer');
var path = require("path");
var fs = require('fs');
//require multer for the file uploads
var multer = require('multer');
var util = require('../common/utility')
const logger = log4js.getLogger('logger');
const errorlogger = log4js.getLogger('errorlogger');
var csv = require('csvtojson')

var processBacklinkFiles = require('./processBacklinkFiles');
// set the directory for the uploads to the uploaded to
var DIR = config.seo.backLinkPath;
//var converter=new require("csvtojson").Converter();

//require the csvtojson converter class 
var Converter = require("csvtojson").Converter;
// create a new converter object
var converter = new Converter({});

// call the fromFile function which takes in the path to your 
// csv file as well as a callback function


module.exports = {
    uploadBacklinks: function (req, res, callback) {
        let response = {
            status: 200,
            return_code: 0,
            return_message: "",
            data: []
        }
        try {
            var fileType = "";
            var location = "";
            var originalFilename = "";
            var upload = multer(
                {
                    storage: multer.diskStorage({
                        destination: function (req, file, cb) {
                            try {
                                logger.debug("From filename");
                                logger.debug(req.body);
                                logger.debug(file);
                                if (!fs.existsSync(DIR)) {
                                    fs.mkdirSync(DIR);
                                }
                                cb(null, DIR);
                            }
                            catch (err) {
                                cb(err);
                            }
                        },
                        filename: function (req, file, cb) {
                            try {
                                var filename =
                                    path.basename(file.originalname, path.extname(file.originalname))
                                    + '_' + Date.now() + path.extname(file.originalname);
                                var fileFullPath = path.resolve(DIR + filename);
                                fileType = req.body.FILE_TYPE;
                                location = fileFullPath;
                                originalFilename = file.originalname
                                cb(null, filename)
                            }
                            catch (err) {
                                cb(err);
                            }
                        }
                    })
                }).single('file');
            upload(req, res, function (err) {
                if (err) {
                    // An error occurred when uploading
                    console.log(err);
                    return res.status(422).send("an Error occured")
                }
                // No error occured.
                pool.getConnection(function (err, connection) {
                    if (err) {
                        logger.error("An error occurred while getting DB connection: " + err);
                        fs.unlink(location, function (err) {
                            if (err) {
                                //ignore error
                            };
                            // if no error, file has been deleted successfully
                            response.return_code = 1;
                            response.return_message = "Error uploading file.";
                            callback(response);
                            return;
                        });
                    }
                    else {
                        try {

                            csv()
                                .fromFile(location)
                                .on('error', (err) => {
                                    response.return_message = "Error uploading file due to incorrect file format.";
                                    response.return_code = 1;
                                    logger.error("Error uploading file due to incorrect file format.")
                                    logger.error(err)
                                    callback(response);
                                    return;
                                })
                                .on('header', (jsonObj) => {
                                    try {
                                        var headers = "";
                                        if (jsonObj.length > 0) {
                                            for (var i = 0; i < jsonObj.length; i++) {
                                                if (headers == "") {
                                                    headers = jsonObj[i]
                                                }
                                                else {
                                                    headers = headers + "," + jsonObj[i];
                                                }
                                            }
                                            logger.debug(headers);


                                            connection.beginTransaction();
                                            connection.query(config.seo.saveBacklinkFile,
                                                [null,
                                                    fileType,
                                                    originalFilename,
                                                    location,
                                                    headers,
                                                    "I",
                                                    util.getuserId(req.headers.authorization)], function (err, result) {
                                                        if (err) {
                                                            errorlogger.error(err);
                                                            fs.unlink(location, function (err) {
                                                                if (err) {
                                                                    //ignore error
                                                                };
                                                                // if no error, file has been deleted successfully
                                                                response.return_code = 1;
                                                                response.status = 200;
                                                                response.return_message = "Error uploading file.";
                                                                logger.error("Error deleting file due to DB error.")
                                                                logger.error(err)
                                                                try {
                                                                    connection.rollback();
                                                                    connection.release();
                                                                    callback(response);
                                                                    return;
                                                                }
                                                                catch (ex) {
                                                                    logger.error(ex);
                                                                    callback(response);
                                                                    return;
                                                                }

                                                            });
                                                        } else {
                                                            var string = JSON.stringify(result);
                                                            var json = JSON.parse(string);
                                                            if (json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0) {
                                                                response.data = result[0];
                                                                connection.commit();
                                                                connection.release();
                                                                callback(response);
                                                                return;
                                                            }
                                                            else {
                                                                fs.unlink(location, function (err) {
                                                                    if (err) {
                                                                        //ignore error
                                                                    };

                                                                    response.return_code = json[json.length - 1][0].return_code;
                                                                    response.return_message = json[json.length - 1][0].return_message;
                                                                    errorlogger.error(json[json.length - 1][0].return_message);
                                                                    try {
                                                                        connection.rollback();
                                                                        connection.release();
                                                                        callback(response);
                                                                        return;
                                                                    }
                                                                    catch (ex) {
                                                                        logger.error(ex);
                                                                        try{
                                                                            callback(response);
                                                                        }
                                                                        catch(ex){
                                                                            errorlogger.error("Callback already sent");
                                                                            errorlogger.error(ex);
                                                                        }
                                                                        return;
                                                                    }
                                                                });
                                                            }
                                                        }
                                                    });

                                        }
                                    }
                                    catch (ex) {
                                        logger.error(ex);
                                        response.return_message = "Error Uploading File";
                                        response.return_code = 1;
                                        try {
                                            connection.rollback();
                                            connection.release();
                                            callback(response);
                                            return;
                                        }
                                        catch (ex) {
                                            callback(response);
                                            return;
                                        }

                                    }
                                });
                        }
                        catch (ex) {
                            logger.error(ex);
                            response.return_message = "Error Uploading File";
                            response.return_code = 1;
                            try {
                                connection.rollback();
                                connection.release();
                                callback(response);
                                return;
                            }
                            catch (ex) {
                                callback(response);
                                return;
                            }

                        }
                    }
                });


            });


        }
        catch (ex) {
            response.return_code = 1;
            response.status = 501;
            response.return_message = "Error uploading file.";
            logger.error("Error uploading file.")
            logger.error(ex)

            callback(response);
            return;
        }



    },
    getBacklinkFile: function (req, callback) {
        let response = {
            status: 200,
            return_code: 0,
            return_message: "",
            data: []
        }

        blbf_id = req.query.blbf_id;

        pool.getConnection(function (err, connection) {

            if (err) {

                logger.error("An error occurred: " + err);
                response.return_code = 1;
                response.return_message = 'Error Retrieving Backlink Data';
                callback(response);
                return;

            }
            else {
                logger.debug("blbf_id:", blbf_id);

                connection.query(config.seo.getBacklinkFile, [
                    blbf_id,
                    util.getuserId(req.headers.token),
                ], function (err, rows) {
                    if (err) {
                        errorlogger.error(err);
                        response.return_code = 1;
                        response.return_message = 'Error Retrieving Backlink File Data';
                        try {
                            connection.release();
                        }
                        catch (ex) {
                            //ignore error
                        }
                        callback(response);
                        return;
                    } else {
                        var string = JSON.stringify(rows);
                        var json = JSON.parse(string);
                        if (json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0) {
                            logger.debug(rows);
                            response.data = rows[0];
                            connection.release();
                            logger.debug("printing response");
                            logger.debug(response.data);
                            callback(response);
                            return;
                        }
                        else {
                            response.return_code = json[json.length - 1][0].return_code;
                            response.return_message = json[json.length - 1][0].return_message;
                            errorlogger.error(json[json.length - 1][0].return_message);
                            connection.release();
                            callback(response);
                            return;
                        }
                    }

                });

            }
        });
    },
    getWebsites: function (req, callback) {
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
                response.return_message = 'Error getting DB connection';
                callback(response);
                return;
            }
            else {


                connection.query(config.seo.getWebsites, [
                    req.query.websiteType,
                    util.getuserId(req.headers.token),
                ], function (err, rows) {
                    if (err) {
                        errorlogger.error(err);
                        response.return_code = 1;
                        response.return_message = 'Error Retrieving Website Data';
                        try {
                            connection.release();
                        }
                        catch (ex) {
                            //ignore error
                        }
                        callback(response);
                        return;
                    } else {
                        var string = JSON.stringify(rows);
                        var json = JSON.parse(string);
                        if (json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0) {
                            logger.debug(rows);
                            response.data = rows[0];
                            connection.release();
                            callback(response);
                            return;
                        }
                        else {
                            response.return_code = json[json.length - 1][0].return_code;
                            response.return_message = json[json.length - 1][0].return_message;
                            errorlogger.error(json[json.length - 1][0].return_message);
                            connection.release();
                            callback(response);
                            return;
                        }
                    }

                });

            }
        });
    },

    deleteBacklinkFile: function (req, callback) {
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
                response.return_message = "Error Deleting file." + req.body.BLBF_FILE_NAME;
                callback(response);
                return;

            }
            else {
                fs.unlink(req.body.BLBF_FILE_LOCATION, function (err) {
                    logger.error(err);
                    if (err) {
                        if (err.errno == "-4058") {
                            //ignore error if files is already deletee
                        }
                        else {
                            // if no error, file has been deleted successfully
                            response.return_code = 1;
                            response.return_message = "Error Deleting file." + req.body.BLBF_FILE_NAME;
                            logger.error("Error Deleting file.")
                            logger.error(err)
                            callback(response);
                            return;
                        }
                    }

                    connection.beginTransaction();
                    connection.query(config.seo.saveBacklinkFile,
                        [req.body.BLBF_ID,
                            '',
                            '',
                            '',
                            '',
                            "D",
                        util.getuserId(req.headers.token)], function (err, rows) {
                            if (err) {
                                errorlogger.error(err);
                                response.return_code = 1;
                                response.return_message = "Error Deleting file." + req.body.BLBF_FILE_NAME;;
                                try {
                                    connection.rollback();
                                    connection.release();
                                }
                                catch (ex) {
                                    errorlogger.err(ex);
                                }
                                callback(response);
                                return;
                            } else {
                                var string = JSON.stringify(rows);
                                var json = JSON.parse(string);
                                if (json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0) {
                                    connection.commit();
                                    connection.release();
                                    callback(response);
                                    return;
                                }
                                else {
                                    response.return_code = json[json.length - 1][0].return_code;
                                    response.return_message = json[json.length - 1][0].return_message;
                                    errorlogger.error(json[json.length - 1][0].return_message);
                                    connection.rollback();
                                    connection.release();
                                    callback(response);
                                    return;
                                }

                            }
                        });


                });

            }
        });

    },
    searchBacklink: function (req, callback) {
        let response = {
            status: 200,
            return_code: 0,
            return_message: "",
            data: []
        }
        pool.getConnection(function (err, connection) {

            if (err) {
                errorlogger.error("An error occurred: " + err);
                response.return_message = "Error Getting DB connection";
                response.return_code = 1;
            }
            else {
                logger.debug(req.body.batch);
                connection.query(config.seo.searchBacklink,
                    [req.body.batch.batchid,
                    req.body.batch.website,
                    (req.body.batch.startdate == null) ? null : dateFormat(req.body.batch.startdate, "yyyy-mm-dd h:MM:ss"),
                    (req.body.batch.enddate == null) ? null : dateFormat(req.body.batch.enddate, "yyyy-mm-dd h:MM:ss"),
                    req.body.batch.status,
                    util.getuserId(req.headers.token),
                    ], function (err, rows) {
                        if (err) {
                            errorlogger.error(err);
                            connection.release();
                            response.return_code = 1;
                            response.return_message = "Error Retrieving Backlink Batch Details"
                            callback(response);
                            return;

                        } else {
                            var string = JSON.stringify(rows);
                            var json = JSON.parse(string);
                            logger.debug(json);
                            if (json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0) {
                                //logger.debug(rows[0]);
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
            }
        });
    },
    searchCreatedBacklink: function (req, callback) {
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
                response.return_message = 'Error getting DB connection';
                callback(response);
                return;
            }
            else {
                connection.query(config.seo.searchCreatedBacklink,
                    [
                        (req.body.startdate == null) ? null : dateFormat(req.body.startdate, "yyyy-mm-dd h:MM:ss"),
                        (req.body.enddate == null) ? null : dateFormat(req.body.enddate, "yyyy-mm-dd h:MM:ss"),
                        req.body.domain,
                        req.body.keyword,
                        req.body.link,
                        req.body.source,
                        req.body.website,
                        req.body.createdby,
                        req.body.visibilty,
                        util.getuserId(req.headers.token),
                    ], function (err, rows) {
                        if (err) {
                            errorlogger.error(err);
                            connection.release();
                            response.return_code = 1;
                            response.return_message = "Error Retrieving Created Backlink  Details"
                            callback(response);
                            return;
                        } else {
                            var string = JSON.stringify(rows);
                            var json = JSON.parse(string);
                            if (json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0) {
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
            }
        });
    },
    searchVisibleBacklink: function (req, callback) {
        let response = {
            status: 200,
            return_code: 0,
            return_message: "",
            data: []
        }
        pool.getConnection(function (err, connection) {

            if (err) {
                errorlogger.error("An error occurred: " + err);
                response.return_message = 'Error getting DB connection';
                response.return_message = 1;
                callback(response);
                return;
            }
            else {
                connection.query(config.seo.searchVisibleBacklink,
                    [req.body.createdLink,
                    req.body.domain,
                    (req.body.firstSeenStartDate == null) ? null : dateFormat(req.body.firstSeenStartDate, "yyyy-mm-dd h:MM:ss"),
                    (req.body.firstSeenEndDate == null) ? null : dateFormat(req.body.firstSeenEndDate, "yyyy-mm-dd h:MM:ss"),
                    req.body.link,
                    (req.body.lostStartDate == null) ? null : dateFormat(req.body.lostStartDate, "yyyy-mm-dd h:MM:ss"),
                    (req.body.lostEndDate == null) ? null : dateFormat(req.body.lostEndDate, "yyyy-mm-dd h:MM:ss"),
                    req.body.source,
                    req.body.website,
                    req.body.websitePage,
                    util.getuserId(req.headers.token),
                    ], function (err, rows) {
                        if (err) {
                            errorlogger.error(err);
                            connection.release();
                            response.return_code = 1;
                            response.return_message = "Error Retrieving Visible Backlink  Details"
                            callback(response);
                            return;
                        } else {
                            var string = JSON.stringify(rows);
                            var json = JSON.parse(string);
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
            }
        });
    },
    processFiles: function (req, callback) {
        let response = {
            status: 200,
            return_code: 0,
            return_message: "",
            data: []
        }
        processBacklinkFiles.updateBatchStatus(null, 'IP', null, (returnvalue) => {
            try {
                logger.debug(returnvalue);
                if (returnvalue.return_code == 0) {
                    blbs_id = returnvalue.blbs_id;
                    response.data = { blbs_id: returnvalue.blbs_id }
                    response.return_message = "Batch Started batch id: " + blbs_id;
                    logger.debug("Batch Started batch id: " + blbs_id);
                    callback(response);
                    return;
                }
                else {
                    response.return_code = returnvalue.return_code;
                    response.return_message = returnvalue.return_message;
                    callback(response);
                    return;
                }
            }
            catch (ex) {

            }
        });
    },

    searchBacklinkBatch: function (req, callback) {
        let response = {
            status: 200,
            return_code: 0,
            return_message: "",
            data: []
        }
        pool.getConnection(function (err, connection) {

            if (err) {
                errorlogger.error("An error occurred: " + err);
                response.return_message = 'Error getting DB connection';
                response.return_code = 2;
                callback(response);
                return;
            }

            connection.query(config.seo.searchBacklinkBatch,
                [req.body.blbs_id,
                req.body.status,
                (req.body.fromStarttime == null) ? null : dateFormat(req.body.fromStarttime, "yyyy-mm-dd h:MM:ss"),
                (req.body.toStarttime == null) ? null : dateFormat(req.body.toStarttime, "yyyy-mm-dd h:MM:ss"),
                (req.body.fromEndTime == null) ? null : dateFormat(req.body.fromEndTime, "yyyy-mm-dd h:MM:ss"),
                (req.body.toEndTime == null) ? null : dateFormat(req.body.toEndTime, "yyyy-mm-dd h:MM:ss"),
                req.body.errorDescripiton,
                util.getuserId(req.headers.token),
                ], function (err, rows) {
                    if (err) {
                        errorlogger.error(err);
                        connection.release();
                        response.return_code = 1;
                        response.return_message = "Error Retrieving Backlink Batch Details"
                        callback(response);
                        return;
                    } else {
                        var string = JSON.stringify(rows);
                        var json = JSON.parse(string);
                        //logger.debug(json);
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
    getMetadataFromTable: function (req, callback) {
        let response = {
            status: 200,
            return_code: 0,
            return_message: "",
            data: []
        }
        pool.getConnection(function (err, connection) {

            if (err) {
                errorlogger.error("An error occurred: " + err);
                response.return_message = 'Error getting DB connection';
                response.return_code = 2;
                callback(response);
                return;
            }

            connection.query(config.seo.getMetadataFromTable,
                [req.body.dbname,
                req.body.tablename,
                req.body.columnname,
                util.getuserId(req.headers.token),
                ], function (err, rows) {
                    if (err) {
                        errorlogger.error(err);
                        connection.release();
                        response.return_code = 1;
                        response.return_message = "Error Retrieving Backlink Batch Details"
                        callback(response);
                        return;
                    } else {
                        var string = JSON.stringify(rows);
                        var json = JSON.parse(string);
                        //logger.debug(json);
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
    
};