/**
 * Created by hongdian on 2014/12/23.
 */
var User = require('../proxy').User;
var Shop = require('../proxy').Shop;
var Food = require('../proxy').Food;
var config = require('../config').config;
var util = require('../libs/util.js');
var path = require('path');

exports.auth = function (req, res, next) {
    if (req.session.user) {
        return next();
    } else {
        var cookie = req.cookies[config.auth_cookie_name];
        if (!cookie) {
            return res.redirect(config.login_path);
        }

        //从cookie读取用户信息，保存session。
        var auth_token = util.decrypt(cookie, config.session_secret);
        var auth = auth_token.split('\t');
        var user_name = auth[0];

        User.getUserByLoginName(user_name, function (err, user) {
            if (err == null && user != null) {
                if (user.email == config.admin_user_email)
                    user.isAdmin = true
                req.session.user = user;
                return next();
            }
            else {
                return res.redirect(config.login_path);
            }
        });
    }
};

exports.homepage = function (req, res, next) {
    Shop.getShopsByQuery({}, {}, function (err, shops) {
        if (!err) {
            res.render('index', {'shops': shops})
        } else {
            next();
        }
    });
}

exports.pageNotFound = function (req, res, next) {
    console.log('404 handler..');
    res.render('404', {status: 404, title: '页面不存在'});
}
