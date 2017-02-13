/**
 * Created by michael on 2016-10-17.
 */
var colors = require('colors');
var Q = require('q');

var config = require('../../conf/config');
var conf = new config();

require('../../lib/date.js');

// log
function LogWorker(separator) {
    this._separator = separator;
}

LogWorker.prototype.init = function (s, e, callback) {
    var deferred = Q.defer();
    var ce = null;
    var cs = null;
    cs = s;
    console.log(s.green);
    deferred.resolve(s);
    return callback ? deferred.promise.nodeify(callback(ce, cs)) : deferred.promise;
};

LogWorker.prototype.add = function (level, title, content) {
    var timeCurrent = (new Date()).format('HH:ii:ss');
    switch (level) {
        case 'debug':
            console.log(timeCurrent, level.gray, title, content);
            break;
        case 'info':
            console.log(timeCurrent, (level + ' ').green, title, content);
            break;
        case 'error':
            console.log(timeCurrent, level.red, title, content);
            break;
        default :
            console.log(timeCurrent, level, title, content);
            break;
    }
};

exports = module.exports = LogWorker;