/**
 * Created by michael on 2016-08-12.
 */
var utils = require('util');
var fs = require('fs');
var _ = require('lodash');
var common = require('./common');

function File() {
    this._path = '';
}

utils.inherits(File, common);

File.prototype.init = function (path) {
    //console.log(path);

    this._path = path;
    //console.log('file init');
};

//增加
File.prototype.add = function (file, params, separator, callback) {
    //console.log(file);
    //console.log(params);
    var uri = this._path + file;
    var str = _.isString(params) ? params : 'none';
    str = str + separator;
    fs.appendFile(uri, str, function (err) {
        callback(err);
    });
    //console.log('file add');
};

exports = module.exports = File;
