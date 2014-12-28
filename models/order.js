/**
 * Created by hongdian on 2014/12/25.
 * 订单
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var OrderSchema = new Schema({
    shop_id: {type: String},
    shop_name: {type: String},
    user_id: {type: String},
    user_name: {type: String},
    time: {type: String},
    total: {type: Number, default: 0},
    order: {type: []},
    luck: {type: Number},
    canceled: {type: Boolean},
    payStatus: {type: String}
});
mongoose.model('Order', OrderSchema);