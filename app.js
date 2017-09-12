/**
 * 应用程序的启动入口文件
 */
//加载express模块
var express = require('express');
//创建app应用
var app = express();
var swig = require('swig');

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

/*app.get('', function(req, res, next) {
	//res.send('hello')
	// 读取views目录下的指定文件，解析并返回给客户端
	// 第一个参数：表示模板文件，指对于views目录，第二个参数：传递给模板的数据
	res.render('index');
})*/

/**
 * 根据不同的功能划分模块
 */
app.use('/admin', require('./router/admin'));
app.use('/api', require('./router/app'));
app.use('', require('./router/main'));

//监听http请求
app.listen(8080);