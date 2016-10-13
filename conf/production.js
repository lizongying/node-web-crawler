/**
 * Created by michael on 2016-08-12.
 */
var util = require('util');
var common = require('./common');

function Production() {}

Production.prototype= {
    mysqlHost: '127.0.0.1',//mysql地址
    mysqlPort: 3306,//mysql端口
    mysqlUser: 'root',//mysql用户名
    mysqlPassword: '',//mysql密码
    mysqlDatabase: 'srf',//mysql数据库
    mongodbHost: '127.0.0.1',//mongodb地址
    mongodbPort: 27017,//mongodb端口
    mongodbDatabase: 'douban'//mongodb数据库
};

util.inherits(Production, common);
exports = module.exports = Production;