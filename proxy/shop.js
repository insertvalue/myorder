/**
 * Created by hongdian on 2014/12/24.
 * 商家
 */
var models = require('../models');
var Shop = models.Shop;

/**
 * 根据id查找
 * @param id
 * @param callback
 */
exports.getShopById = function (id, callback) {
    Shop.findOne({_id: id}, callback);
};

/**
 * 自定义条件查询商家
 * @param query
 * @param opt
 * @param callback
 */
exports.getShopsByQuery = function (query, opt, callback) {
    Shop.find(query, '', opt, callback);
};

/**
 * 新增店铺
 * @param name
 * @param address
 * @param tel
 * @param categories
 * @param css
 * @param callback
 */
exports.newAndSave = function (name, address, tel, categories, css, callback) {
    var shop = new Shop();
    shop.name = name;
    shop.address = address;
    shop.tel = tel;
    shop.categories = categories;
    shop.css = css;
    shop.save(callback);
};

/**
 * 根据id更新店铺
 * @param id
 * @param updateshop
 * @param callback
 */
exports.updateShopById = function (id, updateshop, callback) {
    Shop.findOne({_id: id}, function (err, shop) {
        shop.name = updateshop.name;
        shop.address = updateshop.address;
        shop.tel = updateshop.tel;
        shop.categories = updateshop.categories;
        shop.css = updateshop.css;
        shop.save(callback);
    });
};