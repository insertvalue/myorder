/**
 * Created by hongdian on 2014/12/30.
 */
var models = require('../models');
var Order = models.Order;
var User = models.User;
var dateFormat = require('dateFormat');
/**
 * 根据id查找
 * @param id
 * @param callback
 */
exports.getOrderById = function (id, callback) {
    Order.findOne({_id: id}, callback);
};


function test(query, opt, callback) {
    Order.find(query, '', opt, callback);
};


var now = new Date();
var endTime = dateFormat(now, "yyyy-mm-dd 23:59:59")
now.setDate(now.getDate() - 7);
var startTime = dateFormat(now, "yyyy-mm-dd 00:00:00")


/**
 * 订单根据时间进行分组
 * $match:过滤条件
 * $group:分组  _id必需。这里根据时间字符串的年月日部分进行分组，使用$substr。
 * $project:对分组结果进行装饰
 * $sort:排序
 */
Order.aggregate(

    {$match: {time: {"$gte": startTime, "$lte": endTime}}},
    {$group: {_id:{ date: { $substr: [ "$time", 0, 10 ] }}, count: {$sum: 1 }}},
    {$project: {_id: 0, time: "$_id.date", count: "$count"}},
    {$sort: {time: 1}}
    , function (err, docs) {
        if (err) {
            console.log(err);
        }
        console.log(docs);
    })

var now = new Date();
var endTime = dateFormat(now, "yyyy-mm-dd 23:59:59");
var startTime = dateFormat(now, "yyyy-mm-dd 22:00:00");
Order.find({time: {"$gt": startTime, "$lt": endTime}}, function (err, docs) {
    console.log(docs);
});