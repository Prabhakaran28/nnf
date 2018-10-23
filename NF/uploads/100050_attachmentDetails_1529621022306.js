var pool = require('../common/DbConnection');
var config = require('../config/config');
var log4js = require('../config/log4j');
var dateFormat = require('dateformat');
var multer = require('multer');
var path = require("path");
var fs = require('fs');
//require multer for the file uploads
var multer = require('multer');

const logger = log4js.getLogger('logger');
const errorlogger = log4js.getLogger('errorlogger');

// set the directory for the uploads to the uploaded to
var DIR = config.onBoard.UploadPath;

module.exports = {

    saveAttachmentDetails: function (req, res, callback) {
        let response = {
            status: 200,
            return_code: 0,
            return_message: "",
            data: []
        }
        try {
            var emp_id = "";
            var DcoumentType = "";
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
                                var filename = req.body.EMP_ID + "\_"
                                    + path.basename(file.originalname, path.extname(file.originalname))
                                    + '_' + Date.now() + path.extname(file.originalname);
                                var fileFullPath = path.resolve(DIR) + "\\" + filename;
                                DcoumentType = req.body.DcoumentType;
                                emp_id = req.body.EMP_ID;
                                location = fileFullPath;
                                originalFilename = file.originalname
                                cb(null, filename)
                            }
                            catch (err) {
                                //throw (err);
                                cb(err);
                            }
                        }
                    })
                }).single('file');
            upload(req, res, function (err) {
                try {
                    if (err) {
                        // An error occurred when uploading
                        console.log(err);
                        return res.status(422).send("an Error occured")
                    }
                    // No error occured.
                    pool.getConnection(function (err, connection) {
                        if (err) {
                            logger.error("An error occurred: " + err);
                            fs.unlink(location, function (err) {
                                if (err) {
                                    //ignore error
                                };
                                // if no error, file has been deleted successfully
                                response.return_code = 1;
                                response.status = 501;
                                response.return_message = "Error uploading file.";
                                logger.error("Error uploading file.")
                                logger.error(err)
                                callback(response);
                            });
                        }
                        else {
                            connection.beginTransaction();
                            connection.query(config.onBoard.saveAttachmentDetails,
                                [null,
                                    emp_id,
                                    originalFilename,
                                    DcoumentType,
                                    location,
                                    "I",
                                    req.body.USER_NAME], function (err, result) {
                                        try {
                                            if (err) {
                                                errorlogger.error(err);
                                                fs.unlink(location, function (err) {
                                                    if (err) {
                                                        //ignore error
                                                    };
                                                    // if no error, file has been deleted successfully
                                                    response.return_code = 1;
                                                    response.status = 501;
                                                    response.return_message = "Error uploading file.";
                                                    logger.error("Error uploading file.")
                                                    logger.error(err)
                                                    try {
                                                        connection.rollback();
                                                        connection.release();
                                                    }
                                                    catch (err) {
                                                        //ignore error
                                                    }
                                                    callback(response);
                                                });
                                            } else {
                                                var string = JSON.stringify(result);
                                                var json = JSON.parse(string);
                                                if (json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0) {
                                                    connection.commit();
                                                    connection.query(config.onBoard.getAttachmentDetails, [emp_id, req.body.USER_NAME], function (err, rows) {
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
                                                else {
                                                    response.return_code = json[json.length - 1][0].return_code;
                                                    response.return_message = json[json.length - 1][0].return_message;
                                                    errorlogger.error(json[json.length - 1][0].return_message);
                                                    connection.rollback();
                                                    callback(response);
                                                }
                                            }
                                        }
                                        catch (ex) {
                                            fs.unlink(location, function (err) {
                                                if (err) {
                                                    //ignore error
                                                };
                                                // if no error, file has been deleted successfully
                                                response.return_code = 1;
                                                response.status = 501;
                                                response.return_message = "Error uploading file.";
                                                logger.error("Error uploading file.")
                                                logger.error(ex)
                                                callback(response);
                                            });

                                        }
                                    });


                        }
                    });

                }
                catch (ex) {
                    response.return_code = 1;
                    response.status = 501;
                    response.return_message = "Error uploading file.";
                    logger.error("Error uploading file.")
                    logger.error(ex)
                    callback(response);
                }
            });


        }
        catch (ex) {
            response.return_code = 1;
            response.status = 501;
            response.return_message = "Error uploading file.";
            logger.error("Error uploading file.")
            logger.error(ex)

            callback(response);
        }



        /*
        pool.getConnection(function (err, connection) {
            connection.beginTransaction();
            if (err) {
                errorlogger.error("An error occurred: " + err);
                throw err;
                response.return_code = 1;
                response.return_message = "Error Saving Employee Attachment Details";
                connection.rollback();
                callback(response);
                return;
            }
         
 
        });
        */
    },
    getAttachmentDetails: function (req, IN_EMP_ID, callback) {
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
                connection.query(config.onBoard.getAttachmentDetails, [IN_EMP_ID], function (err, rows) {
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
    getAttachmentDetails: function (req, IN_EMP_ID, callback) {
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
                connection.query(config.onBoard.getAttachmentDetails, [IN_EMP_ID, req.body.USER_NAME], function (err, rows) {
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
    deleteAttachment: function (req, IN_EMP_ID, callback) {
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
                fs.unlink(req.body.EMAT_ATTACHMENT_LOCATION, function (err) {
                    if (err) {
                        // if no error, file has been deleted successfully
                        response.return_code = 1;
                        response.status = 200;
                        response.return_message = "Error Deleting file.";
                        logger.error("Error Deleting file.")
                        logger.error(err)
                        callback(response);
                    }
                    else {
                        connection.beginTransaction();
                        connection.query(config.onBoard.deleteAttachment, [req.body.EMP_ID, req.body.EMAT_ID, req.body.USER_NAME], function (err, rows) {
                            if (err) {
                                errorlogger.error(err);
                                response.return_code = 1;
                                response.return_message = "Error Deleting file.";
                                try {
                                    connection.rollback();
                                    connection.release();
                                }
                                catch (ex) {
                                    errorlogger.err(ex);
                                }
                                callback(response);
                            } else {
                                try {
                                    connection.commit();
                                    connection.release();
                                }
                                catch (ex) {
                                    errorlogger.err(ex);
                                }
                                logger.debug(rows);
                                response.data = rows[0];
                                callback(response);
                            }
                        });
                    }

                });

            }
        });
    },
};