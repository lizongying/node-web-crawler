/**
 * Created by michael on 2016-10-17.
 */

var config = require('../conf/config');
var conf = new config();

var dao = require('../dao/');
var path = require('path');

require('../lib/date.js');

//写入文件
var file = new dao['file']();
file.init(path.resolve(__dirname, '..'));

// log
function LogWorker(env, separator) {
    this.env = env ? env : conf.env;
    this.separator = separator ? separator : conf.separator;
}

LogWorker.prototype.add = function (level, title, content) {

    //判断环境
    switch (this.env) {
        case 'test':
            switch (level) {
                case 'debug':
                    console.log(title, content);
                    break;
                case 'info':
                    console.log(title, content);
                    break;
                case 'error':
                    console.log(title, content);
                    break;
                default :
                    break;
            }
            break;
        case 'production':
            switch (level) {
                case 'debug':
                    //console.log(title, content);
                    break;
                case 'info':
                    console.log(title, content);
                    this._WriteLog(level, title, content);
                    break;
                case 'error':
                    console.log(title, content);
                    this._WriteLog(level, title, content);
                    break;
                default :
                    break;
            }

            break;
        default :
            console.log(title, content);
            break;
    }
};

LogWorker.prototype._WriteLog = function(level, title, content) {
    var timeCurrent = new Date();

    //写入文件
    var logPath = '/log/' + level + '/' + timeCurrent.format('yyyy-MM-dd') + '.log';//文件名
    var logParams = [
        timeCurrent.format('HH:ii:ss'),
        level,
        title,
        content
    ];

    file.add(logPath, logParams.join(','), this.separator, function (err) {
        if (err) {
            // console.log('log', '写入文件失败');
        } else {
            //console.log('log', '写入文件成功');
        }
    });
}

exports = module.exports = LogWorker;
