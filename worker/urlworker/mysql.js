/**
 * Created by michael on 2016-10-17.
 */
var colors = require('colors');
var Q = require('q');

var config = require('../../conf/config');
var conf = new config();

var logWorker = conf.logWorker;//日志worker，必须设置

// 日志worker
var lWorker = require('../logworker/' + logWorker);
var log_worker = new lWorker();

var dao = require('../../dao/');

//连接mysql
var db = new dao['mysql']();
var mysqlConf = {
    host: conf.mysqlHost,
    port: conf.mysqlPort,
    user: conf.mysqlUser,
    password: conf.mysqlPassword,
    database: conf.mysqlDatabase
};

var urlList = [];

//获取目标地址
function UrlWorker(env, serverCount, serverCurrent, pushBegin, pushEnd, uri) {
    this.serverCount = serverCount ? serverCount : conf.serverCount;
    this.serverCurrent = serverCurrent ? serverCurrent : conf.serverCurrent;
    this.pushBegin = pushBegin ? pushBegin : conf.pushBegin;
    this.pushEnd = pushEnd ? pushEnd : conf.pushEnd;
    this.uri = uri ? uri : conf.uri;
}

UrlWorker.prototype.init = function (s, e, callback) {
    var deferred = Q.defer();
    var ce = null;
    var cs = null;
    db.init(mysqlConf, '数据库初始化成功', '数据库初始化失败')
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
    var error = null;

    if (typeof(this.serverCount) === 'undefined' || this.serverCount < 1 || typeof(this.serverCurrent) === 'undefined') {
        error = {code: 0, message: '服务器配置错误'};
        ce = error;
        console.log(e.red);
        deferred.reject(new Error(error));
        return callback ? deferred.promise.nodeify(callback(ce, cs)) : deferred.promise;
    }

    var tableUrl = 'url';
    var querySql = 'SELECT url FROM ' + tableUrl + ' ' +
        'WHERE mod(id, ' + this.serverCount + ') = ' + this.serverCurrent + ' ORDER BY url ASC';
    // log_worker.add('debug', '获取目标地址语句', querySql);

    db.query(querySql, '获取目标地址成功', '获取目标地址失败')
        .then(function (result) {

            var urlList = [];
            if (result.length > 0) {

                for (var i = 0; i < result.length; i++) {
                    var url = result[i].url;
                    urlList.push(url);
                }

                cs = urlList;
                console.log(s.green);
                // console.log(urlList);
                deferred.resolve(urlList);

                // //urlList.sort();
                // beginUrl = urlList[0];
                // endUrl = urlList[urlList.length - 1];
                //
                // queryUriCount = urlList.length;
                // crawler_log('debug', '目标地址数量', urlList.length);
                //
                // begin_craw();
            } else {
                error = '结果为空';
                ce = error;
                console.log(e.red);
                deferred.reject(new Error(error));
                //重新获取
                //setTimeout(add_id, addIDInterval);
            }
        })
        .catch(function (error) {
            ce = error;
            console.log(e.red);
            // console.log(error);
            deferred.reject(new Error(error));
        })
        .done();
    return callback ? deferred.promise.nodeify(callback(ce, cs)) : deferred.promise;

    for (var i = this.pushBegin; i < this.pushEnd; i++) {
        var isServer = i % this.serverCount;

        //不是当前服务器
        if (isServer !== this.serverCurrent) {
            continue;
        }

        var url = this.uri + i;
        urlList.push(url);
    }

    //urlList.sort();

    callback(error, urlList);
};

exports = module.exports = UrlWorker;
