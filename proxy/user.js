/**
 * Created by hongdian on 2014/12/24.
 * 用户
 */

var models = require('../models');
var User = models.User;

/**
 * 根据登录名查找用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} name 登录名
 * @param {Function} callback 回调函数
 */
exports.getUserByLoginName = function (name, callback) {
    User.findOne({'name': name}, callback);
};

/**
 * 根据用户ID，查找用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} id 用户ID
 * @param {Function} callback 回调函数
 */
exports.getUserById = function (id, callback) {
    User.findOne({_id: id}, callback);
};

/**
 * 根据邮箱，查找用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} email 邮箱地址
 * @param {Function} callback 回调函数
 */
exports.getUserByMail = function (email, callback) {
    User.findOne({email: email}, callback);
};

/**
 * 根据关键字，获取一组用户
 * Callback:
 * - err, 数据库异常
 * - users, 用户列表
 * @param {String} query 关键字
 * @param {Object} opt 选项
 * @param {Function} callback 回调函数
 */
exports.getUsersByQuery = function (query, opt, callback) {
    User.find(query, '', opt, callback);
};

/**
 * 新增用户
 * @param name
 * @param email
 * @param reg_time
 * @param password
 * @param isAdmin
 * @param canOperateShop
 * @param balance
 * @param callback
 */
exports.newAndSave = function (name, email, reg_time, password, isAdmin, canOperateShop, callback) {
    var user = new User();
    user.name = name;
    user.email = email;
    user.reg_time = reg_time;
    user.password = password;
    user.isAdmin = isAdmin || false;
    user.canOperateShop = canOperateShop || false;
    user.save(callback);
};

/**
 * 更新用户账户余额
 * @param id
 * @param balance
 * @param callback
 */
exports.updateUserBalance = function (id, balance, callback) {
    User.findOne({_id: id}, function (err, user) {
        user.balance = balance;
        user.save(callback);
    });
};

/**
 * 更新用户管理员权限
 * @param id
 * @param isAdmin
 * @param callback
 */
exports.updateUserIsAdmin = function (id, isAdmin, callback) {
    User.findOne({_id: id}, function (err, user) {
        user.isAdmin = isAdmin;
        user.save(callback);
    });
};

exports.updateUserCanOperateShop = function (id, canOperateShop, callback) {
    User.findOne({_id: id}, function (err, user) {
        user.canOperateShop = canOperateShop;
        user.save(callback);
    });
};

/**
 * 更新用户
 * @param id
 * @param updateuser
 * @param callback
 */
exports.updateUser = function (query, updateuser, callback) {
    User.findOne(query, function (err, user) {
        user.name = updateuser.name;
        user.email = updateuser.email;
        user.reg_time = updateuser.reg_time;
        user.password = updateuser.password;
        user.isAdmin = updateuser.isAdmin;
        user.canOperateShop = updateuser.canOperateShop;
        user.save(callback);
    });
};