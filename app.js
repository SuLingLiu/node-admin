/**
 * 应用程序的启动入口文件
 */
//加载express模块
var express = require('express');
//创建app应用
var app = express();
var swig = require('swig');
//加载数据库模块
var mongoose = require('mongoose');
//加载body-parser，用来处理post提交过了的数据
var bodyParser = require('body-parser');
//加载cookies模块
var Cookies = require('cookies');

//设置静态文件托管
//当用户访问的url以/public开始，那么直接返回对应__dirname + '/public'下的文件
app.use('/public', express.static(__dirname + '/public'));

//第一参数：模板引擎的名称，同时也是模板文件的后缀，第二个参数表示用于解析处理模板内容的方法
app.engine('html', swig.renderFile);
//设置模板引擎存放的目录，第一个参数必须是views，第二个参数是目录
app.set('views', './views');
//注册所使用的模板引擎，第一个参数必须是view engine, 第二个参数和app.engine第一个参数必须一致
app.set('view engine', 'html');
//在开发过程中，需要取消模板缓存
swig.setDefaults({cache: false});

//bodyParser设置，因为post传过来的数据是编码过的
app.use( bodyParser.urlencoded({extended: true}) );

//设置cookie
app.use( function(req, res, next) {
    req.cookies = new Cookies(req, res);//然后再通过这个对象下的get和set来设置cookies，设置完后，再次刷新浏览器请求的信息中头里会带有这个cookie信息
    next();
})


/*app.get('', function(req, res, next) {
	//res.send('hello')
	// 读取views目录下的指定文件，解析并返回给客户端
	// 第一个参数：表示模板文件，指对于views目录，第二个参数：传递给模板的数据
	res.render('index');
})*/

/**
 * 根据不同的功能划分模块
 */
app.use('/admin', require('./routers/admin'));
app.use('/api', require('./routers/api'));
app.use('/', require('./routers/main'));

//mongod.exe --dbpath d:\testData --port=27018
//第一个参数：协议（mongodb:）+ 地址+端口；第二个参数是回调函数
mongoose.connect('mongodb://localhost:27018/blog', function(err) {
	if(err) {
		console.log('数据库连接失败');
	}else {
		console.log('数据库连接成功');
		//监听http请求
		app.listen(8080);
	}
});

