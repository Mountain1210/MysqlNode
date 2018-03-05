var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
// var mysql = require('mysql');
// var fs = require('fs');
// var ccap = require('ccap');
//express４　增加的
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var co=require('co');
var wrapper = require('co-redis');
// var Q = require('bluebird');



// console.log(ccap+"000000000");

// var pool = mysql.createPool({
//     host: 'localhost',
//     port: '3306', //可以不填写，默认为3306
//     user: 'root',
//     password: 'root',
//     database: 'test'
// });

var app = express();


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// app.use(express.favicon());
// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(methodOverride('X-HTTP-Method')) // Microsoft
app.use(methodOverride('X-HTTP-Method-Override')) // Google/GData
app.use(methodOverride('X-Method-Override')) // IBM
app.use(express.static(path.join(__dirname, 'public')));

var db = {};  

var redis = require("redis");

var client = redis.createClient(6379, "192.168.136.128",{});

client.on('error', function(){

    console.log(1231241332)
}) 
client.auth("123123",function(){
        console.log('通过认证');
});    



var redisCo = wrapper(client);
co(function* () {
    yield redisCo.set('test', 33);
    yield redisCo.sadd('BBB','bbb');
    // yield redisCo.BLPOP('mylist', 133);
    console.log(yield redisCo.smembers('BBB')); // logs 33 
});

// co(function* () {

//       var result = yield Promise.resolve((function(){
//                   var probj;
//                   client.hgetall('car',function(err,car){
//                      probj={
//                       price:car.price,
//                       name:car.name,
//                       model:car.model
//                     }     
//                   })
//                   console.log(probj)
//                    return probj;
//             }));

//       return result;
//     }).then(function (value) {
//         console.log(11111111111111111111)
//         console.log(value);
//     }, function (err) {
//       console.error(err.stack);
// });



// Q.promisifyAll(client.RedisClient.prototype);
// Q.promisifyAll(client.hgetall("car"));

// client.hgetall("car",function(err,car){
//     console.log(car.name);
//     console.log(car.price);
// })
// client.hgetall("posts:1",function(err,post){
//     console.log(post.name);
//     console.log(post.age);
// })
// client.hkeys('car',function(car){
//     console.log(car)
// })
// client.hvals('car',function(car){
//     console.log(car)
// })

/********************co代码开始**********************/
// co(function* () {
//     // var carval=client.hgetall("car",function(err,car){
//     //   return car;
//     // })
//     // // var car=client.hgetall("car");
//     // console.log(carval)
    
//     var result = yield client.get('key');
//     console.log(result)
//     return true;
// }).then(function(carval){
//     console.log(111111111111111111111111)
//     console.log(carval);
// })
// co(function* () {
//   var res = yield {
//     1: Promise.resolve(1),
//     2: Promise.resolve(2),
//   };
//   console.log(res); // => { 1: 1, 2: 2 }
// })
/********************co代码结束**********************/


// client.lrange('numbers')

// client.HEXISTS('car.model',function(flag){
//     console.log(flag)
// })
  // RDS_PORT = 6379,                //端口号    
  //       RDS_HOST = '59.110.158.104',    //服务器IP  要连接的A服务器redis    
  //       RDS_PWD = '123456',     //密码    
  //       RDS_OPTS = {}, 
// client.on('connect',function(){    
//         client.set('author', 'Wilson',redis.print);    
//         client.get('author', redis.print);    
//         console.log("AAAAAAAAAAAAAAAAAAAAAAAAAA");
//         console.log('connect');    
//         console.log("AAAAAAAAAAAAAAAAAAAAAAAAAA");        
// });    
// client.on('ready',function(err){    
//         console.log('ready');    
// });  
//配置路由文件，每个文件下可以有增删改查的方法
var indexs = require('./routes/index');
var users = require('./routes/user');






// app.use(function(req, res, next) {
//     var err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });

// error handlers

// development error handler
// will print stacktrace
// if (app.get('env') === 'development') {
//     app.use(function(err, req, res, next) {
//         res.status(err.status || 500);
//         res.render('error', {
//             message: err.message,
//             error: err
//         });
//     });
// }

// production error handler
// no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//         message: err.message,
//         error: {}
//     });
// });

module.exports = app;
http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});