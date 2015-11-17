var express=require('express'),
users=require('./routes/users');
var app=express();
app.use('/users',users);
app.listen(3000);
