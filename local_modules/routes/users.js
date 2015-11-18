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
//通过用户ID和token获取用户信息
router.get('/:id', function(req, res) {
  var userId = SqlOperation.ObjectID(req.params.id);
  var token = req.query.token;
  var nowTime = Date.now() / 1000;

  SqlOperation.findSpecify('tokens', {
    user_id: userId
  }, function(results) {
    if (results) {
      console.log("token返回结果");
      console.log(results);
      if (results.user_id == req.params.id && results.token == token && nowTime <= results.delete_time) {

        SqlOperation.findSpecify('users', {
          _id: userId
        }, function(results) {
          if (results) {
            config.responseResult.status200.data = results;
            res.status(200).send(config.responseResult.status200);
          } else {
            res.status(404).send(config.responseResult.status404);
          }
        });
      } else if (nowTime > results.deleteTime) {
        console.log("token过期");
        //delete token
        SqlOperation.removeOne('tokens', {
          token: token
        }, function(results) {

        });
        res.status(200).send(config.responseResult.status404);
      } else {
        console.log("token无效");
        res.status(200).send(config.responseResult.status404);
      }
    } else {
      console.log("未查询到token");
      res.status(200).send(config.responseResult.status404);
    }

  });
});
//用户登录
router.post('/login', function(req, res) {
  var loginInfo = {
    username: req.body.username,
    password: req.body.password
  }
  //登录信息格式校验
  //......//
  SqlOperation.findSpecify('users', {
    username: loginInfo.username
  }, function(results) {
    if (results) {
      if (results.password == loginInfo.password) {
        var userInfo = results;
        //移除旧的token
        SqlOperation.removeMany('tokens', {
          user_id: results._id
        }, function(results) {
          console.log("token移除结果");
          //console.log(results);
        });
        //为登陆成功的用户创建新的token
        var token = uuid.v4();
        SqlOperation.insert('tokens', {
          user_id: results._id,
          token: token,
          create_time: Date.now() / 1000,
          delete_time: Date.now() / 1000 + (86400 * 7)
        }, function(results) {
          console.log("token添加效果");
          console.log(results);
          if (results.result.ok == 1) {
            config.responseResult.status200.data = userInfo;
            config.responseResult.status200.token = token;
            //更新用户最近登录时间
            SqlOperation.update('users', {
              username: userInfo.username
            }, {
              "$set": {
                recently_time: Date.now() / 1000
              }
            }, function(results) {
              console.log("登录时间更新结果");
              console.log(results);
            })
            res.status(200).send(config.responseResult.status200);
          } else {
            console.log("token插入失败");
            res.status(200).send(config.responseResult.status404);
          }
        })
      } else {
        console.log("密码错误");
        res.status(200).json(config.responseResult.status404);
      }
    } else {
      console.log("账号不存在");
      res.status(200).json(config.responseResult.status404);
    }
  });
});
//获得所有用户信息
router.get('/', function(req, res, value) {
  SqlOperation.findAll('users', function(results) {
    config.responseResult.status200.data = results;
    res.status(200).json(config.responseResult.status200);
  });
});
//用户注册
router.post('/join', function(req, res) {


  //注册信息
  var joinInfo = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    register_time: Date.now() / 1000,
    role: 1,
    level: 0,
    status: 1
  };
  //req.body数据校验
  //......//

  //检查用户是否存在
  SqlOperation.findSpecify('users', {
    username: req.body.username
  }, function(results) {
    console.log(results);
    if (results) {
      res.status(200).send(config.responseResult.status201);
    } else {
      //注册用户
      SqlOperation.insert('users', joinInfo, function(result) {
        console.log(result);
        if (result.result.ok == 1) {
          res.status(200).send(config.responseResult.status200);
        }
      });
    }
  });
});
//========================================//
module.exports = router;
