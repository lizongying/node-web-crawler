/**
 * Created by michael on 2016-10-17.
 */

var dao = require('../dao/');
var path = require('path');
require('../lib/date.js');

//写入文件
var file = new dao['file']();
file.init(path.resolve(__dirname, '..'));

// log
function LogWorker(env, separator, logPath, logParams) {
    this.env = env;
    this.separator = separator;
    this.logPath = logPath;
    this.logParams = logParams;
}

LogWorker.prototype.add = function (level, title, content) {
    var timeCurrent = new Date();

    //判断环境
    switch (this.env) {
        case 'test':
            switch (level) {
                case 'debug':
                    console.log(title, content);
                    break;
                case 'info':
                    //console.log(title, content);
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
                    break;
                case 'error':
                    //console.log(title, content);
                    break;
                default :
                    break;
            }

            //写入文件
            this.logPath = '/log/' + level + '/' + timeCurrent.format('yyyy-MM-dd') + '.log';//文件名
            this.logParams = [
                timeCurrent.format('HH:ii:ss'),
                level,
                title,
                content
            ];

            file.add(this.logPath, this.logParams.join(','), this.separator, function (err) {
                if (err) {
                    console.log('debug', '写入文件失败');
                } else {
                    //console.log('debug', '写入文件成功');
                }
            });
            break;
        default :
            console.log(title, content);
            break;
    }
};

exports = module.exports = LogWorker;
