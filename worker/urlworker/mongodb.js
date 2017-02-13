/**
 * Created by michael on 2016-10-17.
 */
var colors = require('colors');
var Q = require('q');

var config = require('../../conf/config');
var conf = new config();

var dao = require('../../dao/');

//连接mongodb
var mg = new dao['mongodb']();

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
    this._urlTable = this._urlTable ? this._urlTable : conf.urlTable;
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

    // var querySql = 'SELECT url FROM ' + this._urlTable + ' ' +
    //     'WHERE mod(id, ' + this._serverCount + ') = ' + this._serverCurrent + ' ORDER BY url ASC';
    // console.log(querySql);

    var filter = {};
    var options = {'url': 1, '_id': 0};
    mg.find(this._urlTable, filter, options, '查询成功', '查询失败')
        .then(function (result) {
            // 测试
            var urlList = [];
            if (result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    var url = result[i].url;
                    urlList.push(url);
                }
            }

            cs = urlList;
            console.log(s.green);
            // console.log(urlList);
            deferred.resolve(urlList);
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

UrlWorker.prototype.success = function (resultData, s, e, callback) {
    // var resultData = [resultData, resultData];

    var deferred = Q.defer();
    var ce = null;
    var cs = null;
    //mongodb
    var that = this;
    var query = {};
    var options = {fields: {'id': 1, '_id': 0}, sort: {'_id': -1}};

    var fo = function (r) {
        mg.findOne(that._urlTable, query, options, '查询成功', '查询失败')
            .then(function (result) {
                // cs = result;
                // console.log(s.green);
                // console.log(result);
                // deferred.resolve(result);

                var mongodbParams = {
                    id: result.id + 1,
                    site_id: 2,
                    url: r.created_at,
                    created_at: r.created_at,
                    updated_at: r.updated_at,
                    state: 0
                };

                mg.insert(that._urlTable, mongodbParams, '插入成功', '插入失败')
                    .then(function (result) {
                        cs = result;
                        console.log(s.green);
                        // console.log(result);
                        deferred.resolve(result);
                        i++;
                        if (i < max) {
                            fo(resultData[i]);
                        }
                    })
                    .catch(function (error) {
                        ce = error;
                        console.log(e.red);
                        // console.log(error);
                        deferred.reject(new Error(error));
                    })
                    .done();
            })
            .catch(function (error) {
                ce = error;
                console.log(e.red);
                // console.log(error);
                deferred.reject(new Error(error));
            })
            .done();
    };

    if (typeof resultData === 'object' && resultData.constructor === Array) {
        var i = 0;
        var max = resultData.length;
        fo(resultData[i]);
    } else {
        fo(resultData);
    }


    return callback ? deferred.promise.nodeify(callback(ce, cs)) : deferred.promise;
};

exports = module.exports = UrlWorker;
