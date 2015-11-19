//===============================================//
//====================require====================//
//===============================================//
var express = require('express'),
  bodyParser = require('body-parser'),
  uuid = require('uuid'),
  validator = require('validator'),
  md5 = require('md5'),
  SqlOperation = require('../mongodb/sqloperation.js'),
  config = require('../config/config.js');

var router = express.Router(),
  SqlOperation = new SqlOperation();
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

//用户登录
router.post('/login', function(req, res, next) {
  var loginInfo = {
      username: req.body.username,
      password: req.body.password
    }
    //登录信息格式校验
    //用户名不能为空，5-10个数字或英文字符
    //密码不能为空，6-15个数字或英文字符
  var check1 = validator.isAlphanumeric(loginInfo.username);
  //var check2 = validator.isAlphanumeric(loginInfo.password);
  var check3 = validator.isLength(loginInfo.username, 5, 10);
  var check4 = validator.isLength(loginInfo.password, 6, 15);

  if (check1 && check3 && check4) {
    SqlOperation.findSpecify('users', {
      username: loginInfo.username
    }, function(err, results) {
      //异常处理
      if (err) return next(err);
      if (results) {
        if (results.password == md5(loginInfo.password)) {
          var userInfo = results;
          //更新用户最近登录时间,非阻塞
          SqlOperation.update('users', {
            username: userInfo.username
          }, {
            "$set": {
              recently_time: Date.now() / 1000
            }
          }, function(err, results) {
            //异常处理
            //if (err) return next(err);
            console.log("登录时间更新结果");
            console.log(results);
          });
          //移除旧的token并创建新的token
          SqlOperation.removeMany('tokens', {
            user_id: userInfo._id
          }, function(err, results) {
            //异常处理
            if (err) return next(err);
            console.log("token移除结果");
            console.log(results);
            if (results.result.ok == 1) {
              //为登陆成功的用户创建新的token
              var token = uuid.v4();
              SqlOperation.insert('tokens', {
                user_id: userInfo._id,
                token: token,
                create_time: Date.now() / 1000,
                delete_time: Date.now() / 1000 + (86400 * 7)
              }, function(err, results) {
                //异常处理
                if (err) return next(err);
                console.log("token添加效果");
                console.log(results);
                if (results.result.ok == 1) {
                  config.usersRes.status1000.data = userInfo;
                  config.usersRes.status1000.token = token;
                  res.status(200).send(config.usersRes.status1000);
                } else {
                  console.log("token插入失败");
                  res.status(200).send(config.tokenRes.status2005);
                }
              })
            }
          });
        } else {
          console.log("密码错误");
          res.status(200).json(config.usersRes.status1007);
        }
      } else {
        console.log("账号不存在");
        res.status(200).json(config.usersRes.status1008);
      }
    });
  } else {
    console.log("格式不正确");
    console.log("username:" + check1 + " username5-10:" + check3 + " password6-16:" + check4);
    res.status(200).json(config.usersRes.status1010);
  }
});

//用户注册
router.post('/join', function(req, res, next) {
  //注册信息
  var joinInfo = {
    username: req.body.username,
    email: req.body.email,
    password: md5(req.body.password),
    register_time: Date.now() / 1000,
    role: 1,
    level: 0,
    status: 1
  };
  //注册信息格式校验
  //用户名不能为空，5-10个数字或英文字符
  //密码不能为空，32个数字或英文字符
  var check1 = validator.isAlphanumeric(joinInfo.username);
  //var check2 = validator.isAlphanumeric(joinInfo.password);
  var check3 = validator.isEmail(joinInfo.email);
  var check4 = validator.isLength(joinInfo.username, 5, 10);
  var check5 = validator.isLength(req.body.password, 6, 15);
  if (check1 && check3 && check4 && check5) {
    console.log("格式通过");
    //检查用户是否存在
    SqlOperation.findSpecify('users', {
      username: req.body.username
    }, function(err, results) {
      console.log("====检查用户是否存在====");
      console.log(err);
      console.log(results);
      //异常处理
      if (err) return next(err);
      console.log(results);
      if (results) {
        res.status(200).send(config.usersRes.status1005);
      } else {
        //注册用户
        SqlOperation.insert('users', joinInfo, function(err, results) {
          console.log("====注册用户====");
          console.log(err);
          console.log(results);
          //异常处理
          if (err) return next(err);
          console.log(results);
          if (results.result.ok == 1) {
            res.status(200).send(config.usersRes.status1000);
          }
        });
      }
    });
  } else {
    console.log("注册格式不对");
    console.log("username:" + check1 + " email:" + check3 + " username5-10:" + check4 + " password6-16:" + check5);
    res.status(200).json(config.usersRes.status1010);
  }
});
//获得所有用户信息
router.get('/', function(req, res, next) {
  SqlOperation.findAll('users', function(err, results) {
    console.log("====获取所有用户信息====");
    console.log(err);
    console.log(results);
    //异常处理
    if (err) return next(err);
    config.usersRes.status1000.data = results;
    res.status(200).json(config.usersRes.status1000);
  });
});
//访问users/all时抛出错误
//获得所有用户信息
router.get('/all', function(req, res, value) {
  //console.log(ss);
});
//通过用户ID和token获取用户信息
router.get('/:id', function(req, res, next) {
  var userId = SqlOperation.ObjectID(req.params.id);
  var token = req.query.token;
  var nowTime = Date.now() / 1000;
  SqlOperation.findSpecify('tokens', {
    user_id: userId
  }, function(err, results) {
    //异常处理
    if (err) return next(err);
    if (results) {
      console.log("token返回结果");
      console.log(results);
      if (results.user_id == req.params.id && results.token == token && nowTime <= results.delete_time) {
        SqlOperation.findSpecify('users', {
          _id: userId
        }, function(err, results) {
          //异常处理
          if (err) return next(err);
          if (results) {
            config.usersRes.status1000.data = results;
            res.status(200).send(config.usersRes.status1000);
          } else {
            res.status(200).send(config.usersRes.status1008);
          }
        });
      } else if (nowTime > results.deleteTime) {
        console.log("token过期");
        //删除token
        SqlOperation.removeOne('tokens', {
          token: token
        }, function(err, results) {
          //异常处理
          if (err) return next(err);
          if (results.result.ok == 1) {
            res.status(200).send(config.tokenRes.status2006);
          } else {
            res.status(200).send(config.tokenRes.status2004);
          }
        });

      } else {
        console.log("token无效");
        res.status(200).send(config.tokenRes.status2003);
      }
    } else {
      console.log("token不存在");
      res.status(200).send(config.tokenRes.status2002);
    }
  });
});

//========================================//
module.exports = router;
