//===============================================//
//====================require====================//
//===============================================//
var express = require('express'),
  bodyParser = require('body-parser'),
  SqlOperation = require('../mongodb/sqloperation.js'),
  config = require('../config/config.js'),
  uuid = require('uuid');
var router = express.Router();
var SqlOperation = new SqlOperation();
//==================================================//
//====================middleware====================//
//==================================================//
router.use(bodyParser.json()); // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}));
//====================================================//
//====================router statr====================//
//====================================================//
//get userinfo by id;
router.get('/:id', function(req, res) {
  var userId = req.params.id;
  var token = req.params.token;
  var nowTime = Date.now() / 1000;
  SqlOperation.findSpecify('tokens', {
    userId: userId
  }, function(results) {
    console.log(results);
    if (results.userId == userId && results.token == token && results.nowTime <= deleteTime) {
      //check success and return user info
      SqlOperation.findSpecify('users', {
        _id: SqlOperation.ObjectID(userId)
      }, function(results) {
        if (results) {
          config.responseResult.status200.data = results;
          res.status(200).send(config.responseResult.status200);
        } else {
          res.status(404).send(config.responseResult.status404);
        }
      });
    } else if (results.nowTime > deleteTime) {
      //delete token
      SqlOperation.removeOne('tokens', {
        token: token
      }, function(results) {
        console.log("delete token result:");
        console.log(results);
      })
    }
  });
});
//login
router.get('/login', function(req, res) {
  var username = req.params.username;
  var password = req.params.password;
  SqlOperation.findSpecify('users', {
    username: username
  }, function(results) {
    if (results.password == password) {
      var userInfo = results;
      //delete old token
      SqlOperation.removeMany('tokens', {
        userId: results._id
      }, function(results) {
        console.log("delete token result:");
        console.log(results);
      });
      //create a new token for user
      var token = uuid.v4();
      SqlOperation.insert('tokens', {
        userId: results._id,
        token: token,
        createTime: Date.now() / 1000,
        deleteTime: Date.now() / 1000 + (86400 * 7)
      }, function(results) {
        if (results.result.ok == 1) {
          config.responseResult.status200.data = userInfo;
          config.responseResult.status200.token = token;
          res.status(200).send(config.responseResult.status200);
        } else {
          res.status(200).send(config.responseResult.status404);
        }
      });
    } else {
      res.status(200).json(config.responseResult.status404);
    }
  });
});
//get all userinfo
router.get('/', function(req, res, value) {
  SqlOperation.findAll('users', function(results) {
    config.responseResult.status200.data = results;
    res.status(200).json(config.responseResult.status200);
  });
});
//post userinfo
router.post('/', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  SqlOperation.findSpecify('users', {
    name: username
  }, function(results) {
    console.log(results);
    if (results) {
      res.status(200).send(config.responseResult.status201);
    } else {
      SqlOperation.insert('users', {
        name: username,
        password: password
      }, function(result) {
        console.log(result);
        //userinfo add succes
        if (result.result.ok == 1) {
          res.status(200).send(config.responseResult.status200);
        }
      });
    }
  });
});
//========================================//
module.exports = router;
