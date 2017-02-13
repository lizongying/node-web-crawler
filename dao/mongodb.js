/**
 * Created by michael on 2016-08-12.
 */
var utils = require('util');
var mongodb = require('mongodb');
var common = require('./common');
var colors = require('colors');
var Q = require('q');

// 设置
var config = require('../conf/config');
var conf = new config();

function Mongodb(host, port, user, password, database, authSource, authMechanism) {
    this._host = host;//数据库地址
    this._port = port;//数据库端口
    this._user = user;//数据库用户名
    this._password = password;//数据库密码
    this._database = database;
    this._authSource = authSource;
    this._authMechanism = authMechanism;
    this._client = null;
}

utils.inherits(Mongodb, common);

//连接
Mongodb.prototype.connect = function (s, e, callback) {
    var deferred = Q.defer();
    var ce = null;
    var cs = null;

    if (this._client) {
        cs = {code: 1, message: 'mongodb已初始化'};
        console.log(s.green);
        deferred.resolve(this._client);
        return callback ? deferred.promise.nodeify(callback(ce, cs)) : deferred.promise;
    }

    //创建连接
    this._host = this._host ? this._host : conf.mongodbHost;
    this._port = this._port ? this._port : conf.mongodbPort;
    this._user = this._user ? encodeURIComponent(this._user) : encodeURIComponent(conf.mongodbUser);
    this._password = this._password ? encodeURIComponent(this._password) : encodeURIComponent(conf.mongodbPassword);
    this._database = this._database ? this._database : conf.database;
    this._authSource = this._authSource ? this._authSource : conf.mongodbAuthSource;
    this._authMechanism = this._authMechanism ? this._authMechanism : conf.mongodbAuthMechanism;

    var url = utils.format('mongodb://%s:%s@%s:%s/%s?authMechanism=%s&authSource=%s', this._user, this._password, this._host, this._port, this._database, this._authMechanism, this._authSource);

    var that = this;
    mongodb.connect(url, function (error, result) {
        if (error) {
            ce = error;
            console.log(e.red);
            // console.log(error);
            deferred.reject(new Error(error));
        } else {
            that._client = result;
            cs = result;
            console.log(s.green);
            // console.log(result);
            deferred.resolve(result);
        }
    });

    return callback ? deferred.promise.nodeify(callback(ce, cs)) : deferred.promise;
};

//增加
Mongodb.prototype.insert = function (col, params, s, e, callback) {
    var deferred = Q.defer();
    var ce = null;
    var cs = null;

    var collection = this._client.collection(col);
    collection.insert(params, function (error, result) {
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
Mongodb.prototype.find = function (col, filter, options, s, e, callback) {
    var deferred = Q.defer();
    var ce = null;
    var cs = null;
    var collection = this._client.collection(col);
    collection.find(filter, options).toArray(function (error, result) {
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

//查询一个
Mongodb.prototype.findOne = function (col, query, options, s, e, callback) {
    var deferred = Q.defer();
    var ce = null;
    var cs = null;
    var collection = this._client.collection(col);
    collection.findOne(query, options, function (error, result) {
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
exports = module.exports = Mongodb;