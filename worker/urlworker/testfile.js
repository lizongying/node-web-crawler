/**
 * Created by michael on 2016-10-17.
 */
var colors = require('colors');
var Q = require('q');

var config = require('../../conf/config');
var conf = new config();

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

    this._url = [
        'http://pic.baike.soso.com/p/20131213/20131213115637-1062134399.jpg',
        'https://www.baidu.com/img/bd_logo1.png'
    ]; //目标地址

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

    var urlList = this._url;

    cs = urlList;
    console.log(s.green);
    // console.log(urlList);
    deferred.resolve(urlList);
    return callback ? deferred.promise.nodeify(callback(ce, cs)) : deferred.promise;
};

exports = module.exports = UrlWorker;