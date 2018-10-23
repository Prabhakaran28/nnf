var bcrypt = require('bcryptjs');
var config = require('../config/config');
var log4js = require('../config/log4j');
var email = process.env.MAILER_EMAIL_ID || 'email.auth@netpros.us';
var pass = process.env.MAILER_PASSWORD || '*n@tPr*s001*';
var nodemailer = require('nodemailer');
var pool = require('../common/DbConnection');
const logger = log4js.getLogger('users');
const errorlogger = log4js.getLogger('errorlogger');
var jwt_decode = require('jwt-decode');

var smtpTransport = nodemailer.createTransport({
    port: "587",
    host: "smtp.1and1.com",
    auth: {
        user: email,
        pass: pass
    }
});



module.exports = {
    encrypt: function (value) {
        return bcrypt.hashSync(value, config.auth.superSecret)
    },

    sendEmail: function (msg) {

        smtpTransport.sendMail(msg, function (err) {

            if (!err) {
                return "Error occurred while sending email" + err;
            } else {
                return "Email sent successfully"
            }
        });

    },
    sendEmail: function (emailtype, toemail, variables, callback) {


        pool.getConnection(function (err, connection) {
            if (err) {
                errorlogger.error("An error occurred: " + err);
                response.return_code = 1;
                response.return_message = "Error Saving User";
                callback();
                return;
            }
            connection.query(config.auth.emailTemplate, [
                emailtype
                , ''
            ]
                , function (error, result) {
                    if (error) {
                        errorlogger.error(error, null);
                        response.return_code = 1;
                        response.return_message = "Error getting email template";
                        callback();
                    } else {
                        var string = JSON.stringify(result);
                        var json = JSON.parse(string);
                        if (json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0) {
                            variables.forEach(element => {
                                json[0][0].SEET_BODY = json[0][0].SEET_BODY.replace('%s', element);
                            });
                            var msg = {
                                to: toemail,
                                from: json[0][0].SEET_FROM,
                                html: json[0][0].SEET_BODY,
                                subject: json[0][0].SEET_SUBJECT,
                            };
                            smtpTransport.sendMail(msg, function (err) {
                                if (!err) {
                                    logger.error("Error occurred while sending email" + err);
                                    callback();
                                } else {
                                    logger.debug("Email sent successfully");
                                    callback();
                                }
                            });
                        }
                        else {
                            callback();
                        }
                    }


                }
            );

        });
    },
    sendEmail: function (emailtype, toemail, variables) {


        pool.getConnection(function (err, connection) {
            if (err) {
                errorlogger.error("Error getting DB connection sending email")
                errorlogger.error("An error occurred: " + err);
                //throw err;
                //response.return_code = 1;
                //response.return_message = "Error Saving User";
                return;
            }
            connection.query(config.auth.emailTemplate, [
                emailtype
                ,''// module.exports.getuserId(req.headers.token)
            ]
                , function (error, result) {
                    if (error) {
                        errorlogger.error("Error getting email template")
                        errorlogger.error(error, null);
                        //response.return_code = 1;
                        //response.return_message = "Error getting email template";
                        return;
                    } else {
                        var string = JSON.stringify(result);
                        var json = JSON.parse(string);
                        if (json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0) {
                            logger.debug(json);
                            if (json[0].length > 0) {
                                variables.forEach(element => {
                                    json[0][0].SEET_BODY = json[0][0].SEET_BODY.replace('%s', element);
                                });
                                var msg = {
                                    to: toemail,
                                    from: json[0][0].SEET_FROM,
                                    html: json[0][0].SEET_BODY,
                                    subject: json[0][0].SEET_SUBJECT,
                                };
                                smtpTransport.sendMail(msg, function (err) {
                                    if (err) {
                                        logger.error("Error occurred while sending email" + err);

                                    } else {
                                        logger.debug("Email sent successfully");
                                    }
                                });
                            }
                            else{
                                errorlogger.error("Email Template not found in db: " + emailtype )
                                
                            }
                        }
                    }


                }
            );

        });
    },

    getuserId: function (token) {
        return jwt_decode(token).email;
    }
}



