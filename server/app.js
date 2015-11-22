var express = require('express'),
  users = require('./routes/users'),
  config = require('./config/config.js'),
  writeLog = require('./config/log.js');
var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use('/users', users);

app.use(function(err, req, res, next) {
  if (err) {
    console.log("=====异常捕获====");
    console.error(err);
    writeLog(process.cwd() + '\\log', err+'\r\n', function(err) {
      if (!err) {
        console.log("异常写入完成");
      } else {
        console.log("异常写入失败");
        console.log(err);
      }
    });
    res.status(200).json(config.serverRes.status5001);
  }
  next();
});

app.listen(3000);
