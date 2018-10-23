var express = require('express');
var router = express.Router();

var pool = require('./common/DbConnection');
var config = require('./config/config');
var log4js = require('./config/log4j');
var roles = require('./security/roles.js');
var modules = require('./security/modules.js');
var users = require('./security/users.js');
var auth = require('./auth/auth.js');

const logger = log4js.getLogger('logger');

let response = {
  status: 200,
  message: null,
  data: []
}
var sendError = (err, res) => {
  response.status = 501;
  respnse.message = typeof err == "object" ? err.message : err;
  res.status(501).json(respnse);
}

router.get('/api/getusers', (req, res) => {
  try {
    users.getUsers(req,function (result) {
      res.status(result.status);
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }

});
router.post('/api/searchUsers', (req, res) => {
  try {
    users.searchUsers(req,function (result) {
      res.status(result.status);
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }

});
router.post('/api/deleteUser', (req, res) => {
  try {
    users.deleteUser(req,function (result) {
      res.status(result.status);
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }

});
router.get('/api/getroles', (req, res) => {
  try {
    roles.getRoles(function (result) {
      res.status(result.status);
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }

});

router.get('/api/getrole/', (req, res) => {
  roledata = {
    "role": [],
    "module": [],
    "user": []
  };
  let response = {
    status: 200,
    return_code: 0,
    return_message: "",
    data: []
  }
  response.data = roledata;
  try {
    roles.getRole(req, req.query.role_id, function (roleresult) {
      if (roleresult.status == 200) {
        response.data.role = roleresult.data;
        roles.getRolePermissions(req, req.query.role_id, function (rpresult) {
          if (rpresult.status == 200) {
            response.data.module = rpresult.data;
            roles.getRoleUsers(req, req.query.role_id, function (ruresult) {
              if (ruresult.status == 200) {
                response.data.user = ruresult.data;
                res.status(ruresult.status);
                res.json(response);
              }
              else {
                res.status(ruresult.status);
                res.json(ruresult);
              }
            });

          }
          else {
            res.status(rpresult.status);
            res.json(rpresult);
          }
        });
      }
      else {
        res.status(roleresult.status);
        res.json(roleresult);
      }
    });
  }
  catch (error) {
    throw error;
  }

});
router.get('/api/getuser/', (req, res) => {
  userdata = {
    "user": [],
    "role": []
  };
  let response = {
    status: 200,
    return_code: 0,
    return_message: "",
    data: []
  }
  response.data = userdata;
  try {
    users.getUser(req, req.query.user_id, function (userresult) {
      if (userresult.status == 200) {
        response.data.user = userresult.data;
        users.getUserRoles(req, req.query.user_id, function (urresult) {
          if (urresult.status == 200) {
            response.data.role = urresult.data;
            res.status(urresult.status);
            res.json(response);
          }
          else {
            res.status(urresult.status);
            res.json(urresult);
          }
        });
      }
      else {
        res.status(roleresult.status);
        res.json(roleresult);
      }
    });
  }
  catch (error) {
    throw error;
  }

});
router.post('/api/saverole', (req, res) => {
  try {
    roles.saveRole(req, function (result) {
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }


});
router.post('/api/saveuser', (req, res) => {
  try {
    users.saveUser(req, function (result) {
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }


});
router.post('/api/resetPassword', (req, res) => {
  try {
    users.resetPassword(req, function (result) {
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }


});

router.get('/api/modules', (req, res) => {
  try {
    modules.getModules(req,function (result) {
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }
});
router.get('/api/users', (req, res) => {
  try {
    users.getUsers(req,function (result) {
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }
});

router.post('/api/auth/login', (req, res) => {
  try {
    auth.login(req, res, function (result) {
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }

});

router.delete('/api/auth/logout', (req, res) => {
  try {
    auth.logout(req, res, function (result) {
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }


});

router.post('/api/auth/change-pass', (req, res) => {
  try {
    auth.changePassword(req, res,function (result) {
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }
});

router.post('/api/auth/forgot-pass', (req, res) => {
  try {
    auth.forgotPassword(req, res,function (result) {
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }
});


router.post('/api/auth/reset-pass', (req, res) => {
  try {
    auth.resetPassword(function (result) {
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }
});


module.exports = router;