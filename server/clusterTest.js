// var express = require('express'),
//   users = require('./routes/users'),
//   domain = require('domain'),
//   config = require('./config/config.js');
// var app = express();
// //var server = require('http').create(app);
// app.use('/users', users);
// app.listen(3000);
//
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });
// // //异常处理
// // app.use(function(err, req, res, next) {
// //   console.log("====异常发生====");
// //   console.log(err);
// //   // 带有四个参数的 middleware 专门用来处理异常
// //   res.render(500, err.stack);
// // });
// // 使用 domain 来捕获大部分异常
// // app.use(function(req, res, next) {
// //
// //   var reqDomain = domain.create();
// //   reqDomain.on('error', function(err) {
// //     console.log("====进入domain的异常====");
// //     console.log(err);
// //     try {
// //       var killTimer = setTimeout(function() {
// //         process.exit(1);
// //       }, 30000);
// //       killTimer.unref();
// //       //server.close();
// //       res.status(500).json(config.serverRes.status5001);
// //     } catch (e) {
// //       console.log('error when exit', e.stack);
// //     }
// //   });
// //   reqDomain.run(next);
// // });
//
// // uncaughtException 避免程序崩溃
// process.on('uncaughtException', function(err) {
//   console.log("=====uncaughtException====");
//   console.log(err);
//
//   // try {
// //   var killTimer = setTimeout(function() {
// //     process.exit(1);
// //   }, 30000);
// //   killTimer.unref();
// //
// //   //server.close();
// // } catch (e) {
// //   console.log('error when exit', e.stack);
// // }
// });
// var cluster = require('cluster');
// var http = require('http');
// var numCPUs = require('os').cpus().length;
// if (cluster.isMaster) {
//   console.log("====Master start====");
//   for (var i = 0; i < numCPUs; i++) {
//     //console.log(i);
//     cluster.fork();
//   }
//   cluster.on('listening', function(worker, address) {
//     console.log('listening: worker ' + worker.process.pid + ', Address: ' + address.address + ":" + address.port);
//     //关闭worker
//     worker.disconnect();
//   });
//   cluster.on('online', function() {
//     console.log('worker  is online');
//   });
//   cluster.on('disconnect', function() {
//     console.log("worker disconnect");
//   });
//   cluster.on('exit', function(worker, code, signal) {
//     console.log('worker ' + worker.process.pid + ' died');
//   });
// } else {
//   http.createServer(function(req, res) {
//     res.writeHead(200);
//     res.end("hello world\n");
//   }).listen(0);
// }
// var cluster = require('cluster');
// var http = require('http');
// var numCPUs = require('os').cpus().length;
//
// if (cluster.isMaster) {
//   console.log('[master] ' + "start master...");
//
//   for (var i = 0; i < numCPUs; i++) {
//     var wk = cluster.fork();
//     wk.send('[master] ' + 'hi  I am worker' + wk.id);
//   }
//
//   cluster.on('fork', function(worker) {
//     console.log('[master] ' + 'fork: worker' + worker.id);
//   });
//
//   cluster.on('online', function(worker) {
//     console.log('[master] ' + 'online: worker' + worker.id);
//   });
//
//   cluster.on('listening', function(worker, address) {
//     console.log('[master] ' + 'listening: worker' + worker.id + ',pid:' + worker.process.pid + ', Address:' + address.address + ":" + address.port);
//   });
//
//   cluster.on('disconnect', function(worker) {
//     console.log('[master] ' + 'disconnect: worker' + worker.id);
//   });
//
//   cluster.on('exit', function(worker, code, signal) {
//     console.log('[master] ' + 'exit worker' + worker.id + ' died');
//   });
//
//   function eachWorker(callback) {
//     for (var id in cluster.workers) {
//       callback(cluster.workers[id]);
//     }
//   }
//
//   setTimeout(function() {
//     eachWorker(function(worker) {
//       worker.send('[master] ' + 'send message to worker' + worker.id);
//     });
//   }, 3000);
//
//   Object.keys(cluster.workers).forEach(function(id) {
//     cluster.workers[id].on('message', function(msg) {
//       console.log('[master] ' + 'message ' + msg);
//     });
//   });
//
// } else if (cluster.isWorker) {
//   console.log('[worker] ' + "start worker ..." + cluster.worker.id);
//
//   process.on('message', function(msg) {
//     console.log('[worker] ' + msg);
//     process.send('[worker] worker' + cluster.worker.id + ' received!');
//   });
//
//   http.createServer(function(req, res) {
//     res.writeHead(200, {
//       "content-type": "text/html"
//     });
//     res.end('worker' + cluster.worker.id + ',PID:' + process.pid);
//   }).listen(3000);
// }
var cluster = require('cluster');
var http = require('http');
var numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log('[master] ' + "start master...");

  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('listening', function(worker, address) {
    console.log('[master] ' + 'listening: worker' + worker.id + ',pid:' + worker.process.pid + ', Address:' + address.address + ":" + address.port);
  });

} else if (cluster.isWorker) {
  console.log('[worker] ' + "start worker ..." + cluster.worker.id);
  http.createServer(function(req, res) {
    console.log('worker' + cluster.worker.id);
    res.end('worker' + cluster.worker.id + ',PID:' + process.pid);
  }).listen(4000);
}
