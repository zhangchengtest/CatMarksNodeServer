var fs = require('fs'),
  moment = require('moment');
//日志
var writeLog = function(path, content, callback) {
  content = content + "----" + Date.now();
  var filePath = path + '\\' + moment().format('YYYY-MM-DD') + '.log';
  fs.stat(path, function(err, stats) {
    //判断路径是不是存在
    if (!err) {
      //判断文件存不存在
      fs.stat(filePath, function(err, stats) {
        if (!err) {

          fs.appendFile(filePath, content, function(err) {
            callback(err);
          });
        } else if (err.code == "ENOENT") {

          fs.writeFile(filePath, content, function(err) {
            callback(err);
          });
        } else {
          callback(err);
        }
      })
    } else if (err.code == "ENOENT") {

      //创建目录+文件+写入内容
      fs.mkdir(path, function(err) {
        fs.writeFile(filePath, content, function(err) {
          callback(err);
        });
      })
    } else {
      callback(err);
    }
  });
};
module.exports = writeLog;
