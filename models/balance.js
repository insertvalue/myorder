/**
 * Created by hongdian on 2014/12/25.
 * 账户记录
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var BalanceSchema = new Schema({
    created: {type: String},
    user_id: {type: String},
    type: {type: String},
    amount: {type: String},
    balance: {type: String},
    describe: {type: String}
});
mongoose.model('Balance', BalanceSchema);