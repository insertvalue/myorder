/**
 * Created by hongdian on 2014/12/25.
 * 美食
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var FoodSchema = new Schema({
    name: {type: String},
    price: {type: String},
    shop_id: {type: String},
    week: {type: String},
    category: {type: String},
    path: {type: String},
    img_path: {type: String}
});
mongoose.model('Food', FoodSchema);