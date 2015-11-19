//require
var MongoClient = require('mongodb').MongoClient,
  assert = require('assert'),
  mongodb = require('mongodb'),
  config = require('../config/config.js');

//connetction url
var url = config.db.uri + ':' + config.db.port;
//exports
var SqlOperation = function() {};
module.exports = SqlOperation;

//exports function
SqlOperation.prototype.ObjectID = function(id) {
  return mongodb.ObjectID(id);
}
SqlOperation.prototype.insert = function(collectionName, insertString, callback) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("\033[36m" + "Connected correctly to server" + "/\033[39m");
    insert(db, collectionName, insertString, function(err, results) {
      db.close();
      callback(err, results);
    });
  });
};
SqlOperation.prototype.update = function(collectionName, queryString, updateString, callback) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("\033[36m" + "Connected correctly to server" + "/\033[39m");
    update(db, collectionName, queryString, updateString, function(err, results) {
      db.close();
      callback(err, results);
    })
  });
};
SqlOperation.prototype.replace = function(collectionName, queryString, replaceString, callback) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("\033[36m" + "Connected correctly to server" + "/\033[39m");
    replaceOne(db, collectionName, queryString, replaceString, function(err, results) {
      db.close();
      callback(err, results);
    })
  });
};
SqlOperation.prototype.findAll = function(collectionName, callback) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("\033[36m" + "Connected correctly to server" + "/\033[39m");
    findAll(db, collectionName, function(err, results) {
      db.close();
      callback(err, results);
    })
  });
};
SqlOperation.prototype.findSpecify = function(collectionName, queryString, callback) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("\033[36m" + "Connected correctly to server" + "/\033[39m");
    findSpecify(db, collectionName, queryString, function(err, results) {
      db.close();
      callback(err, resultS);
    })
  });
};
SqlOperation.prototype.removeOne = function(collectionName, queryString, callback) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("\033[36m" + "Connected correctly to server" + "/\033[39m");
    removeOne(db, collectionName, queryString, function(err, results) {
      db.close();
      callback(err, resultS);
    })
  });
};
SqlOperation.prototype.removeMany = function(collectionName, queryString, callback) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("\033[36m" + "Connected correctly to server" + "/\033[39m");
    removeMany(db, collectionName, queryString, function(err, results) {
      db.close();
      callback(err, resultS);
    })
  });
};
//=================Global Function======================//
//insert
var insert = function(db, collectionName, insertString, callback) {
  var collection = db.collection(collectionName);
  collection.insert(insertString, function(err, results) {
    assert.equal(err, null);
    //console.log("Inserted " + insertString.length + " document into the " + collectionName + " collection");
    callback(err, resultS);
  });
}
var insertDocument = function(db, collectionName, insertString, callback) {
  var collection = db.collection(collectionName);
  collection.insertOne(insertString, function(err, resultS) {
    assert.equal(err, null);
    console.log("Inserted a document into the " + collectionName + " collection");
    //console.log(resultS);
    callback(err, resultS);
  });
}
var insertDocuments = function(db, collectionName, insertString, callback) {
    var collection = db.collection(collectionName);
    collection.insertMany(insertString, function(err, resultS) {
      assert.equal(err, null);
      console.log("Inserted " + insertString.length + " documents into the " + collectionName + " collection");
      //console.log(resultS);
      callback(err, resultS);
    });
  }
  //find
var findAll = function(db, collectionName, callback) {
  var returnResult = [];
  var cursor = db.collection(collectionName).find();
  console.log("find all documents in " + collectionName + " collection");
  cursor.each(function(err, result) {
    assert.equal(err, null);
    if (result != null) {
      //console.log(result);
      returnResult.push(result);
    } else {
      callback(err, returnResult);
    }
  });
};
var findSpecify = function(db, collectionName, queryString, callback) {
  var returnResult;
  //var objectId = new mongo.ObjectID(queryString._id);
  var cursor = db.collection(collectionName).find(queryString);
  console.log("find " + queryString + " documents in " + collectionName + " collection");
  cursor.each(function(err, results) {
    assert.equal(err, null);
    if (results != null) {
      //console.log(results);
      returnResult = results
    } else {
      callback(err, returnResult);
    }
  });
};
//update
var update = function(db, collectionName, queryString, updateString, callback) {
  db.collection(collectionName).update(
    queryString,
    updateString,
    function(err, results) {
      //console.log(results);
      callback(err, results);
    });
};
var updateSpecify = function(db, collectionName, queryString, updateString, callback) {
  db.collection(collectionName).updateOne(
    queryString,
    updateString,
    function(err, results) {
      //console.log(results);
      callback(err, results);
    });
};
var updateMany = function(db, collectionName, queryString, updateString, callback) {
  db.collection(collectionName).updateMany(
    queryString,
    updateString,
    function(err, results) {
      //console.log(results);
      callback(err, results);
    });
};
var replaceOne = function(db, collectionName, queryString, replaceString, callback) {
  db.collection(collectionName).replaceOne(
    queryString,
    replaceString,
    function(err, results) {
      callback(err, results);;
    });
};
//delete
var removeOne = function(db, collectionName, queryString, callback) {
  db.collection(collectionName).deleteOne(
    queryString,
    function(err, results) {
      callback(err, results);
    });
};
var removeMany = function(db, collectionName, queryString, callback) {
  db.collection(collectionName).deleteMany(
    queryString,
    function(err, results) {
      callback(err, results);
    });
};
