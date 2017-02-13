/**
 * Created by michael on 2016-10-17.
 */
var colors = require('colors');
var Q = require('q');

var config = require('../../conf/config');
var conf = new config();

//获取目标地址
function UrlWorker(serverCount, serverCurrent, pushBegin, pushEnd, url) {
    this._serverCount = serverCount;
    this._serverCurrent = serverCurrent;
    this._pushBegin = pushBegin;
    this._pushEnd = pushEnd;
    this._url = url;
}

UrlWorker.prototype.init = function (s, e, callback) {
    var deferred = Q.defer();
    var ce = null;
    var cs = null;

    cs = s;
    console.log(s.green);
    // console.log(s);
    deferred.resolve(s);

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

    var urlList = [];
    this._pushBegin = this._pushBegin ? this._pushBegin : conf.pushBegin;
    this._pushEnd = this._pushEnd ? this._pushEnd : conf.pushEnd;
    this._url = this._url ? this._url : conf.url;

    for (var i = this._pushBegin; i < this._pushEnd; i++) {
        var isServer = i % this._serverCount;

        //不是当前服务器
        if (isServer !== this._serverCurrent) {
            continue;
        }

        var url = this._url + i;
        urlList.push(url);
    }

    cs = urlList;
    console.log(s.green);
    // console.log(urlList);
    deferred.resolve(urlList);
    return callback ? deferred.promise.nodeify(callback(ce, cs)) : deferred.promise;
};

exports = module.exports = UrlWorker;