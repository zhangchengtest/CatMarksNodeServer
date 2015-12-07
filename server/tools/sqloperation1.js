//require
var MongoClient = require('mongodb').MongoClient,
  assert = require('assert'),
  mongodb = require('mongodb'),
  config = require('./config.js');
var url = config.db.uri;
var SqlOperation = function() {};
module.exports = SqlOperation;

//exports function
SqlOperation.prototype.ObjectID = function(id) {
  return mongodb.ObjectID(id);
}
MongoClient.connect(url, function(err, db) {
  // if (err) {
  //   callback(err, null);
  // }
  //console.log("\033[36m" + "1 Connected correctly to server" + "/\033[39m");
  // SqlOperation.prototype.insert = function(collectionName, insertString, callback) {
  //   insert(db, collectionName, insertString, function(err, results) {
  //     callback(err, results);
  //   });
  // };
  // SqlOperation.prototype.update = function(collectionName, queryString, updateString, callback) {
  //   update(db, collectionName, queryString, updateString, function(err, results) {
  //     callback(err, results);
  //   })
  // };
  // SqlOperation.prototype.replace = function(collectionName, queryString, replaceString, callback) {
  //   replaceOne(db, collectionName, queryString, replaceString, function(err, results) {
  //     callback(err, results);
  //   })
  // };
  // SqlOperation.prototype.findAll = function(collectionName, callback) {
  //   findAll(db, collectionName, function(err, results) {
  //     callback(err, results);
  //   })
  // };
  // SqlOperation.prototype.findSpecify = function(collectionName, queryString, callback) {
  //   findSpecify(db, collectionName, queryString, function(err, results) {
  //     callback(err, results);
  //   })
  // };
  // SqlOperation.prototype.findMany = function(collectionName, queryString, callback) {
  //   findMany(db, collectionName, queryString, function(err, results) {
  //     callback(err, results);
  //   })
  // };
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
  // if (err) {
  //   callback(err, null);
  // }
  //console.log("\033[36m" + "2Connected correctly to server" + "/\033[39m");
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
    assert.equal(err, null);
    //console.log("Inserted a document into the " + collectionName + " collection");
    ////console.log(results);
    callback(err, results);
  });
}
var insertDocuments = function(db, collectionName, insertString, callback) {
    var collection = db.collection(collectionName);
    collection.insertMany(insertString, function(err, results) {
      assert.equal(err, null);
      //console.log("Inserted " + insertString.length + " documents into the " + collectionName + " collection");
      ////console.log(results);
      callback(err, results);
    });
  }
  //find
var findAll = function(db, collectionName, callback) {
  var returnResult = [];
  var cursor = db.collection(collectionName).find();
  //console.log("find all documents in " + collectionName + " collection");
  cursor.each(function(err, result) {

    assert.equal(err, null);
    if (result != null) {
      ////console.log(result);
      returnResult.push(result);
    } else {
      callback(err, returnResult);
    }
  });
};
var findMany = function(db, collectionName, queryString, callback) {
  var returnResult = [];
  //var objectId = new mongo.ObjectID(queryString._id);
  var cursor = db.collection(collectionName).find(queryString);
  //console.log("find some documents in " + collectionName + " collection");
  cursor.each(function(err, result) {

    assert.equal(err, null);
    if (result != null) {
      ////console.log(result);
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
  //console.log("find a  documents in " + collectionName + " collection");
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
    db.collection('temp_tags').remove({}, function(err, results1) {
      db.createCollection('temp_tags', function(err, collection) {
        collection.insert(results, function(err, ids) {
          collection.distinct("tags", function(err, docs) {
            callback(err, docs);
          });
        })
      })
    })
  })
};
//sort
var sort = function(db, collectionName, queryString, sortString, callback) {

  var returnResult = [];
  var cursor = db.collection(collectionName).find(queryString).sort(sortString);
  //console.log("find some documents in " + collectionName + " collection with  sort");
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
  //console.log(queryString);
  //console.log(updateString);
  db.collection(collectionName).update(
    queryString,
    updateString,
    function(err, results) {
      ////console.log(results);
      callback(err, results);
    });
};
var updateSpecify = function(db, collectionName, queryString, updateString, callback) {
  db.collection(collectionName).updateOne(
    queryString,
    updateString,
    function(err, results) {
      ////console.log(results);
      callback(err, results);
    });
};
var updateMany = function(db, collectionName, queryString, updateString, callback) {
  db.collection(collectionName).updateMany(
    queryString,
    updateString,
    function(err, results) {
      ////console.log(results);
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
