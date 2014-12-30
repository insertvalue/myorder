/**
 * Created by hongdian on 2014/12/25.
 * 后台管理
 */
var path = require('path');
var formidable = require('formidable');
var utils = require('util');
var util = require('../libs/util');
var User = require('../proxy').User;
var Shop = require('../proxy').Shop;
var Food = require('../proxy').Food;
var Order = require('../proxy').Order;
var Balance = require('../proxy').Balance;
var config = require('../config').config;
var express = require('express');

exports.index = function (req, res) {
    res.render('admin/index', {title: "后台管理"});
};

// 验证用户是否是超级管理员，只有超级管理员才有删除用户，改变用户权限的权限
exports.auth_super_admin = function (req, res, next) {
    if (req.session.user) {
        if (req.session.user.isAdmin || req.session.user.email == config.admin_user_email) {
            next();
        } else {
            return res.render('note', {title: '权限不够'});
        }
    }
}

//显示店铺列表
exports.shop_index = function (req, res) {
    Shop.getShopsByQuery({}, {}, function (err, result) {
        if (!err) {
            res.render('admin/shop/index', {title: "店铺列表", shops: result});
        } else {
            res.render('admin/shop/index', {itle: "店铺列表", shops: []});
        }
    });
};

exports.shop_add = function (req, res) {
    if (req.method == "GET") {
        res.render('admin/shop/add', {title: "添加店铺"});
    } else if (req.method == "POST") {
        var name = req.body.name;
        var address = req.body.address;
        var tel = req.body.tel;

        Shop.newAndSave(name, address, tel, req.body.categories, req.body.css, function (err, result) {
            if (!err) {
                res.redirect('/admin/shop');
            }
        });
    }
};

//编辑店铺
exports.shop_edit = function (req, res) {
    if (req.method == "GET") {
        Shop.getShopById(req.params.id, function (err, shop) {
            res.render('admin/shop/edit', {title: "店铺编辑", "shop": shop});
        });
    } else if (req.method == "POST") {
        var shop = {
            'name': req.body.name,
            'address': req.body.address,
            'tel': req.body.tel,
            'categories': req.body.categories,
            'css': req.body.css
        };

        Shop.updateShopById(req.body.id, shop, function (err) {
            if (err) {
                console.log("err");
                res.redirect('/admin/shop?msg=error&action=edit');
            } else {
                res.redirect('/admin/shop?msg=success&action=edit');
            }
        })
    }
};

//删除店铺
exports.shop_delete = function (req, res) {
    var id = req.params.id;
    Shop.getShopById(id, function (err, shop) {
        if (!err && shop) {
            shop.remove();
            return res.status(200).end();
        }
    });
};

//添加美食
exports.food_add = function (req, res) {
    if (req.method == 'GET') {
        Shop.getShopById(req.query['shop_id'], function (err, shop) {
            if (!err) {
                //获取食品
                Food.getFoodsByQuery({'shop_id': req.query['shop_id']}, {}, function (err, foods) {
                    if (!err) {
                        console.log(util.get_week);
                        res.render('admin/food/add', {
                            title: "添加美食",
                            'shop': shop,
                            'foods': foods,
                            week: util.get_week
                        });
                    } else {
                        console.log('获取店铺出错了，ID是：' + req.params.id);
                        next();
                    }
                });
            } else {
                console.log('获取店铺出错了，ID是：' + req.params.id);
            }
        });
    } else if (req.method == 'POST') {
        var app = express();
        var form = new formidable.IncomingForm();
        form.encoding = 'utf-8';
        form.uploadDir = req.upload_path;//config.upload_path;
        form.keepExtensions = true;
        form.parse(req, function (err, fields, files) {
            var shop_id = fields.id;
            var name = fields.name;
            var price = fields.price;
            var week = fields.week;
            var category = fields.categories;
            var img_name = "/upload/" + path.basename(files.upload.path);
            var img_path = files.upload.path;

            Food.newAndSave(name, price, shop_id, week, category, img_name, img_path, function (err, result) {
                if (!err) {
                    console.log(result);
                    res.redirect('/admin/food/add?shop_id=' + shop_id);
                }
            });
        });
    }
}

//编辑美食
exports.food_edit = function (req, res) {
    if (req.method == "GET") {
        Food.getFoodById(req.params.id, function (err, food) {
            console.log(food);
            Shop.getShopById(food.shop_id, function (err, shop) {
                res.render('admin/food/edit', {title: "编辑美食", "food": food, "shop": shop});
            });
        });
    } else {
        var food = {
            name: req.body.name,
            price: req.body.price,
            week: req.body.week,
            category: req.body.categories
        };
        Food.updateFoodById(req.params.id, food, function (err) {
            if (err) {
                console.log("err");
                res.redirect('/admin/food/edit/' + req.params.id + '?msg=error&action=edit');
            } else {
                res.redirect('/admin/food/edit/' + req.params.id + '?msg=success&action=edit');
            }
        });
    }
};

//用户管理
exports.user_index = function (req, res) {
    if (req.session.user) {
        //这里如果用户有超级管理权限则能看到用户列表，否则为空白
        if (req.session.user.isAdmin) {
            var isAdmin = req.session.user.isAdmin;

            User.getUsersByQuery({}, {}, function (err, users) {
                return res.render('admin/user/index', {title: '用户管理', isAdmin: isAdmin, users: users});
            });
        } else {
            return res.render('admin/user/index', {title: '用户管理', isAdmin: isAdmin});
        }
    } else {
        return res.redirect(config.login_path);
    }
};

//删除用户
exports.user_delete = function (req, res) {
    var id = req.params.id;
    User.getUserById(id, function (err, user) {
        if (!err && user) {
            user.remove();
            return res.status(200).end();
        }
    });
};

//用户订单
exports.user_orders = function (req, res) {
    var user_id = req.query['user_id'];
    //获取当前用户的ID{user_id:req.session.user._id}
    Order.getOrdersByQuery({user_id: user_id}, {}, function (err, result) {
        if (!err) {
            res.render('admin/user/orders', {title: "用户订单", orders: result});
        }
    });
};

//用户充值
exports.user_add_balance = function (req, res) {

    if (req.method === "GET") {
        var user_id = req.query['user_id'];
        var result = req.query['result'];
        User.getUserById(user_id, function (err, user) {
            res.render('admin/user/add_balance', {title: "充值", user: user, result: result});
        });

    } else if (req.method === "POST") {

        if (!req.session.user.isAdmin) {
            return
        }

        var user_id = req.body.user_id;
        var amount = req.body.amount;

        User.getUserById(user_id, function (err, user) {

            var balance_log = {
                created: util.getUTC8Time("YYYY-MM-DD HH:mm:ss"),
                user_id: user_id,
                type: 'recharge',//充值
                amount: parseFloat(amount).toFixed(2),
                balance: (parseFloat(user.balance || 0) + parseFloat(amount)).toFixed(2),
                describe: req.session.user.name + "为你充值" + amount + "元人民币"
            };

            Balance.newAndSave(balance_log, function (err, result) {
                if (!err) {
                    //修改用户余额

                    user.balance = balance_log.balance;
                    delete user._id;

                    User.updateUserBalance(user_id, balance_log.balance, function (err, user) {
                        if (!err) {
                            res.redirect('/admin/user/add_balance?result=success&user_id=' + user_id);
                        } else {
                            next();
                        }
                    });
                }
            })

        });
    }
};

//用户账户余额记录
exports.balance = function (req, res) {
    User.getUserById(req.query['user_id'], function (err, user) {
        if (!err) {
            Balance.getBalancesByQuery({user_id: req.query['user_id']}, {}, function (err, balances) {
                res.render("admin/user/balance", {title: "用户记录", user: user, balances: balances});
            });
        }
    });
};

//更新超级管理员权限
exports.user_isAdmin = function (req, res) {
    var id = req.params.id;

    User.getUserById(id, function (err, user) {
        if (user.isAdmin) {
            user.isAdmin = false;
        } else {
            user.isAdmin = true;
        }
        delete user._id;

        User.updateUserIsAdmin(id, user.isAdmin, function (err, result) {
            if (!err) {
                console.log(user);
                return res.send(user.isAdmin);
            }
        });
    });
}

//更新用户是否能操作店铺
exports.user_operateShop = function (req, res) {
    var id = req.params.id;

    User.getUserById(id, function (err, user) {
        if (user.canOperateShop) {
            user.canOperateShop = false;
        } else {
            user.canOperateShop = true;
        }
        delete user._id;
        User.updateUserCanOperateShop(id, user.canOperateShop, function (err, result) {
            if (!err) {
                return res.send(user.canOperateShop);
            }
        });
    });
}

//删除美食
exports.food_delete = function (req, res) {
    var id = req.params.id;
    Food.getFoodById(id, function (err, food) {
        if (!err && food) {
            food.remove();
            return res.status(200).end();
        }
    });
};

//显示美食列表
exports.food_index = function (req, res) {
    res.render("admin/food", {title: "美食汇"});
};

//显示美食列表
exports.statis = function (req, res) {
    res.render("admin/statis", {title: "统计报表"});
};