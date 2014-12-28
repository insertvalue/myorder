/**
 * Created by hongdian on 2014/12/24.
 * 用户模型
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserSchema = new Schema({
    name: {type: String},
    email: {type: String},
    reg_time: {type: String},
    password: {type: String},
    isAdmin: {type: Boolean, default: false},
    canOperateShop: {type: Boolean, default: false},
    balance: {type: String}

});
mongoose.model('User', UserSchema);