/**
 * Created by michael on 2016-08-12.
 */
var utils = require('util');
var mysql = require('mysql');
var common = require('./common');
var colors = require('colors');
var Q = require('q');

// 设置
var config = require('../conf/config');
var conf = new config();

function Mysql(host, port, user, password) {
    this._host = host;//数据库地址
    this._port = port;//数据库端口
    this._user = user;//数据库用户名
    this._password = password;//数据库密码
    this._client = null;
}

utils.inherits(Mysql, common);

//连接
Mysql.prototype.connect = function (s, e, callback) {
    var deferred = Q.defer();
    var ce = null;
    var cs = null;

    if (this._client) {
        cs = {code: 1, message: 'mysql已初始化'};
        console.log(s.green);
        deferred.resolve(this._client);
        return callback ? deferred.promise.nodeify(callback(ce, cs)) : deferred.promise;
    }

    //创建连接
    this._client = mysql.createConnection({
        host: this._host ? this._host : conf.mysqlHost,
        port: this._port ? this._port : conf.mysqlPort,
        user: this._user ? this._user : conf.mysqlUser,
        password: this._password ? this._password : conf.mysqlPassword
    });

    this._client.connect(function (error, result) {
        if (error) {
            ce = error;
            console.log(e.red);
            // console.log(error);
            deferred.reject(new Error(error));
        } else {
            cs = result;
            console.log(s.green);
            // console.log(result);
            deferred.resolve(result);
        }
    });

    return callback ? deferred.promise.nodeify(callback(ce, cs)) : deferred.promise;
};

//查询
Mysql.prototype.query = function (sql, params, s, e, callback) {
    // console.log(sql);
    var deferred = Q.defer();
    var ce = null;
    var cs = null;
    this._client.query(sql, params, function (error, result) {
        if (error) {
            ce = error;
            console.log(e.red);
            // console.log(error);
            deferred.reject(new Error(error));
        } else {
            cs = result;
            console.log(s.green);
            // console.log(result);
            deferred.resolve(result);
        }
    });

    return callback ? deferred.promise.nodeify(callback(ce, cs)) : deferred.promise;
};

exports = module.exports = Mysql;