// var express = require('express'),
//   bodyParser = require('body-parser'),
//   validator = require('validator'),
//   SqlOperation = require('../mongodb/sqloperation.js'),
//   config = require('../config/config.js');
//
// var router = express.Router(),
//   SqlOperation = new SqlOperation();
//
// router.use(bodyParser.json());
// router.use(bodyParser.urlencoded({
//   extended: true
// }));
//
// //添加书签
// router.post('/', function(req, res, next) {
//
//   var markInfo = {
//     user_id: req.body.user_id,
//     title: req.body.title,
//     uri: req.body.uri,
//     describe: req.body.describe,
//     content: req.body.content,
//     tag: req.body.tag,
//     sort: req.body.sort,
//     status: 1,
//     date: Date.now() / 1000,
//     mark_id: SqlOperation.ObjectID(req.body.mark_id),
//   };
//   //检查提交的格式
//
//   //判断token是否有效并且属于该用户
//   SqlOperation.findSpecify('tokens', {
//     user_id: markInfo.user_id
//   }, function(err, results) {
//     if (err) return next(err);
//     if (results) {
//       if (results.token == req.body.token && markInfo.date <= results.delete_time) {
//         SqlOperation.insert('marks', markInfo, function(err, results) {
//           if (err) return next(err);
//           if (results.result.ok == 1) {
//             res.status(200).send(config.markRes.status3000);
//           } else {
//             res.status(200).send(config.serverRes.status5001);
//           }
//         })
//       } else {
//         //token已失效
//         res.status(200).send(config.tokenRes.status2003);
//       }
//     } else {
//       //token不存在
//       res.status(200).send(config.tokenRes.status2002);
//     }
//   });
// });
// module.exports = router;
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

//添加书签
router.post('/', function(req, res, next) {
  var markInfo = {
    "user_id": SqlOperation.ObjectID(req.body.user_id),
    "folder_id": SqlOperation.ObjectID(req.body.folder_id),
    "title": validator.escape(req.body.title),
    "uri": validator.escape(req.body.uri),
    "describe": validator.escape(req.body.describe),
    "content": req.body.content,
    "tag": req.body.tag,
    "sort": 99,
    "status": 1,
    "date": Date.now() / 1000
  };
  //检查提交的格式
  var check1 = validator.isMongoId(markInfo.user_id),
    check2 = validator.isUUID(req.body.token, 4);
  //判断token是否有效并且属于该用户
  if (check1 && check2) {
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
        if (results.token == req.query.token && Date.now() / 1000 <= results.delete_time) {
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
  if (check1 && check2) {
    SqlOperation.findSpecify('tokens', {
      user_id: user_id
    }, function(err, results) {
      if (err) return next(err);
      if (results) {
        if (results.token == req.query.token && Date.now() / 1000 <= results.delete_time) {
          SqlOperation.findMany('marks', {
            user_id: user_id
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
//更新书签
router.put('/:id', function(req, res, next) {
  var markInfo = {
      "folder_id": SqlOperation.ObjectID(req.body.folder_id),
      "title": validator.escape(req.body.title),
      "uri": validator.escape(req.body.uri),
      "describe": validator.escape(req.body.describe),
      "content": req.body.content,
      "tag": req.body.tag,
      "sort": req.body.sort,
      "status": req.body.status,
      "date": Date.now() / 1000
    },
    updateInfo = {};

  //将不为空的内容组成新的json字段
  for (var key in markInfo) {
    if (markInfo[key] != "") {
      updateInfo[key] = markInfo[key]
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