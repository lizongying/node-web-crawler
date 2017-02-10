/**
 * Created by michael on 2016-10-17.
 */
var colors = require('colors');
var Q = require('q');

var config = require('../../conf/config');
var conf = new config();

var path = require('path');
var dao = require('../../dao/');

//写入文件
var file = new dao['file']();

function ResultWorker(resultTable,separator) {
    this._resultTable = resultTable;//结果表
    this._separator = separator;
}

ResultWorker.prototype.init = function (s, e, callback) {
    var deferred = Q.defer();
    var ce = null;
    var cs = null;
    this._resultTable = this._resultTable ? this._resultTable : conf.resultTable;
    this._separator = this._separator ? this._separator:conf.separator;

    file.init(__dirname, '连接成功', '连接失败')
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

ResultWorker.prototype.error = function (resultData, s, e, callback) {
    var deferred = Q.defer();
    var ce = null;
    var cs = null;
    var logPath = path.resolve('data', this._resultTable + '.txt');//文件名
    var mongodbParams = resultData;
    file.add(logPath, mongodbParams, this._separator, '插入成功', '插入失败')
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

ResultWorker.prototype.false = function (resultData, s, e, callback) {
    var deferred = Q.defer();
    var ce = null;
    var cs = null;
    var logPath = path.resolve('data', this._resultTable + '.txt');//文件名
    var mongodbParams = resultData;
    file.add(logPath, mongodbParams, this._separator, '插入成功', '插入失败')
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

ResultWorker.prototype.success = function (resultData, s, e, callback) {
    var deferred = Q.defer();
    var ce = null;
    var cs = null;
    var logPath = path.resolve('data', this._resultTable + '.txt');//文件名
    var mongodbParams = resultData;
    file.add(logPath, mongodbParams, this._separator, '插入成功', '插入失败')
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

exports = module.exports = ResultWorker;
