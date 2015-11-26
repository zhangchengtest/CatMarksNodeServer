var express = require('express'),
  bodyParser = require('body-parser'),
  validator = require('validator'),
  SqlOperation = require('../mongodb/sqloperation.js'),
  config = require('../config/config.js');

var router = express.Router(),
  SqlOperation = new SqlOperation();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));

//添加文件夹
router.post('/', function(req, res, next) {
  var folderInfo = {
    "user_id": SqlOperation.ObjectID(req.body.user_id),
    "title": validator.escape(req.body.title),
    "describe": validator.escape(req.body.describe),
    "sort": 99,
    "status": 1,
    "date": Date.now() / 1000,
    "folder_id": req.body.folder_id,
  };
  //检查提交的格式
  var check1 = validator.isMongoId(folderInfo.user_id),
    check2 = validator.isUUID(req.body.token, 4);
  //判断token是否有效并且属于该用户
  if (check1 && check2) {
    SqlOperation.findSpecify('tokens', {
      user_id: folderInfo.user_id
    }, function(err, results) {
      if (err) return next(err);
      if (results) {
        if (results.token == req.body.token && folderInfo.date <= results.delete_time) {
          //检查文件夹是不是已经存在了
          SqlOperation.findSpecify('folders', {
            title: folderInfo.title
          }, function(err, results) {
            if (err) return next(err);
            if (results) {
              res.status(200).send(config.folderRes.status4002);
            } else {
              SqlOperation.insert('folders', folderInfo, function(err, results) {
                if (err) return next(err);
                if (results.result.ok == 1) {
                  res.status(200).send(config.folderRes.status4000);
                } else {
                  res.status(200).send(config.serverRes.status5001);
                }
              })
            }
          });

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
    res.status(200).send(config.folderRes.status4001);
    console.log("文件夹校验结果");
    console.log(check1 + " " + check2);
  }
});
//获取指定文件夹
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
        if (results.token == req.query.token && Date.now() / 1000 <= results.delete_time) {
          SqlOperation.findSpecify('folders', {
            _id: SqlOperation.ObjectID(req.params.id)
          }, function(err, results) {
            if (err) return next(err);
            if (results) {
              config.folderRes.status4000.data = results;
              res.status(200).send(config.folderRes.status4000);
              config.folderRes.status4000.data = null;
            } else {
              config.folderRes.status4000.data = "";
              res.status(200).send(config.folderRes.status4000);
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
    res.status(200).send(config.folderRes.status4001);
    console.log("文件夹校验结果");
    console.log(check1 + " " + check2);
  }

});
//获取所有文件夹
router.get('/', function(req, res, next) {
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
        if (results.token == req.query.token && Date.now() / 1000 <= results.delete_time) {
          SqlOperation.findMany('folders', {
            user_id: user_id
          }, function(err, results) {
            if (err) return next(err);
            if (results) {
              config.folderRes.status4000.data = results;
              res.status(200).send(config.folderRes.status4000);
              config.folderRes.status4000.data = null;
            } else {
              config.folderRes.status4000.data = "";
              res.status(200).send(config.folderRes.status4000);
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
    res.status(200).send(config.folderRes.status4001);
    console.log("文件夹校验结果");
    console.log(check1 + " " + check2);
  }
});
//更新文件夹
router.put('/:id', function(req, res, next) {
  var folderInfo = {
      "title": validator.escape(req.body.title),
      "describe": validator.escape(req.body.describe),
      "sort": req.body.sort,
      "status": req.body.status,
      "folder_id": req.body.folder_id,
    },
    updateInfo = {};

  //将不为空的内容组成新的json字段
  for (var key in folderInfo) {
    if (folderInfo[key] != "") {
      updateInfo[key] = folderInfo[key]
    }
  }

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
        if (results.token == req.body.token && Date.now() / 1000 <= results.delete_time) {
          //更新操作
          SqlOperation.update('folders', {
            _id: SqlOperation.ObjectID(req.params.id)
          }, {
            "$set": updateInfo
          }, function(err, results) {
            if (err) return next(err);
            if (results.result.ok == 1) {
              res.status(200).send(config.folderRes.status4000);
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
    res.status(200).send(config.folderRes.status4001);
    console.log("文件夹校验结果");
    console.log(check1 + " " + check2);
  }
});
module.exports = router;
