/**
 * Created by hongdian on 2014/12/23.
 */
var express = require('express');
var site = require('./controllers/site');
var user = require('./controllers/user');
var admin = require('./controllers/admin');
var order = require('./controllers/order');
var config = require('./config');

var router = express.Router();
// home page
router.get('/', site.auth, site.homepage);

//登陆
router.get('/user/login', user.showLogin);
router.post('/user/login', user.login);
//注销
router.get('/user/logout', user.logout);
//注册
router.get('/user/register', user.showRegister);
router.post('/user/register', user.register);

//用户管理
router.get('/user/order', site.auth, user.user_order);
router.get('/user/order/delete/:id', site.auth, user.user_deleteOrder);
router.get('/user/account', site.auth, user.user_account);
router.post('/user/account', site.auth, user.user_account);
router.get('/user/balance', site.auth, user.user_balance);
router.get('/user/forgetPassword', user.user_forgetPassword);
router.post('/user/forgetPassword', user.user_forgetPassword);

//订单
router.get('/shop/:id', site.auth, order.shop);
router.post('/submit_order', site.auth, order.submit_order);
router.get('/pay/item', site.auth, order.pay_item);
router.get('/pay/submit_pay', site.auth, order.submit_pay);
router.post('/pay/submit_pay', site.auth, order.submit_pay);
router.get('/today', site.auth, order.today);

//***********后台管理***********//
router.get('/admin', site.auth, admin.index);
//店铺管理
router.get('/admin/shop', site.auth, admin.shop_index);
router.get('/admin/shop/add', site.auth, admin.shop_add);
router.post('/admin/shop/add', site.auth, admin.shop_add);
router.get('/admin/shop/edit/:id', site.auth, admin.shop_edit);
router.post('/admin/shop/edit/:id', site.auth, admin.shop_edit);
router.get('/admin/shop/delete/:id', site.auth, admin.shop_delete);
//美食管理
router.get('/admin/food', site.auth, admin.food_index);
router.get('/admin/food/add', site.auth, admin.food_add);
router.post('/admin/food/add', site.auth, admin.food_add);
router.get('/admin/food/edit/:id', site.auth, admin.food_edit);
router.get('/admin/food/delete/:id', site.auth, admin.food_delete);
router.post('/admin/food/edit/:id', site.auth, admin.food_edit);
//用户管理
router.get('/admin/user', site.auth, admin.auth_super_admin, admin.user_index);
router.get('/admin/user/orders', site.auth, admin.auth_super_admin, admin.user_orders);
router.get('/admin/user/add_balance', site.auth, admin.auth_super_admin, admin.user_add_balance);
router.post('/admin/user/add_balance', site.auth, admin.auth_super_admin, admin.user_add_balance);
router.get('/admin/user/balance', site.auth, admin.auth_super_admin, admin.balance);
router.get('/admin/user/delete/:id', site.auth, admin.auth_super_admin, admin.user_delete);
router.get('/admin/user/isAdmin/:id', site.auth, admin.auth_super_admin, admin.user_isAdmin);
router.get('/admin/user/canOperateShop/:id', site.auth, admin.auth_super_admin, admin.user_operateShop);
//404 hadle
router.get('*', site.pageNotFound);

module.exports = router;