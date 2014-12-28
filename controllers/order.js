/**
 * Created by hongdian on 2014/12/25.
 */
var User = require('../proxy').User;
var Shop = require('../proxy').Shop;
var Food = require('../proxy').Food;
var Order = require('../proxy').Order;
var Balance = require('../proxy').Balance;
var config = require('../config').config;
var util = require('../libs/util.js');
var service = require('../libs/service');
var path = require('path');

// GET URL /today
exports.today = function (req, res, next) {
    service.getToday(function (err, result) {
        if (err) {
            res.render('today', { error: 'null'});
        } else {
            res.render('today', result);
        }
    })
};

// GET URL: /shop/5057458f9fc93f6001000001
//打开店铺
exports.shop = function (req, res, next) {
    Shop.getShopById(req.params.id, function (err, shop) {
        if (!err) {
            //获取今天的星期
            var week = util.getUTC8Day().toString();
            Food.getFoodsByQuery({'shop_id': req.params.id, week: {$in: ['-1', week]}}, {}, function (err, foods) {
                if (!err) {
                    //进行分组处理
                    var group = [];
                    for (var i = 0; i < foods.length; i++) {
                        var category = foods[i].category;//分类
                        if (category) {
                            var index = category.split('#');
                            if (!group[index[0]]) {
                                //不存在这个分类，需要创建这个数组
                                group[index[0]] = {'name': index[1], 'foods': []}
                            }

                            //向该分类推入这个商品
                            group[index[0]].foods.push(foods[i]);

                        } else {
                            console.log(foods.name + "没有无法确定分类");
                        }
                    }
                    //检查有没有图片菜单
                    (function (cb) {
                        if (shop.picmenu) {
                            shop.picmenu = "data:image/jpeg;base64," + shop.picmenu.buffer.toString('base64');
                            cb();
                        } else {
                            path.exists(path.join(__dirname, '..', 'public', 'picmenu' + req.params.id + '.jpg'), function (exists) {
                                shop.picmenu = exists ? '/picmenu' + req.params.id + '.jpg' : '';
                                //页面渲染
                                cb();
                            });
                        }
                    })(function (err) {
                        res.render('shop', {'shop': shop, 'group': group});
                    });
                } else {
                    console.log('获取店铺出错了，ID是：' + req.params.id + ":error" + err);
                    next();
                }
            })
        } else {
            console.log('获取店铺出错了，ID是：' + req.params.id);
            next();
        }
    });
};

// POST URL: /submit_order
//提交订单
exports.submit_order = function (req, res) {
    //计算运气
    var luck = Math.floor(Math.random() * 100);

    //获取订单
    var order_list = JSON.parse(req.body.list);
    var shop_id = req.body.shop_id;
    var shop_name = req.body.shop_name;

    var total = 0.0;
    for (var i in order_list) {
        total = total + ( parseFloat(order_list[i].price) * parseInt(order_list[i].num));
    }
    var saveorder = {
        shop_id: shop_id,
        shop_name: shop_name,
        user_id: req.session.user._id,
        user_name: req.session.user.name,
        time: util.getUTC8Time("YYYY-MM-DD HH:mm:ss"),
        total: total,
        order: order_list,
        luck: luck,
        canceled: false,
        payStatus: 'deafult'
    };

    //插入订单
    Order.newAndSave(saveorder, function (err, result) {
        if (!err) {
            console.log(result);
            res.send('{"result":"success","luck":"' + luck + '"}');
        } else {
            console.log(err);
            res.send('{"result":"error"}');
        }
    });
};

// url: /pay
//去结账
exports.pay_item = function (req, res, next) {

    //获取订单号
    var order_id = req.query["order_id"];
    //获取订单信息
    Order.getOrdersByQuery({_id: order_id}, function (err, order) {
        if (!err) {
            User.getUserByLoginName(req.session.user.name, function (err, user) {
                if (!err) {
                    res.render('pay/item', {order: order[0], user: user});
                }
            });
        } else {
            next();
        }
    });
};

// URL: /pay/submit_pay
//结账
exports.submit_pay = function (req, res) {
    if (req.method == "GET") {
        var result = req.query['result'];
        User.getUserById(req.session.user._id.toString(), function (err, user) {
            res.render('pay/submit_pay', {user: user, result: result});
        });
    } else if (req.method == "POST") {
        var order_id = req.body.order_id;

        //查询订单
        Order.getOrderById(order_id, function (err, order) {
            if (!err) {

                //如果该订单已经支付，返回今日订单界面
                if (order.payStatus === "paid") {
                    res.redirect('/today');
                    return;
                }
                //---------开始进行付款流程------------//
                User.getUserByLoginName(req.session.user.name, function (err, user) {
                    if (!err) {
                        //添加余额变动记录
                        var balance_log = {
                            created: util.getUTC8Time("YYYY-MM-DD HH:mm:ss"),
                            user_id: user._id.toString(),
                            type: 'pay',//充值
                            amount: parseFloat(0 - order.total).toFixed(2),
                            balance: (parseFloat(user.balance || 0) + parseFloat(0 - order.total)).toFixed(2),
                            describe: "支付了 <a href=\"/shop/" + order.shop_id + "\">" + order.shop_name + "</a> 的订单 › <a href=\"/user/order#order-" + order._id + "\">查看订单详情</a>"
                        };

                        Balance.newAndSave(balance_log, function (err, result) {
                            if (!err) {
                                //修改用户帐户余额
                                User.updateUserBalance(user._id, balance_log.balance, function (err) {
                                    if (!err) {
                                        //修改订单支付状态
                                        Order.updatePayStatus(order._id, "paid", function (err) {
                                            if (!err) {
                                                res.redirect('/pay/submit_pay?result=success');
                                            } else {
                                                next();
                                            }
                                        });
                                    } else {
                                        next();
                                    }
                                })
                            }
                        });
                    }
                });
            } else {
                res.send({"err": "application error"});
            }
        });
    }
}