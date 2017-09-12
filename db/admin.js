/**
 * 后台管理模块
 */
var express = require('express');
var router = express.Router();

router.get('/user', function(req, res, next) {
	res.send('admin')
})

var express = require('express');
var router = express.Router();

var User = require('../models/User');
var Category = require('../models/Category');
var Content = require('../models/Content');

router.use(function(req, res, next) {
    if (!req.userInfo.isAdmin) {
        //如果当前用户是非管理员
        res.send('对不起，只有管理员才可以进入后台管理');
        return;
    }
    next();
});