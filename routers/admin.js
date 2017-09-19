/**
 * 后台管理模块
 */
var express = require('express');
var router = express.Router();
var User = require('../models/User');//返回的是一个构造函数
var Category = require('../models/Category');


router.use(function(req, res, next) {
    if (!req.userInfo && !req.userInfo.isAdmin) {
        //如果当前用户是非管理员
        res.send('对不起，只有管理员才可以进入后台管理');
        return;
    }
    next();
});

router.get('/', function(req, res, next) {
	res.render('main/index', {
		userInfo: req.userInfo
	});
})

router.get('/user', function(req, res, next) {
	/*
     * 从数据库中读取所有的用户数据
     *
     * limit(Number) : 限制获取的数据条数
     *
     * skip(2) : 忽略数据的条数
     *
     * 每页显示2条
     * 1 : 1-2 skip:0 -> (当前页-1) * limit
     * 2 : 3-4 skip:2
    * */

    var page = Number(req.query.page) || 1;//默认是第一页
    var limit = 2;
    var pages = 0;
	User.count().then(function(count) {
		//计算总页数
        pages = Math.ceil(count / limit);
        //取值不能超过pages
        page = Math.min( page, pages );
        //取值不能小于1
        page = Math.max( page, 1 );

        var skip = (page - 1) * limit;

        User.find().limit(limit).skip(skip).then(function(users) {
            res.render('admin/user_index', {
                userInfo: req.userInfo,
                users: users,

                count: count,
                pages: pages,
                limit: limit,
                page: page,
                url: '/admin/user'
            });
        });

	})
	
})

router.get('/category', function(req, res) {

    var page = Number(req.query.page) || 1;
    var limit = 2;
    var pages = 0;

    Category.count().then(function(count) {

        //计算总页数
        pages = Math.ceil(count / limit);
        //取值不能超过pages
        page = Math.min( page, pages );
        //取值不能小于1
        page = Math.max( page, 1 );

        var skip = (page - 1) * limit;

        /*
        * 1: 升序
        * -1: 降序
        * */
        Category.find().sort({_id: -1}).limit(limit).skip(skip).then(function(categories) {
            res.render('admin/category_index', {
                userInfo: req.userInfo,
                categories: categories,

                count: count,
                pages: pages,
                limit: limit,
                page: page,
                url: '/admin/category'
            });
        });

    });

})

router.get('/category/add', function(req, res) {
	res.render('admin/category_add', {
		userInfo: req.userInfo
	});
})

router.post('/category/add', function(req, res) {
	var name = req.body.name || '';
	if(name == '') {
		res.render('admin/error', {
			userInfo: req.userInfo,
			message: '名称不能为空'
		});
		return;
	}else {
		Category.findOne({
			name: name
		}).then(function(data) {
			if(data) {
				//数据库中已经存在该分类了
	            res.render('admin/error', {
	                userInfo: req.userInfo,
	                message: '分类已经存在了'
	            })
	            return Promise.reject();
			}else {
				//数据库中不存在该分类，可以保存
				return new Category({
					name: name
				}).save();
			}
		}).then(function(newCategory) {
			//数据库中已经存在该分类了
            res.render('admin/success', {
                userInfo: req.userInfo,
           		message: '分类保存成功',
            	url: '/admin/category'
            })
		})
	}
})

module.exports = router;