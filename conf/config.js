/**
 * Created by michael on 2016-10-18.
 */
var config = require(__dirname);

var env = 'test';//环境 test或production
var conf = new config[env]();

function Config() {
    this.env = env;

    for (var i in conf) {
        this[i] = conf[i];
    }
}

exports = module.exports = Config;

