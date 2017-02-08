/**
 * Created by michael on 2016-08-12.
 */
var utils = require('util');
var mysql = require('mysql');
var common = require('./common');
var colors = require('colors');
var Q = require('q');

function Mysql() {
    this._host = null;//数据库地址
    this._port = null;//数据库端口
    this._user = null;//数据库用户名
    this._password = null;//数据库密码
    this._database = null;//数据库
    this._client = null;
}

utils.inherits(Mysql, common);

Mysql.prototype.init = function (conf, s, e, callback) {
    var deferred = Q.defer();
    var ce = null;
    var cs = null;
    if (this._client) {
        cs = {code: 1, message: '数据库已初始化'};
        console.log(s.green);
        deferred.resolve(this._client);
        return callback ? deferred.promise.nodeify(callback(ce, cs)) : deferred.promise;
    }

    //创建连接
    this._client = mysql.createConnection({
        host: conf.host ? conf.host : this._host,
        port: conf.port ? conf.port : this._port,
        user: conf.user ? conf.user : this._user,
        password: conf.password ? conf.password : this._password
    });

    Q.all(
        [
            this.connect('连接数据库成功', '连接数据库失败'),
            this.query('CREATE DATABASE IF NOT EXISTS `node_web_crawler`', '创建数据库成功', '创建数据库失败'),
            this.query('use `node_web_crawler`', '切换数据库成功', '切换数据库失败'),
            this.query('CREATE TABLE IF NOT EXISTS `url` (`id` int(10) unsigned NOT NULL AUTO_INCREMENT,`site_id` int(10) unsigned NOT NULL,`url` varchar(255) NOT NULL,`created_at` int(10) unsigned NOT NULL,`updated_at` int(10) unsigned NOT NULL,`state` tinyint(3) unsigned NOT NULL,PRIMARY KEY (`id`),UNIQUE KEY `url` (`url`))', '创建地址表成功', '创建地址表失败')
        ]
    )
        .then(function (result) {
            cs = result;
            console.log(s.green);
            // console.log(result);
            deferred.resolve(result);
        })
        .catch(function (error) {
            ce = error;
            console.log(e.red);
            // console.log(error);
            deferred.reject(new Error(error));
        })
        .done();

    return callback ? deferred.promise.nodeify(callback(ce, cs)) : deferred.promise;
};

//连接
Mysql.prototype.connect = function (s, e, callback) {
    var deferred = Q.defer();
    var ce = null;
    var cs = null;
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
Mysql.prototype.query = function (sql, s, e, callback) {
    var deferred = Q.defer();
    var ce = null;
    var cs = null;
    this._client.query(sql, function (error, result) {
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

//更新
Mysql.prototype.update = function (sql, callback) {
    this._client.query(sql, function (error, result) {
        callback(error, result);
    });
    //console.log(mysql update);
};

//增加
Mysql.prototype.add = function (sql, params, callback) {

    this._client.query(sql, params, function (error, result) {
        callback(error, result);
    });
    //console.log('mysql add');
};

exports = module.exports = Mysql;