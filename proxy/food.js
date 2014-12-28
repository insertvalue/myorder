/**
 * Created by hongdian on 2014/12/25.
 */
var models = require('../models');
var Food = models.Food;

/**
 * 根据id查找
 * @param id
 * @param callback
 */
exports.getFoodById = function (id, callback) {
    Food.findOne({_id: id}, callback);
};

/**
 * 自定义条件查询美食
 * @param query
 * @param opt
 * @param callback
 */
exports.getFoodsByQuery = function (query, opt, callback) {
    Food.find(query, '', opt, callback);
};

/**
 * 新增美食
 * @param name
 * @param address
 * @param tel
 * @param categories
 * @param css
 * @param callback
 */
exports.newAndSave = function (name, price, shop_id, week, category, path, img_path, callback) {
    var food = new Food();
    food.name = name;
    food.price = price;
    food.shop_id = shop_id;
    food.week = week;
    food.category = category;
    food.path = path;
    food.img_path = img_path;
    food.save(callback);
};

/**
 * 根据id更新美食
 * @param id
 * @param updatefood
 * @param callback
 */
exports.updateFoodById = function (id, updatefood, callback) {
    Food.findOne({_id: id}, function (err, food) {
        food.name = updatefood.name;
        food.price = updatefood.price;
        food.week = updatefood.week;
        food.category = updatefood.category;
        food.save(callback);
    });
};