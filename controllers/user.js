/**
 * Created by hongdian on 2014/12/24.
 */
var User = require('../proxy').User;
var Balance = require('../proxy').Balance;
var Order = require('../proxy').Order;
var config = require('../config').config;
var util = require('../libs/util.js');

//显示登陆界面
exports.showLogin = function (req, res) {
    //只要访问了登录页，就清除cookie
    res.clearCookie(config.auth_cookie_name, {
        path: '/'
    });
    var tip;
    switch (req.query['tip']) {
        case 'error':
            tip = "帐号或密码错误，请重试";
            break;
        default :
            tip = null;
            break;
    }
    res.render('user/login', {tip: tip});
};

//登陆校验
exports.login = function (req, res) {
    var reMail = /^(?:[a-zA-Z0-9]+[_\-\+\.]?)*[a-zA-Z0-9]+@(?:([a-zA-Z0-9]+[_\-]?)*[a-zA-Z0-9]+\.)+([a-zA-Z]{2,})+$/;
    var account = req.body.account;
    var password = util.md5(req.body.password);

    var query = null;

    if (reMail.test(account)) {
        //使用邮箱登录
        query = {
            '$and': [
                {name: account.toLowerCase()},
                {password: password}
            ]
        };
    } else {
        //使用名号登录
        query = {
            '$and': [
                {name: account},
                {password: password}
            ]
        };
    }

    // 向数据库查询用户
    User.getUsersByQuery(query, {}, function (err, user) {
        if (err == null) {
            if (user.length > 0) {
                util.gen_session(user[0].name, user[0].password, res);
                res.redirect('/');
            } else {
                res.redirect('/user/login?tip=error')
            }
        } else {
            res.redirect('/user/login?tip=error')
        }
    });
};

//注销用户
exports.logout = function (req, res) {
    req.session.destroy();
    res.clearCookie(config.auth_cookie_name, {
        path: '/'
    });
    res.redirect('/user/login');
};

//显示注册界面
exports.showRegister = function (req, res) {
    var tip;
    switch (req.query['tip']) {
        case 'notemtpy':
            tip = "不填写完整的孩子是坏孩子";
            break;
        case 'exists_name':
            tip = "该名号已经被使用了";
            break;
        case 'exists_email':
            tip = "该邮箱地址已经被使用了";
            break;
        case 'failure':
            tip = "注册失败，请重试";
            break
        default :
            tip = null;
            break;
    }
    res.render('user/register', {tip: tip});
};

//注册
exports.register = function (req, res) {
    //获取用户的输入
    var name = req.body.name;
    var email = req.body.email.toLowerCase();
    var password = req.body.password;
    //验证用户空输入
    if (name == "" || password == "") {
        res.redirect('/user/register?tip=notemtpy');
        return;
    }

    //该邮箱是否已经被使用
    User.getUsersByQuery({email: email}, {}, function (err, email_result) {
        if (email_result.length == 0) {//用户名未被使用
            //该用户名是否已经被使用
            User.getUsersByQuery({name: name}, {}, function (err, name_result) {
                if (name_result.length == 0) {//邮箱未被使用
                    /******************************
                     * 可以注册了
                     ******************************/
                        // 密码进行MD5
                    password = util.md5(password);
                    var reg_time = util.getUTC8Time("YYYY-MM-DD HH:mm:ss");
                    // 向数据库保存用户的数据，并进行 session 保存      /*添加管理权限字段 isAdmin canOperateShop*/
                    User.newAndSave(name, email, reg_time, password, email == config.admin_user_email, false, function (err, user) {
                        if (!err && user) {
                            //if (!user.length) {
                            util.gen_session(user.name, user.password, res);
                            req.session.user = user;
                            res.redirect('/?tip=welcome');
                            //} else {
                            //    res.redirect('/user/register?tip=failure')
                            //}
                        } else {
                            res.redirect('/user/register?tip=failure')
                        }
                    });
                } else {//名号已经被使用
                    res.redirect('/user/register?tip=exists_name')
                }
            });
        } else {//邮箱已经被使用
            res.redirect('/user/register?tip=exists_email')
        }
    });
};

// URL /user/order
//显示用户订单
exports.user_order = function (req, res) {
    //获取当前用户的ID{user_id:req.session.user._id}
    Order.getOrdersByQuery({user_id: req.session.user._id.toString()}, function (err, result) {
        if (!err) {
            res.render('user/order', {orders: result});
        }
    });
};

// URL: /user/order/delete/:id
//删除用户订单
exports.user_deleteOrder = function (req, res) {
    id = req.params.id;
    Order.getOrderById(id, function (err, order) {
        if (err) return res.send(err);
        if (order.user_name == req.session.user.name) {
            Order.cancelOrder(id, function (err, result) {
                if (err) return res.send("取消订单失败");
                res.redirect('/today');
            });
        } else {
            res.send("你没有权限取消别人的订餐");
        }
    });
}

// URL /user/account
exports.user_account = function (req, res) {

    if (req.method == "GET") {
        switch (req.query['tip']) {
            case 'empty':
                var tip = "请填写完整后再提交";
                break;
            case 'error':
                var tip = "更新错误，请重试";
                break;
            case 'old_pwd_error':
                var tip = "旧密码错误，请重试";
                break;
            case 'ok':
                var tip = "更新成功";
                break
            case 'name_exist':
                var tip = "名号已经被使用，请更换后再提交修改。";
                break;
            case 'email_exist':
                var tip = "邮箱已经被使用，请更换后再提交修改。";
                break;
            default :
                var tip = null;
                break;
        }

        User.getUserByLoginName(req.session.user.name, function (err, result) {
            if (!err) {
                result.email = result.email || "";
                res.render('user/account', {user: result, tip: tip});
            }
        });
    } else {
        if (req.method == "POST") {
            //修改帐号
            User.getUserByLoginName(req.session.user.name, function (err, result) {
                if (!err) {
                    /* ------------ 非空验证 ----------*/
                    var pwd = req.body.pwd;
                    var new_pwd = req.body.new_pwd;
                    var name = req.body.name;
                    var email = req.body.email;
                    if (name == "" || email == "" || (new_pwd != "" && pwd == "")) {
                        res.redirect('/user/account?tip=empty');
                        return;
                    }

                    result.email = email;
                    result.name = name;

                    //如果旧密码不为空，说明需要修改密码
                    if (pwd != "") {
                        //旧密码MD5
                        var pwd = util.md5(req.body.pwd);
                        if (result.password == pwd) {//旧密码填写正确
                            result.password = util.md5(new_pwd);
                        } else {
                            res.redirect('/user/account?tip=old_pwd_error')
                            return;
                        }
                    }

                    //验证用户名是否已经存在
                    User.getUserByLoginName(result.name, function (err, user_name_exist) {
                        if (!err) {
                            //名号未被使用
                            if (( user_name_exist != null && user_name_exist._id.id == result._id.id) || user_name_exist == null) {
                                //验证邮箱是否已经被使用
                                User.getUserByMail(result.email, function (err, user_email_exist) {
                                    if (!err) {
                                        //邮箱未被使用
                                        if (( user_email_exist != null && user_email_exist._id.id == result._id.id) || user_email_exist == null) {
                                            var _id = result._id;
                                            delete result._id;

                                            User.updateUser({_id: _id}, result, function (err) {
                                                if (err) {
                                                    res.redirect('/user/account?tip=error');
                                                } else {
                                                    result._id = _id;
                                                    req.session.user = result;
                                                    util.gen_session(result.name, result.password, res);
                                                    res.redirect('/user/account?tip=ok');
                                                }
                                            });
                                        } else {
                                            res.redirect('/user/account?tip=email_exist')
                                        }
                                    } else {
                                        res.redirect('/user/account?tip=error')
                                    }
                                });
                            } else {
                                res.redirect('/user/account?tip=name_exist')
                            }
                        } else {
                            res.redirect('/user/account?tip=error')
                        }
                    });
                }
            });
        }
    }
};

// URL /user/balance
exports.user_balance = function (req, res) {
    User.getUserByLoginName(req.session.user.name, function (err, user) {
        if (!err) {
            Balance.getBalancesByQuery({user_id: req.session.user._id.toString()},{},function (err, balances) {
                res.render("user/balance", {user: user, balances: balances});
            });
        }
    });
};

//忘记密码
exports.user_forgetPassword = function (req, res) {
    if (req.method == 'GET') {
        switch (req.query['tip']) {
            case 'email_not_exist':
                var tip = "邮箱不存在";
                break;
            case 'success':
                var tip = "密码已发送成功请去邮箱验证";
                break;
            case 'error':
                var tip = "网络异常，请稍后再试";//此错误表示服务器问题,只要是数据库的err 统一发送此错误
                break;
            case 'sendfail':
                var tip = "发送失败，请稍后再试";//此错误表示邮件服务有问题
                break;
            default:
                var tip = null;
                break;
        }
        return res.render('user/forgetPassword', {tip: tip});
    } else if (req.method == "POST") {
        //判断邮箱存在否
        User.getUserByMail(req.body.email, function (err, result) {
            if (!err) {
                if (result) {
                    var rand = Math.floor(Math.random() * 90000000);//随机生成一个数字
                    var randPwd = Date.now() + rand;
                    var newPassword = util.md5(String(randPwd));
                    result.password = newPassword;
                    delete result._id;

                    User.updateUser({"email": req.body.email}, result, function (err) {
                        if (err) {
                            res.redirect('/user/forgetPassword?tip=error');
                        } else {
                            //如果邮箱存在，则发送密码
                            util.sendMail({
                                to: req.body.email,
                                subject: '宏电订餐系-密码找回',
                                text: '你的新密码是：' + randPwd + '，请用此密码登陆后尽快修改密码'
                            }, function (err) {
                                if (err) return res.redirect('/user/forgetPassword?tip=sendfail');
                                res.redirect('/user/forgetPassword?tip=success');
                            });
                        }
                    });
                } else {
                    res.redirect('/user/forgetPassword?tip=email_not_exist');
                }
            } else {
                res.redirect('/user/forgetPassword?tip=error');
            }
        })
    }
}