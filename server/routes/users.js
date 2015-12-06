//===============================================//
//====================require====================//
//===============================================//
var express = require('express'),
  bodyParser = require('body-parser'),
  uuid = require('uuid'),
  validator = require('validator'),
  md5 = require('md5'),
  SqlOperation = require('../tools/sqloperation1.js'),
  config = require('../tools/config.js')
sendEmail = require('../tools/email.js');

var router = express.Router(),
  SqlOperation = new SqlOperation();
//==================================================//Z
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
  var checkResult;
  var loginParams = {};
  //根据用户提交的信息来判断是利用邮件登录还是帐号登录
  if (validator.isEmail(req.body.username)) {
    checkResult = validator.isLength(req.body.password, 6, 15);
    loginParams = {
      email: req.body.username
    }
  } else {
    checkResult = validator.isAlphanumeric(req.body.username) && validator.isLength(req.body.password, 6, 15) && validator.isLength(req.body.username, 5, 10);
    loginParams = {
      username: req.body.username
    }
  }



  //登录信息格式校验
  //用户名不能为空，5-10个数字或英文字符
  //密码不能为空，6-15个数字或英文字符


  if (checkResult) {
    SqlOperation.findSpecify('users', loginParams, function(err, results) {
      //异常处理
      if (err) return next(err);

      if (results) {
        if (results.password == md5(req.body.password)) {
          var userInfo = results;
          //更新用户最近登录时间,非阻塞
          SqlOperation.update('users', {
            username: userInfo.username
          }, {
            "$set": {
              recently_time: Date.now()
            }
          }, function(err, results) {
            //异常处理
            if (err) return next(err);

            console.log("登录时间更新结果");
            console.log(results);
          });
          //移除旧的token并创建新的token
          SqlOperation.removeMany('tokens', {
            user_id: userInfo._id
          }, function(err, results) {
            //异常处理
            if (err) return next(err);
            if (results.result.ok == 1) {
              //为登陆成功的用户创建新的token
              var token = uuid.v4();
              SqlOperation.insert('tokens', {
                user_id: userInfo._id,
                token: token,
                create_time: Date.now(),
                delete_time: Date.now() + (86400000 * 7)
              }, function(err, results) {
                //异常处理
                if (err) return next(err);


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
    res.status(200).json(config.usersRes.status1010);
  }
});

//用户注册
router.post('/join', function(req, res, next) {
  //注册信息
  var joinInfo = {
    username: validator.escape(req.body.username),
    email: req.body.email,
    password: md5(req.body.password),
    register_time: Date.now(),
    role: 1,
    level: 0,
    status: 1
  };
  console.log("注册信息：");
  console.log(joinInfo);
  //注册信息格式校验
  //用户名不能为空，5-10个数字或英文字符
  //密码不能为空，6-15个数字或英文字符
  var joinCheckResult = validator.isAlphanumeric(joinInfo.username) && validator.isEmail(joinInfo.email) && validator.isLength(joinInfo.username, 5, 10) && validator.isLength(req.body.password, 6, 15);
  if (joinCheckResult) {
    console.log("格式通过");
    //检查用户和邮箱是否存在
    var findUserParams = {
      "$or": [{
        "username": req.body.username
      }, {
        "email": req.body.email
      }]
    }
    SqlOperation.findSpecify('users', findUserParams, function(err, results) {
      console.log("====检查用户是否存在====");
      //异常处理
      if (err) return next(err);

      console.log(results);

      if (results) {
        res.status(200).send(config.usersRes.status1005);
      } else {
        //注册用户
        SqlOperation.insert('users', joinInfo, function(err, results) {
          console.log("====注册用户====");
          //异常处理
          if (err) return next(err);
          console.log(results);
          if (results.result.ok == 1) {
            //注册用户信息
            var userJoinInfo = results.ops[0];
            //为注册用户创建root文件夹
            var rootInfo = {
              "user_id": SqlOperation.ObjectID(userJoinInfo._id),
              "title": "根目录",
              "describe": "在用户注册的时候，由系统自动创建，为所有文件夹的最底层容器",
              "sort": 99,
              "status": 1,
              "date": Date.now(),
            };
            SqlOperation.insert('folders', rootInfo, function(err, results) {
              if (err) return next(err);
              if (results.result.ok == 1) {
                //文件夹添加结果
                var folderAddInfo = results.ops[0];
                //更新用户根目录信息
                SqlOperation.update('users', {
                  _id: SqlOperation.ObjectID(userJoinInfo._id)
                }, {
                  "$set": {
                    root: folderAddInfo._id
                  }
                }, function(err, results) {
                  //异常处理
                  if (err) return next(err);
                  console.log("用默认文件夹添加结果");
                  console.log(results);
                  if (results.result.ok == 1) {
                    //为用户创建默认文件夹
                    var folderInfo = {
                      "user_id": SqlOperation.ObjectID(userJoinInfo._id),
                      "title": "默认文件夹",
                      "describe": "在用户注册的时候，由系统自动为用户创建的默认文件夹",
                      "sort": 99,
                      "status": 1,
                      "date": Date.now(),
                      "folder_id": SqlOperation.ObjectID(folderAddInfo._id)
                    };
                    SqlOperation.insert('folders', folderInfo, function(err, results) {
                      if (err) return next(err);
                      if (results.result.ok == 1) {
                        //默认文件夹添加结果
                        //向注册用户发送邮件
                        // var mailOptions = {
                        //   from: '####@###.###',
                        //   to: joinInfo.email,
                        //   subject: 'Hello ' + joinInfo.username,
                        //   text: 'Welcome to join our NetMarks !',
                        //   html: '<b>Thank you !</b>'
                        // };
                        // sendEmail(mailOptions, function(results) {
                        //   console.log(results);
                        // })
                        res.status(200).send(config.usersRes.status1000);
                      } else {
                        res.status(200).send(config.serverRes.status5001);
                      }
                    });
                  } else {
                    res.status(200).send(config.serverRes.status5001);
                  }
                });

              } else {
                res.status(200).send(config.serverRes.status5001);
              }
            })

          } else {
            res.status(200).send(config.serverRes.status5001);
          }
        });
      }
    });
  } else {
    console.log("注册格式不对");
    res.status(200).json(config.usersRes.status1010);
  }
});
//获得所有用户信息
router.get('/', function(req, res, next) {
  SqlOperation.findAll('users', function(err, results) {
    console.log("====获取所有用户信息====");
    //异常处理
    if (err) return next(err);

    config.usersRes.status1000.data = results;
    res.status(200).json(config.usersRes.status1000);
  });
});

//获得所有用户信息
router.get('/all', function(req, res, value, next) {
  //console.log(ss);
});

//通过用户ID和token获取用户信息
router.get('/:id', function(req, res, next) {
  var userId = SqlOperation.ObjectID(req.params.id);
  var token = req.query.token;
  var nowTime = Date.now();
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
//更新个人信息
router.put('/:id', function(req, res, next) {

  //格式校验
  var check = validator.isMongoId(req.params.id) && validator.isUUID(req.body.token, 4) && validator.isLength(req.body.password, 6, 15);
  if (check) {
    var user_id = SqlOperation.ObjectID(req.params.id);
    SqlOperation.findSpecify('tokens', {
      user_id: user_id
    }, function(err, results) {
      if (err) return next(err);
      if (results) {
        if (results.token == req.body.token && Date.now() <= results.delete_time) {
          //更新操作
          SqlOperation.update('users', {
            _id: user_id
          }, {
            "$set": {
              password: md5(req.body.password)
            }
          }, function(err, results) {
            if (err) return next(err);
            if (results.result.ok == 1) {
              res.status(200).send(config.usersRes.status1000);
            } else {
              res.status(200).send(config.usersRes.status1014);
            }
          })
        } else {
          //token无效
          res.status(200).send(config.tokenRes.status2003);
        }
      } else {
        //token不存在
        res.status(200).send(config.tokenRes.status2002);
      }
    });
  } else {
    res.status(200).send(config.usersRes.status1010);
  }
});
module.exports = router;
