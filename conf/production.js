/**
 * Created by michael on 2016-08-12.
 */
var util = require('util');
var common = require('./common');

function Production() {}

Production.prototype= {
    mysqlHost: 'rds33114q0a6t32npf55.mysql.rds.aliyuncs.com',//mysql地址
    mysqlPort: 3306,//mysql端口
    mysqlUser: 'shurufa',//mysql用户名
    mysqlPassword: 'Shurufame302',//mysql密码
    mysqlDatabase: 'srf',//mysql数据库
    mongodbHost: '127.0.0.1',//mongodb地址
    mongodbPort: 27017,//mongodb端口
    mongodbDatabase: 'douban'//mongodb数据库
};

util.inherits(Production, common);
exports = module.exports = Production;