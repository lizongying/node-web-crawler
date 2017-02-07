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

Mysql.prototype.init = function (conf, cb) {
    // console.log(conf);

    if (this._client) {
        // console.log(this._client);
        return;
    }

    //创建连接
    this._client = mysql.createConnection({
        host: conf.host ? conf.host : this._host,
        port: conf.port ? conf.port : this._port,
        user: conf.user ? conf.user : this._user,
        password: conf.password ? conf.password : this._password
    });
    var that = this;

    var cc = function (s, e) {
        var deferred = Q.defer();
        that._client.connect(function (err, res) {
            if (err) {
                // console.log(err);
                console.log(e.red);
                deferred.reject(new Error(e));
            } else {
                // console.log(res);
                console.log(s.green);
                deferred.resolve(s);
            }
        });

        return deferred.promise;
    };

    var cq = function (query, s, e) {
        var deferred = Q.defer();
        that._client.query(query, function (err, res) {
            if (err) {
                // console.log(err);
                console.log(e.red);
                deferred.reject(new Error(e));
            } else {
                // console.log(res);
                console.log(s.green);
                deferred.resolve(s);
            }
        });

        return deferred.promise;
    };

    Q.all(
        [
            cc('连接数据库成功', '连接数据库失败'),
            cq('CREATE DATABASE IF NOT EXISTS `node_web_crawler`', '创建数据库成功', '创建数据库失败'),
            cq('use `node_web_crawler`', '切换数据库成功', '切换数据库失败'),
            cq('CREATE TABLE IF NOT EXISTS `url` (`id` int(10) unsigned NOT NULL AUTO_INCREMENT,`site_id` int(10) unsigned NOT NULL,`url` varchar(255) NOT NULL,`created_at` int(10) unsigned NOT NULL,`updated_at` int(10) unsigned NOT NULL,`state` tinyint(3) unsigned NOT NULL,PRIMARY KEY (`id`),UNIQUE KEY `url` (`url`))', '创建地址表成功', '创建地址表失败')
        ]
    )
        .then(function (res) {
            console.log('数据库初始化成功'.green);
            cb(null, '数据库初始化成功')
        })
        .catch(function (err) {
            console.log('数据库初始化错误'.red);
            cb('数据库初始化错误');
        })
        .done();

    // console.log('mysql init');
};

//查询
Mysql.prototype.query = function (sql, callback) {
    this._client.query(sql, function (error, result) {
        callback(error, result);
    });
    //console.log(mysql query);
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