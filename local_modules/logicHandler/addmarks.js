var SqlOperation=require('../mongodb/mongosql.js');
var SqlOperation=new SqlOperation();
//新增数据
SqlOperation.insert('users',[{name:"hehehhe"},{name:"hahahaha"}],function(){
  SqlOperation.findAll('users',function(){
    console.log("============end=============");
  });
});
//更新数据
//SqlOperation.update('users',{name:"itwap1"},{name:"itwap1new"});
//替换数据
//SqlOperation.replace('users',{name:"empvio"},{name:"empvio_replace"});

//查找指定数据
//SqlOperation.findSpecify('users',{name:'ti'});
//移除指定数据
//SqlOperation.removeOne('users',{name:'itwap12'});

//移除多个数据
//SqlOperation.removeMany('users',{name:'empvio_replace'});
//查找所有数据
//SqlOperation.findAll('users');
