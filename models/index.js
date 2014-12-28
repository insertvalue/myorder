/**
 * Created by hongdian on 2014/12/23.
 */
var mongoose = require('mongoose');
var config = require('../config').config;

mongoose.connect(config.db, function (err) {
    if (err) {
        console.error('connect to %s error: ', config.db, err.message);
        process.exit(1);
    }
});

// models
require('./user');
require('./shop');
require('./food');
require('./order');
require('./balance');

exports.User = mongoose.model('User');
exports.Shop = mongoose.model('Shop');
exports.Food = mongoose.model('Food');
exports.Order = mongoose.model('Order');
exports.Balance = mongoose.model('Balance');