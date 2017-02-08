/**
 * Created by michael on 2016-08-12.
 */
var utils = require('util');
var mongodb = require('mongodb');
var common = require('./common');
var colors = require('colors');
var Q = require('q');

function Mongodb() {
    this._host = null;//数据库地址
    this._port = null;//数据库端口
    this._user = null;//数据库用户名
    this._password = null;//数据库密码
    this._database = null;//数据库
    this._client = null;
}

utils.inherits(Mongodb, common);

Mongodb.prototype.init = function (conf, s, e, callback) {
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
    var host = conf.host ? conf.host : this._host;
    var port = conf.port ? conf.port : this._port;
    var user = conf.user ? encodeURIComponent(conf.user) : this._user;
    var password = conf.password ? encodeURIComponent(conf.password) : this._password;
    var database = conf.database ? conf.database : this._database;
    //var server = new mongodb.Server(host, port, {auto_reconnect: true});
    //this._client = new mongodb.Db(database, server, {salf: true});
    // Connection URL

    var authMechanism = 'DEFAULT';
    var authSource = 'test';

// Connection URL
    var url = utils.format('mongodb://%s:%s@%s:%s?authMechanism=%s&authSource=', user, password, host,port,authMechanism, authSource);

    // var url = 'mongodb://' + host + ':' + port + '/' + database;
    console.log(url.toString());
    // Use connect method to connect to the server
    this.connect(url, '连接mongodb成功', '连接mongodb失败')
        .then(function (result) {
            cs = result;
            console.log(s.green);
            console.log(result);
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

//连接
Mongodb.prototype.connect = function (url, s, e, callback) {
    var deferred = Q.defer();
    var ce = null;
    var cs = null;
    mongodb.connect(url, function (error, result) {
        if (error) {
            ce = error;
            console.log(e.red);
            // console.log(error);
            deferred.reject(new Error(error));
        } else {
            Mongodb._client = result;
            cs = result;
            console.log(s.green);
            // console.log(result);
            deferred.resolve(result);
        }
    });

    return callback ? deferred.promise.nodeify(callback(ce, cs)) : deferred.promise;
};

//增加
Mongodb.prototype.add = function (col, params, callback) {
    //console.log(col);
    //console.log(params);
    //console.log(Mongodb._client);

    // Get the documents collection
    var collection = Mongodb._client.collection(col);
    // Insert some documents
    collection.insert(params, function (error, result) {
        //console.log("Inserted 3 documents into the collection");
        callback(error, result);
    });

    //console.log('mongodb add');
};

exports = module.exports = Mongodb;