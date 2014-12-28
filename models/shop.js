/**
 * Created by hongdian on 2014/12/24.
 * 商家
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ShopSchema = new Schema({
    name: {type: String},
    address: {type: String},
    tel: {type: String},
    categories: {type: String},
    css: {type: String}
});
mongoose.model('Shop', ShopSchema);