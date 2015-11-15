var express = require('express');
var fs = require('fs');
var app = express();
var router = express.Router();
// router.get('/', function(req, res) {
//         res.render('index', { title: 'index' });
//   });
app.get('/', function(req, res) {
  //res.send('hello world');
  fs.readFile('../../app/index.html', 'utf-8', function(err, data) {
    if (err) res.send(err);
    res.send(data);
  });
});

app.listen(3000);
