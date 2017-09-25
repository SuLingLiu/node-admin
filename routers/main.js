/**
 * 前台模块
 */
var express = require('express');
var router = express.Router();
var Category = require('../models/Category');

/*
* 首页
* */
router.get('/', function(req, res, next) {
	Category.find().then(function(category) {
		res.render('main/index', {
			userInfo: req.userInfo,
			category: category
		});
	})
	
})

module.exports = router;