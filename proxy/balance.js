/**
 * Created by hongdian on 2014/12/25.
 */
var models = require('../models');
var Balance = models.Balance;

/**
 * 根据id查找
 * @param id
 * @param callback
 */
exports.getBalanceById = function (id, callback) {
    Balance.findOne({_id: id}, callback);
};

/**
 * 自定义条件查询账户记录
 * @param query
 * @param opt
 * @param callback
 */
exports.getBalancesByQuery = function (query, opt, callback) {
    Balance.find(query, '', opt, callback);
};

/**
 * 新增账户记录
 * @param name
 * @param address
 * @param tel
 * @param categories
 * @param css
 * @param callback
 */
exports.newAndSave = function (savebalance, callback) {
    var balance = new Balance();
    balance.created = savebalance.created;
    balance.user_id = savebalance.user_id;
    balance.type = savebalance.type;
    balance.amount = savebalance.amount;
    balance.balance = savebalance.balance;
    balance.describe = savebalance.describe;
    balance.save(callback);
};

/**
 * 根据id更新账户记录
 * @param id
 * @param updatebalance
 * @param callback
 */
exports.updateBalanceById = function (id, updatebalance, callback) {
    Balance.findOne({_id: id}, function (err, balance) {
        balance.created = updatebalance.created;
        balance.user_id = updatebalance.user_id;
        balance.type = updatebalance.type;
        balance.amount = updatebalance.amount;
        balance.balance = updatebalance.balance;
        balance.describe = updatebalance.describe;
        balance.save(callback);
    });
};