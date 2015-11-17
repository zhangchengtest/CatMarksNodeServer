var express = require('express'),
  SqlOperation = require('../../local_modules/mongodb/sqloperation.js');

var router = express.Router();
var SqlOperation = new SqlOperation();

//get userinfo by id;
router.get('/:id', function(req, res, value) {

  SqlOperation.findSpecify('users', {
    _id: SqlOperation.ObjectID(req.params.id)
  }, function(result) {
    res.status(200).send(result);
  });
});
//get all userinfo
router.get('/', function(req, res, value) {
  SqlOperation.findAll('users', function(results) {
    res.status(200).json(results);
  });
});
router.post('/add', function(req, res) {
  res.send('POST handler for /users/add route.');
});

module.exports = router;
