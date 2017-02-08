/**
 * Created by michael on 2016-08-12.
 */
var util = require('util');
var common = require('./common');

function Test() {
}

Test.prototype = {
    mysqlHost: '127.0.0.1',//mysql地址
    mysqlPort: 3306,//mysql端口
    mysqlUser: 'root',//mysql用户名
    mysqlPassword: 'root',//mysql密码
    mysqlDatabase: 'srf',//mysql数据库
    mongodbHost: '127.0.0.1',//mongodb地址
    mongodbPort: 27017,//mongodb端口
    mongodbUser: 'myTester',//mongodb用户名
    mongodbPassword: 'xyz123',//mongodb密码
    mongodbDatabase: 'douban'//mongodb数据库
};

util.inherits(Test, common);
exports = module.exports = Test;