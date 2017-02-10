/**
 * Created by michael on 2016-10-17.
 */
var colors = require('colors');
var Q = require('q');

var config = require('../../conf/config');
var conf = new config();

var path = require('path');

require('../../lib/date.js');

//写入文件
var dao = require('../../dao/');
var file = new dao['file']();

// log
function LogWorker(separator) {
    this._separator = separator;
}

LogWorker.prototype.init = function (s, e, callback) {
    var deferred = Q.defer();
    var ce = null;
    var cs = null;
    this._separator = this._separator ? this._separator : conf.separator;

    file.init(path.resolve(__dirname, '..'), '连接成功', '连接失败')
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

LogWorker.prototype.add = function (level, title, content) {
    var timeCurrent = new Date();

    //写入文件
    var logPath = path.resolve('log', level + '/' + timeCurrent.format('yyyy-MM-dd') + '.log');//文件名
    var logParams = [
        timeCurrent.format('HH:ii:ss'),
        level,
        title,
        content
    ];

    file.add(logPath, logParams, this._separator, '插入成功', '插入失败')
        .then(function (result) {
            // console.log(result);
        })
        .catch(function (error) {
            // console.log(error);
        })
        .done();
};

exports = module.exports = LogWorker;
