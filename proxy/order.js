/**
 * Created by hongdian on 2014/12/25.
 * 订单
 */
var models = require('../models');
var Order = models.Order;

/**
 * 根据id查找
 * @param id
 * @param callback
 */
exports.getOrderById = function (id, callback) {
    Order.findOne({_id: id}, callback);
};

/**
 * 自定义条件查询订单
 * @param query
 * @param opt
 * @param callback
 */
exports.getOrdersByQuery = function (query, opt, callback) {
    Order.find(query, '', opt, callback);
};

/**
 * 新增订单
 * @param name
 * @param address
 * @param tel
 * @param categories
 * @param css
 * @param callback
 */
exports.newAndSave = function (updateorder, callback) {
    var order = new Order();
    order.shop_id = updateorder.shop_id;
    order.shop_name = updateorder.shop_name;
    order.user_id = updateorder.user_id;
    order.user_name = updateorder.user_name;
    order.time = updateorder.time;
    order.total = updateorder.total;
    order.order = updateorder.order;
    order.luck = updateorder.luck;
    order.canceled = updateorder.canceled;
    order.payStatus = updateorder.payStatus;
    order.save(callback);
};

/**
 * 根据id更新订单
 * @param id
 * @param updateorder
 * @param callback
 */
exports.updateOrderById = function (id, updateorder, callback) {
    Order.findOne({_id: id}, function (err, order) {
        order.shop_id = updateorder.shop_id;
        order.shop_name = updateorder.shop_name;
        order.user_id = updateorder.user_id;
        order.user_name = updateorder.user_name;
        order.time = updateorder.time;
        order.total = updateorder.total;
        order.order = updateorder.order;
        order.luck = updateorder.luck;
        order.canceled = updateorder.canceled;
        order.payStatus = updateorder.payStatus;
        order.save(callback);
    });
};

/**
 * 更新支付装填
 * @param id
 * @param payStatus
 * @param callback
 */
exports.updatePayStatus = function (id, payStatus, callback) {
    Order.findOne({_id: id}, function (err, order) {
        order.payStatus = payStatus;
        order.save(callback);
    });
};

/**
 * 取消用户订单
 * @param id
 * @param callback
 */
exports.cancelOrder = function (id, callback) {
    Order.findOne({_id: id}, function (err, order) {
        order.canceled = "true";
        order.save(callback);
    });
};

/**
 * 根据时间对订单进行分组查询
 * @param dateType 时间类型{year,month,day}
 * @param startTime 开始时间
 * @param endTime 结束时间
 * @param callback 回调函数
 */
exports.groupOrderByTime = function (dateType, startTime, endTime, callback) {
    var substr_end = 0;
    switch (dateType) {
        case "year":
            substr_end = 4;
            break;
        case "month":
            substr_end = 7;
            break;
        case "day":
            substr_end = 10;
            break;
    }
    Order.aggregate(
        {$match: {time: {"$gte": startTime, "$lte": endTime}}}
        , {$group: {_id: {date: {$substr: ["$time", 0, 10]}}, count: {$sum: 1}}}
        , {$project: {_id: 0, time: "$_id.date", count: "$count"}}
        , {$sort: {time: 1}}
        , callback)
}