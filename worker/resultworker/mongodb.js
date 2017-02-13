/**
 * Created by michael on 2016-10-17.
 */
var colors = require('colors');
var Q = require('q');

var config = require('../../conf/config');
var conf = new config();

var dao = require('../../dao/');

// 连接mongodb
var mg = new dao['mongodb']();

function ResultWorker(resultTable) {
    this._resultTable = resultTable;//结果表
}

ResultWorker.prototype.init = function (s, e, callback) {
    var deferred = Q.defer();
    var ce = null;
    var cs = null;
    this._resultTable = this._resultTable ? this._resultTable : conf.resultTable;
    mg.connect('连接成功', '连接失败')
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

ResultWorker.prototype.error = function (resultData, s,e, callback) {
    var deferred = Q.defer();
    var ce = null;
    var cs = null;
    //mongodb
    var mongodbParams = resultData;
    mg.insert(this._resultTable, mongodbParams, '插入成功', '插入失败')
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

ResultWorker.prototype.false = function (resultData, s,e,  callback) {
    var deferred = Q.defer();
    var ce = null;
    var cs = null;
    //mongodb
    var mongodbParams = resultData;
    mg.insert(this._resultTable, mongodbParams, '插入成功', '插入失败')
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

ResultWorker.prototype.success = function (resultData, s,e, callback) {
    var deferred = Q.defer();
    var ce = null;
    var cs = null;
    //mongodb
    var mongodbParams = resultData;
    mg.insert(this._resultTable, mongodbParams, '插入成功', '插入失败')
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