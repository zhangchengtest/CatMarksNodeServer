var express = require('express'),
  users = require('./routes/users'),
  domain = require('domain'),
  config = require('./config/config.js');
var app = express();
//var server = require('http').create(app);
app.use('/users', users);
app.listen(3000);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
// //异常处理
// app.use(function(err, req, res, next) {
//   console.log("====异常发生====");
//   console.log(err);
//   // 带有四个参数的 middleware 专门用来处理异常
//   res.render(500, err.stack);
// });
// 使用 domain 来捕获大部分异常
// app.use(function(req, res, next) {
//
//   var reqDomain = domain.create();
//   reqDomain.on('error', function(err) {
//     console.log("====进入domain的异常====");
//     console.log(err);
//     try {
//       var killTimer = setTimeout(function() {
//         process.exit(1);
//       }, 30000);
//       killTimer.unref();
//       //server.close();
//       res.status(500).json(config.serverRes.status5001);
//     } catch (e) {
//       console.log('error when exit', e.stack);
//     }
//   });
//   reqDomain.run(next);
// });

// uncaughtException 避免程序崩溃
process.on('uncaughtException', function(err) {
  console.log("=====uncaughtException====");
  console.log(err);

  // try {
//   var killTimer = setTimeout(function() {
//     process.exit(1);
//   }, 30000);
//   killTimer.unref();
//
//   //server.close();
// } catch (e) {
//   console.log('error when exit', e.stack);
// }
});
