/**
 * Created by michael on 2016-08-12.
 */
var utils = require('util');
var mysql = require('mysql');
var common = require('./common');

function Mysql() {
    this._host = null;//数据库地址
    this._port = null;//数据库端口
    this._user = null;//数据库用户名
    this._password = null;//数据库密码
    this._database = null;//数据库
    this._client = null;
}

utils.inherits(Mysql, common);

Mysql.prototype.init = function (conf) {
    //console.log(conf);

    if (this._client) {
        //console.log(this._client);
        return;
    }

    //创建连接
    this._client = mysql.createConnection({
        host: conf.host ? conf.host : this._host,
        port: conf.port ? conf.port : this._port,
        user: conf.user ? conf.user : this._user,
        password: conf.password ? conf.password : this._password
    });
    this._client.connect();
    var database = conf.database ? conf.database : this._database;
    this._client.query('use ' + database);
    //console.log('mysql init');
};

//查询代理
Mysql.prototype.queryProxy = function (sql, callback) {
    this._client.query(sql, function (error, result) {
        callback(error, result);
    });
    //console.log(querySql);
};

//更新时间
Mysql.prototype.update = function (sql, callback) {
    this._client.query(sql, function (error, result) {
        callback(error, result);
    });
    //console.log(sql);
};

//增加
Mysql.prototype.add = function (sql, params, callback) {

    this._client.query(sql, params, function (error, result) {
        callback(error, result);
    });
    //console.log('mysql add');
};

exports = module.exports = Mysql;