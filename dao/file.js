/**
 * Created by michael on 2016-08-12.
 */
var utils = require('util');
var fs = require('fs');
var _ = require('lodash');
var common = require('./common');
var colors = require('colors');
var Q = require('q');

function File() {
}

utils.inherits(File, common);

File.prototype.init = function (path, s, e, callback) {
    var deferred = Q.defer();
    var ce = null;
    var cs = null;

    // TODO 增加写入权限

    cs = s;
    console.log(s.green);
    deferred.resolve(this._client);

    return callback ? deferred.promise.nodeify(callback(ce, cs)) : deferred.promise;
};

//增加
File.prototype.add = function (file, params, separator, s, e, callback) {
    var deferred = Q.defer();
    var ce = null;
    var cs = null;

    var str = _.isString(params) ? params : JSON.stringify(params);
    str = str + separator;

    fs.appendFile(file, str, function (error, result) {
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

exports = module.exports = File;