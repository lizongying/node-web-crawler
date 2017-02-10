/**
 * Created by michael on 2016-10-17.
 */
var colors = require('colors');
var Q = require('q');

var config = require('../../conf/config');
var conf = new config();

var dao = require('../../dao/');

//连接mysql
var db = new dao['mysql']();

//获取目标地址
function UrlWorker(serverCount, serverCurrent, database, urlTable) {
    this._serverCount = serverCount;
    this._serverCurrent = serverCurrent;
    this._database = database;
    this._urlTable = urlTable;
}

UrlWorker.prototype.init = function (s, e, callback) {
    var deferred = Q.defer();
    var ce = null;
    var cs = null;
    this._database = this._database ? this._database : conf.database;
    this._urlTable = this._urlTable ? this._urlTable : conf.urlTable;

    Q.all([
        db.connect('连接成功', '连接失败'),
        db.query('CREATE DATABASE IF NOT EXISTS ' + this._database + ' DEFAULT CHARSET=utf8', null, '创建数据库成功', '创建数据库失败'),
        db.query('use ' + this._database, null, '切换数据库成功', '切换数据库失败'),
        db.query('CREATE TABLE IF NOT EXISTS ' + this._urlTable + ' (`id` int(10) unsigned NOT NULL AUTO_INCREMENT,`site_id` int(10) unsigned NOT NULL,`url` varchar(255) NOT NULL,`created_at` int(10) unsigned NOT NULL,`updated_at` int(10) unsigned NOT NULL,`state` tinyint(3) unsigned NOT NULL,PRIMARY KEY (`id`),UNIQUE KEY `url` (`url`))', null, '创建地址表成功', '创建地址表失败')
    ])
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

UrlWorker.prototype.get = function (s, e, callback) {
    var deferred = Q.defer();
    var ce = null;
    var cs = null;
    this._serverCount = this._serverCount ? this._serverCount : conf.serverCount;
    this._serverCurrent = this._serverCurrent ? this._serverCurrent : conf.serverCurrent;
    if (typeof(this._serverCount) === 'undefined' || this._serverCount < 1 || typeof(this._serverCurrent) === 'undefined') {
        error = {code: 0, message: '服务器配置错误'};
        ce = error;
        console.log(e.red);
        deferred.reject(new Error(error));
        return callback ? deferred.promise.nodeify(callback(ce, cs)) : deferred.promise;
    }

    var querySql = 'SELECT url FROM ' + this._urlTable + ' ' +
        'WHERE mod(id, ' + this._serverCount + ') = ' + this._serverCurrent + ' ORDER BY url ASC';
    // console.log(querySql);

    db.query(querySql, null, '查询成功', '查询失败')
        .then(function (result) {

            // 测试
            var urlList = [1, 2];
            if (result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    var url = result[i].url;
                    urlList.push(url);
                }
            }

            cs = urlList;
            console.log(s.green);
            // console.log(urlList);
            deferred.resolve(urlList);
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

exports = module.exports = UrlWorker;
