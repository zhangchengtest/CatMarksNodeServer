var express = require('express'),
  bodyParser = require('body-parser'),
  validator = require('validator'),
  SqlOperation = require('../tools/sqloperation1.js'),
  config = require('../tools/config.js');

var router = express.Router(),
  SqlOperation = new SqlOperation();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));
//获取所有书签
router.get('/', function(req, res, next) {
  var user_id = SqlOperation.ObjectID(req.query.user_id);
  //格式校验
  var check = validator.isMongoId(req.query.user_id) && validator.isUUID(req.query.token, 4);
  if (check) {
    SqlOperation.findSpecify('tokens', {
      user_id: user_id
    }, function(err, results) {
      if (err) return next(err);
      if (results) {
        if (results.token == req.query.token && Date.now() <= results.delete_time) {
          SqlOperation.distinct('marks', {
            user_id: user_id
          }, "tags", function(err, results) {
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
  }
});
//获取文件夹下所有书签
router.get('/marks/:tag', function(req, res, next) {
  var user_id = SqlOperation.ObjectID(req.query.user_id);
  var tag = new RegExp(req.params.tag);
  //格式校验
  var check = validator.isMongoId(req.query.user_id)&& validator.isUUID(req.query.token, 4);
  if (check) {
    SqlOperation.findSpecify('tokens', {
      user_id: user_id
    }, function(err, results) {
      if (err) return next(err);
      if (results) {

        if (results.token == req.query.token && Date.now() <= results.delete_time) {
          SqlOperation.findMany('marks', {
              user_id: user_id,
              tags: tag
            },
            function(err, results) {
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
  }
});
module.exports = router;
