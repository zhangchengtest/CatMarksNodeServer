//require
var MongoClient = require('mongodb').MongoClient,
  assert = require('assert'),
  mongodb = require('mongodb'),
  config = require('./config.js');
var url = config.db.uri_easy;
var SqlOperation = function() {};
module.exports = SqlOperation;

SqlOperation.prototype.ObjectID = function(id) {
  return mongodb.ObjectID(id);
}

MongoClient.connect(url, function(err, db) {
  SqlOperation.prototype.distinct = function(collectionName, queryString, distinctString, callback) {
    distinct(db, collectionName, queryString, distinctString, function(err, results) {
      callback(err, results);
    })
  };
  SqlOperation.prototype.sort = function(collectionName, queryString, sortString, callback) {
    sort(db, collectionName, queryString, sortString, function(err, results) {
      callback(err, results);
    })
  };
  SqlOperation.prototype.removeOne = function(collectionName, queryString, callback) {
    removeOne(db, collectionName, queryString, function(err, results) {
      callback(err, results);
    })
  };
  SqlOperation.prototype.removeMany = function(collectionName, queryString, callback) {
    removeMany(db, collectionName, queryString, function(err, results) {
      callback(err, results);
    })
  };
});
MongoClient.connect(url, function(err, db) {
  SqlOperation.prototype.insert = function(collectionName, insertString, callback) {
    insert(db, collectionName, insertString, function(err, results) {
      callback(err, results);
    });
  };
  SqlOperation.prototype.update = function(collectionName, queryString, updateString, callback) {
    update(db, collectionName, queryString, updateString, function(err, results) {
      callback(err, results);
    })
  };
  SqlOperation.prototype.replace = function(collectionName, queryString, replaceString, callback) {
    replaceOne(db, collectionName, queryString, replaceString, function(err, results) {
      callback(err, results);
    })
  };
  SqlOperation.prototype.findAll = function(collectionName, callback) {
    findAll(db, collectionName, function(err, results) {
      callback(err, results);
    })
  };
  SqlOperation.prototype.findSpecify = function(collectionName, queryString, callback) {
    findSpecify(db, collectionName, queryString, function(err, results) {
      callback(err, results);
    })
  };
  SqlOperation.prototype.findMany = function(collectionName, queryString, callback) {
    findMany(db, collectionName, queryString, function(err, results) {
      callback(err, results);
    })
  };

});
//=================Global Function======================//
//insert
var insert = function(db, collectionName, insertString, callback) {
  var collection = db.collection(collectionName);
  collection.insert(insertString, function(err, results) {
    callback(err, results);
  });
}
var insertDocument = function(db, collectionName, insertString, callback) {
  var collection = db.collection(collectionName);
  collection.insertOne(insertString, function(err, results) {
    callback(err, results);
  });
}
var insertDocuments = function(db, collectionName, insertString, callback) {
    var collection = db.collection(collectionName);
    collection.insertMany(insertString, function(err, results) {
      callback(err, results);
    });
  }
  //find
var findAll = function(db, collectionName, callback) {
  var returnResult = [];
  var cursor = db.collection(collectionName).find();
  cursor.each(function(err, result) {

    assert.equal(err, null);
    if (result != null) {
      returnResult.push(result);
    } else {
      callback(err, returnResult);
    }
  });
};
var findMany = function(db, collectionName, queryString, callback) {
  var returnResult = [];
  var cursor = db.collection(collectionName).find(queryString);
  cursor.each(function(err, result) {
    assert.equal(err, null);
    if (result != null) {
      returnResult.push(result);
    } else {
      callback(err, returnResult);
    }
  });
};
var findSpecify = function(db, collectionName, queryString, callback) {

  var returnResult;
  var cursor = db.collection(collectionName).find(queryString);
  cursor.each(function(err, results) {
    assert.equal(err, null);
    if (results != null) {
      returnResult = results
    } else {
      callback(err, returnResult);
    }
  });
};
var distinct = function(db, collectionName, queryString, distinctString, callback) {
  findMany(db, collectionName, queryString, function(err, results) {
    var tempCollectionName = queryString.user_id.toString();
    db.collection(tempCollectionName).remove({}, function(err, results1) {
      db.createCollection(tempCollectionName, function(err, collection) {
        if (results.length > 0) {
          collection.insert(results, function(err, ids) {
            collection.distinct("tags", function(err, docs) {
              callback(err, docs);
            });
          })
        } else {
          callback(null, null);
        }

      })
    })
  })
};
//sort
var sort = function(db, collectionName, queryString, sortString, callback) {
  var returnResult = [];
  var cursor = db.collection(collectionName).find(queryString).sort(sortString);
  cursor.each(function(err, result) {
    assert.equal(err, null);
    if (result != null) {
      returnResult.push(result);
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
      callback(err, results);
    });
};
var updateSpecify = function(db, collectionName, queryString, updateString, callback) {
  db.collection(collectionName).updateOne(
    queryString,
    updateString,
    function(err, results) {
      callback(err, results);
    });
};
var updateMany = function(db, collectionName, queryString, updateString, callback) {
  db.collection(collectionName).updateMany(
    queryString,
    updateString,
    function(err, results) {
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
