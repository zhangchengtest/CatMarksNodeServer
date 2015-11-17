var SqlOperation=require('../mongodb/sqloperation.js');
var SqlOperation=new SqlOperation();
//新增数据
// SqlOperation.insert('users',[{name:"hehehhe"},{name:"hahahaha"}],function(result){
//   console.log("\033[36m" + "insertResults" + "/\033[39m");
//   console.log(result);
//   // SqlOperation.findAll('users',function(results){
//   //
//   //   console.log("============end=============");
//   //   console.log(results);
//   // });
// });
//更新数据
//SqlOperation.update('users',{name:"itwap1"},{name:"itwap1new"});
//替换数据
//SqlOperation.replace('users',{name:"empvio"},{name:"empvio_replace"});

//查找指定数据
// SqlOperation.findSpecify('users',{_id:ObjectId("564761592e4fceb82185749f")},function(result){
//   console.log("!==============findSepcify================!");
//   console.log(result);
// });
//移除指定数据
//SqlOperation.removeOne('users',{name:'itwap12'});

//移除多个数据
//SqlOperation.removeMany('users',{name:'empvio_replace'});
//查找所有数据
SqlOperation.findAll('users',function(results){
  console.log("================client============");
  console.log(results);
});
