var express = require('express'),
  bodyParser = require('body-parser'),
  validator = require('validator'),
  SqlOperation = require('../tools/sqloperation1.js'),
  config = require('../tools/config.js'),
  read = require('node-readability');

var router = express.Router(),
  SqlOperation = new SqlOperation();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));

//添加书签
router.post('/', function(req, res, next) {
  var markInfo = {
    "user_id": SqlOperation.ObjectID(req.body.user_id),
    "folder_id": SqlOperation.ObjectID(req.body.folder_id),
    "title": validator.escape(req.body.title),
    "uri": req.body.uri,
    "describe": validator.escape(req.body.describe),
    //"content": req.body.content,
    //"tags": req.body.tags.split("#"),
    "tags": req.body.tags,
    "sort": Number(req.body.sort),
    "status": 1,
    "date": Date.now()
  };
  console.log("用户提交的书签信息");
  console.log(markInfo);
  //检查提交的格式
  var check = validator.isMongoId(markInfo.user_id) && validator.isUUID(req.body.token, 4);
  //判断token是否有效并且属于该用户
  if (check && req.body.title != "") {
    SqlOperation.findSpecify('tokens', {
      user_id: markInfo.user_id
    }, function(err, results) {
      if (err) return next(err);
      if (results) {
        if (results.token == req.body.token && markInfo.date <= results.delete_time) {
          //检查书签是不是已经存在了
          // SqlOperation.findSpecify('marks', {
          //   title: markInfo.title
          // }, function(err, results) {
          //   if (err) return next(err);
          //   if (results) {
          //     res.status(200).send(config.markRes.status3002);
          //   } else {
          //
          //   }
          // });
          SqlOperation.insert('marks', markInfo, function(err, results) {
            if (err) return next(err);
            if (results.result.ok == 1) {

              //抓取内容填充
              read(req.body.uri, function(err, article, meta) {
                if (err) return next(err);
                //更新操作
                SqlOperation.update('marks', {
                  _id: SqlOperation.ObjectID(results.ops[0]._id)
                }, {
                  "$set": {
                    content: article.content
                  }
                }, function(err, results) {
                  article.close();
                  if (err) return next(err);
                })
              });
              res.status(200).send(config.markRes.status3000);
            } else {
              res.status(200).send(config.serverRes.status5001);
            }
          })
        } else {
          //token已失效
          res.status(200).send(config.tokenRes.status2003);
        }
      } else {
        //token不存在
        res.status(200).send(config.tokenRes.status2002);
      }
    });
  } else {
    res.status(200).send(config.markRes.status3001);
    console.log("书签校验结果");
    console.log(check1 + " " + check2);
  }
});
//获取指定书签
router.get('/:id', function(req, res, next) {
  var user_id = SqlOperation.ObjectID(req.query.user_id);
  //格式校验
  var check1 = validator.isMongoId(req.query.user_id),
    check2 = validator.isUUID(req.query.token, 4);
  if (check1 && check2) {
    SqlOperation.findSpecify('tokens', {
      user_id: user_id
    }, function(err, results) {
      if (err) return next(err);
      if (results) {
        if (results.token == req.query.token && Date.now() <= results.delete_time) {
          SqlOperation.findSpecify('marks', {
            _id: SqlOperation.ObjectID(req.params.id)
          }, function(err, results) {
            if (err) return next(err);
            if (results) {
              config.markRes.status3000.data = results;
              res.status(200).send(config.markRes.status3000);
              config.markRes.status3000.data = null;
            } else {
              config.markRes.status3000.data = "";
              res.status(200).send(config.markRes.status3000);
            }
          })
        } else {
          //token已失效
          res.status(200).send(config.tokenRes.status2003);
        }
      } else {
        //token不存在
        res.status(200).send(config.tokenRes.status2002);
      }
    });
  } else {
    res.status(200).send(config.markRes.status3001);
    console.log("书签校验结果");
    console.log(check1 + " " + check2);
  }

});
//获取所有书签
router.get('/', function(req, res, next) {
  var user_id = SqlOperation.ObjectID(req.query.user_id);
  //格式校验
  var check1 = validator.isMongoId(req.query.user_id),
    check2 = validator.isUUID(req.query.token, 4);
  var sortInfo = {
    sort: 1,
    date: -1
  };
  if (check1 && check2) {
    SqlOperation.findSpecify('tokens', {
      user_id: user_id
    }, function(err, results) {
      if (err) return next(err);
      if (results) {
        if (results.token == req.query.token && Date.now() <= results.delete_time) {
          SqlOperation.sort('marks', {
            user_id: user_id,
            status: 1
          }, sortInfo, function(err, results) {
            if (err) return next(err);
            if (results) {
              config.markRes.status3000.data = results;
              res.status(200).send(config.markRes.status3000);
              config.markRes.status3000.data = null;
            } else {
              config.markRes.status3000.data = "";
              res.status(200).send(config.markRes.status3000);
            }
          })
        } else {
          //token已失效
          res.status(200).send(config.tokenRes.status2003);
        }
      } else {
        //token不存在
        res.status(200).send(config.tokenRes.status2002);
      }
    });
  } else {
    res.status(200).send(config.markRes.status3001);
    console.log("书签校验结果");
    console.log(check1 + " " + check2);
  }
});
//更新书签
router.put('/:id', function(req, res, next) {
  var markInfo = {
      "folder_id": SqlOperation.ObjectID(req.body.folder_id),
      "title": validator.escape(req.body.title),
      "uri": req.body.uri,
      "describe": validator.escape(req.body.describe),
      //"content": req.body.content,
      "tags": req.body.tags,
      "sort": Number(req.body.sort),
      "status": Number(req.body.status),
      "date": Date.now()
    },
    updateInfo = {};

  //将不为空的内容组成新的json字段
  for (var key in markInfo) {
    if (markInfo[key] != "" || markInfo[key] == 0) {
      updateInfo[key] = markInfo[key]
    }
  }
  console.log("书签更新");
  console.log(updateInfo);
  var user_id = SqlOperation.ObjectID(req.body.user_id);
  //格式校验
  var check1 = validator.isMongoId(req.body.user_id),
    check2 = validator.isUUID(req.body.token, 4);

  if (check1 && check2) {
    SqlOperation.findSpecify('tokens', {
      user_id: user_id
    }, function(err, results) {

      if (err) return next(err);
      if (results) {
        if (results.token == req.body.token && Date.now() <= results.delete_time) {
          //更新操作
          SqlOperation.update('marks', {
            _id: SqlOperation.ObjectID(req.params.id)
          }, {
            "$set": updateInfo
          }, function(err, results) {

            if (err) return next(err);
            if (results.result.ok == 1) {
              res.status(200).send(config.markRes.status3000);
            } else {
              res.status(200).send(config.serverRes.status5001);
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
    res.status(200).send(config.markRes.status3001);
    console.log("书签校验结果");
    console.log(check1 + " " + check2);
  }
});
module.exports = router;
