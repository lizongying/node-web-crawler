/**
 * Created by michael on 2016-08-12.
 */
var utils = require('util');
var mongodb = require('mongodb');
var common = require('./common');

function Mongodb() {
    this._host = null;//数据库地址
    this._port = null;//数据库端口
    this._user = null;//数据库用户名
    this._password = null;//数据库密码
    this._database = null;//数据库
    this._client = null;
}

utils.inherits(Mongodb, common);

Mongodb.prototype.init = function (conf, callback) {
    //console.log(conf);

    if (this._client) {
        //console.log(this._client);
        return;
    }

    //创建连接
    var host = conf.host ? conf.host : this._host;
    var port = conf.port ? conf.port : this._port;
    var user = conf.user ? conf.user : this._user;
    var password = conf.password ? conf.password : this._password;
    var database = conf.database ? conf.database : this._database;
    //var server = new mongodb.Server(host, port, {auto_reconnect: true});
    //this._client = new mongodb.Db(database, server, {salf: true});
    // Connection URL
    var url = 'mongodb://' + host + ':' + port + '/' + database;
    //console.log(url);
    // Use connect method to connect to the server
    mongodb.connect(url, function (err, db) {
        //assert.equal(null, err);
        Mongodb._client = db;
        callback(err);
        //console.log(err);
        //console.log(Mongodb._client);
        //console.log("Connected successfully to server");
    });
    //console.log('mongodb init');
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