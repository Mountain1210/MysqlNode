var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var mysql = require('mysql');
var fs=require('fs');
var ccap = require('ccap');
//express４　增加的
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var captcha = ccap({
　　width:190,
　　height:50,
　　offset:30,
　　quality:100,
　　fontsize:40,
// 　　generate:function(){
// 　　　　//自定义生成字符串
// 　　　　//此方法可不要
//            var str = "qQ";
//            return str;
// 　　}
});

// console.log(ccap+"000000000");

var pool = mysql.createPool({
    host: 'localhost',
    port: '3306', //可以不填写，默认为3306
    user: 'root',
    password: 'root',
    database: 'test'
});

var app = express();


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// app.use(express.favicon());
// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
// console.log("++++++++++"+app.router)
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

//配置路由文件，每个文件下可以有增删改查的方法
var indexs = require('./routes/index');
var users = require('./routes/user');
// fs.writeFileSync('./output.json',JSON.stringify({a:1,b:2}));
// var JsonObj=JSON.parse(fs.readFileSync('./output.json'));
// console.log(JsonObj);
// app.get('/users', user.list);
// var alljson=undefine;


/***node.js ajax请求　　开始***/
app.get('/ajax', function(req, res) {
    pool.getConnection(function(err, connection) {
        connection.query('SELECT * from student ', function(err, rows, fields) {
            if (err){
                throw err;
            }
            res.send(rows);
        });
        connection.release();
    });
    // res.send({ 
    //   title: 'jaySite',
    //   userName: 'Jay.Creater',
    //   userEmail: 'jaycreater@163.com'
    // });
})
/***node.js ajax请求　　结束***/
app.get('/', function(req, res) {
    pool.getConnection(function(err, connection) {
        connection.query('SELECT * from student ', function(err, rows, fields) {
            if (err)
                throw err;

            res.render('user.jade', {
                title: 'User List',
                user: rows
            });
            // console.log("++++++++++"+res.json(rows));
            // alljson=rows;
            // console.log('The solution is: ', res.json({"status":1}));
        });
        connection.release();
    });
});




app.get('/aa', function(req, res){
  res.render('index.jade', { title: 'Express' });
});
//这里在界面里indexs有一个index的方法，所以下面有indexs.index要执行
app.get('/bb',indexs.index);


//验证码的实现
app.get('/cc',function(req, res){
    var ary = captcha.get();

    console.log(ary[0]);//字符串

    res.write(ary[1]); //
    res.end();
})

app.get('/updateimg',function(req,res){
    res.render('updateimg.jade',{title:"上传图片"})
})

app.post('/uploadImg',function(req,res){
    var fs = require('fs');
       var formidable = require("formidable");
       var form = new formidable.IncomingForm();
       // console.log(form);
       form.uploadDir = "/public/upload/temp/";//改变临时目录
         // console.log(form);
       form.parse(req, function(error, fields, files){
            // console.log("files=========="+files);
           for(var key in files){
            console.log("key============"+key);
               var file = files[key];
               console.log("0000000000000"+file);
               var fName = (new Date()).getTime();
               console.log("文件类型："+file.type);
               switch (file.type){
                   case "image/jpeg":
                       fName = fName + ".jpg";
                       break;
                   case "image/png":
                       fName = fName + ".png";
                       break;
                   default :
                       fName =fName + ".png";
                       break;
               }
               console.log(file.size);
               var uploadDir = "./public/upload/" + fName;
               fs.rename(file.path, uploadDir, function(err) {
                   if (err) {
                       res.write(err+"\n");
                       res.end();
                   }
                   res.write("upload image:<br/>");
                   res.write("<img src='/imgShow?id=" + fName + "' />");
                   res.end();
               });
           }
       });
})


app.get('/create', function(req, res) {
    res.render('create.jade', {
        title : 'Create a new user'
    });
});

app.post('/create', function(req, res) {
    pool.getConnection(function(err, connection) {
        connection.query('insert into student set ?', {
            sid : req.body.user.sid,
            sname : req.body.user.sname
            // name : req.body.user.name,
            // password : req.body.user.password
        }, function(err, fields) {
            if (err)
                throw err;
            //console.log('Insert is success.');
        });
        //新增之后查询操作
        connection.query('SELECT * from student', function(err, rows, fields) {
            if (err)
                throw err;
            res.render('user.jade', {
                title : 'User List',
                user : rows
            });
            //console.log('The solution is: ', rows[0]);
        });
        connection.release();
    });
});


app.get('/update/:id', function(req, res) {
    console.log('aaaaaaaaaaaaaaa==='+req.params.id+'===aaaaaaaaaaaaaaa');
    pool.getConnection(function(err, connection) {
        connection.query('SELECT * from student where sid=?',[req.params.id],function(err, rows, fields) {
            console.log('==========='+req.params.sid+'==============');
            if (err)
                throw err;
            console.log('+++++'+rows[0]+'+++++++');
            res.render('create.jade', {
                title : 'Update user',
                user : rows[0]
            });
        });
        connection.release();
    });
});

app.post('/update', function(req, res) {
    pool.getConnection(function(err, connection) {
        connection.query('update student set ? where sid = ?', [{
            sid : req.body.user.sid,
            sname : req.body.user.sname
        },req.body.user.sid], function(err, fields) {
            if (err)
                throw err;
            //console.log('Insert is success.');
        });
        //新增之后查询操作
        connection.query('SELECT * from student', function(err, rows, fields) {
            if (err)
                throw err;
            res.render('user.jade', {
                title : 'User List',
                user : rows
            });
            //console.log('The solution is: ', rows[0]);
        });
        connection.release();
    });
});

app.get('/delete/:id', function(req, res) {
    pool.getConnection(function(err, connection) {
        connection.query('delete from  student  where sid = ?', [req.params.id], function(err, fields) {
            if (err)
                throw err;
        });
        //删除之后查询操作
        connection.query('SELECT * from student', function(err, rows, fields) {
            if (err)
                throw err;
            res.render('user.jade', {
                title : 'User List',
                user : rows
            });
        });
        connection.release();
    });
});
module.exports = app;
http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});