var cluster = require('cluster'),
  numCPUs = require('os').cpus().length,
  writeLog = require('./tools/log.js'),
  sendEmail = require('./tools/email.js');

if (cluster.isMaster) {
  console.log('[master] ' + "start master...");

  for (var i = 0; i < numCPUs; i++) {
    var wk = cluster.fork();
    wk.send('[master] ' + 'hi  I am worker' + wk.id);
  }

  cluster.on('fork', function(worker) {
    console.log('[master] ' + 'fork: worker' + worker.id);
  });

  cluster.on('online', function(worker) {
    console.log('[master] ' + 'online: worker' + worker.id);
  });

  cluster.on('listening', function(worker, address) {
    console.log('[master] ' + 'listening: worker' + worker.id + ',pid:' + worker.process.pid + ', Address:' + address.address + ":" + address.port);
  });

  cluster.on('disconnect', function(worker) {
    console.log('[master] ' + 'disconnect: worker' + worker.id);
  });

  cluster.on('exit', function(worker, code, signal) {
    console.log('[master] ' + 'exit worker' + worker.id + ' died');
    if (signal) {
      //  发送邮件通知错
      // var mailOptions = {
      //   from: '####@###.###',
      //   to: '####@###.###',
      //   subject: 'SERVER WOKERS ERROR',
      //   text: '服务器进程退出，请检查',
      //   html: '<b>服务器进程退出，请检查</b>'
      // };
      // sendEmail(mailOptions, function(results) {
      //   console.log(results);
      // })
    }
    writeLog(process.cwd() + '\\server\\log', worker.id + '进程退出' + '\r\n', function(err) {
      if (!err) {
        console.log("进程退出异常写入完成");
      } else {
        console.error("进程退出异常写入失败");
        console.error(err);
      }

    });
    setTimeout(function() {
      cluster.fork();
    }, 2000);
  });

  function eachWorker(callback) {
    for (var id in cluster.workers) {
      callback(cluster.workers[id]);
    }
  };

  setTimeout(function() {
    eachWorker(function(worker) {
      worker.send('[master] ' + 'send message to worker' + worker.id);
    });
  }, 3000);

  Object.keys(cluster.workers).forEach(function(id) {
    cluster.workers[id].on('message', function(msg) {
      console.log('[master] ' + 'message ' + msg);
    });
  });

} else if (cluster.isWorker) {
  console.log('[worker] ' + "start worker ..." + cluster.worker.id);
  process.on('message', function(msg) {
    console.log('[worker] ' + msg);
    process.send('[worker] worker' + cluster.worker.id + ' received!');
  });
  require('./app');
}
