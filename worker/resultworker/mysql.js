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

function ResultWorker(database, resultTable) {
    this._database = database;
    this._resultTable = resultTable;//结果表
}

ResultWorker.prototype.init = function (s, e, callback) {
    var deferred = Q.defer();
    var ce = null;
    var cs = null;
    this._database = this._database ? this._database : conf.database;
    this._resultTable = this._resultTable ? this._resultTable : conf.resultTable;

    Q.all([
        db.connect('连接成功', '连接失败'),
        db.query('CREATE DATABASE IF NOT EXISTS ' + this._database + ' DEFAULT CHARSET=utf8', null, '创建数据库成功', '创建数据库失败'),
        db.query('use ' + this._database, null, '切换数据库成功', '切换数据库失败'),
        db.query('CREATE TABLE IF NOT EXISTS ' + this._resultTable + ' (`id` int(10) unsigned NOT NULL AUTO_INCREMENT,`url` varchar(255) NOT NULL,`result` TEXT NOT NULL,`created_at` int(10) unsigned NOT NULL,`updated_at` int(10) unsigned NOT NULL,`state` tinyint(3) unsigned NOT NULL,PRIMARY KEY (`id`))', null, '创建结果表成功', '创建结果表失败')
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

ResultWorker.prototype.error = function (resultData, s, e, callback) {
    var deferred = Q.defer();
    var ce = null;
    var cs = null;

    //写入MySQL
    var sql = 'INSERT INTO ' + this._resultTable + '(' +
        'url, ' +
        'result, ' +
        'created_at, ' +
        'updated_at, ' +
        'state' +
        ') VALUES (' +
        '?, ' +
        '?, ' +
        '?, ' +
        '?, ' +
        '?' +
        ')';
    var logParams = [
        resultData.url,
        JSON.stringify(resultData.result),
        resultData.created_at,
        resultData.updated_at,
        resultData.state
    ];
    db.query(sql, logParams, '插入成功', '插入失败')
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

    //写入MySQL
    var sql = 'INSERT INTO ' + this._resultTable + '(' +
        'url, ' +
        'result, ' +
        'created_at, ' +
        'updated_at, ' +
        'state' +
        ') VALUES (' +
        '?, ' +
        '?, ' +
        '?, ' +
        '?, ' +
        '?' +
        ')';
    var logParams = [
        resultData.url,
        JSON.stringify(resultData.result),
        resultData.created_at,
        resultData.updated_at,
        resultData.state
    ];
    db.query(sql, logParams, '插入成功', '插入失败')
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

    //写入MySQL
    var sql = 'INSERT INTO ' + this._resultTable + '(' +
        'url, ' +
        'result, ' +
        'created_at, ' +
        'updated_at, ' +
        'state' +
        ') VALUES (' +
        '?, ' +
        '?, ' +
        '?, ' +
        '?, ' +
        '?' +
        ')';
    var logParams = [
        resultData.url,
        JSON.stringify(resultData.result),
        resultData.created_at,
        resultData.updated_at,
        resultData.state
    ];
    db.query(sql, logParams, '插入成功', '插入失败')
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
