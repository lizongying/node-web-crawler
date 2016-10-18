/**
 * Created by michael on 2016-10-17.
 */
var config = require('../conf/config');
var conf = new config();

var urlList = [];

//获取目标地址
function UrlWorker(env, serverCount, serverCurrent, pushBegin, pushEnd) {
    this.serverCount = serverCount ? serverCount : conf.serverCount;
    this.serverCurrent = serverCurrent ? serverCurrent : conf.serverCurrent;
    this.pushBegin = pushBegin ? pushBegin : conf.pushBegin;
    this.pushEnd = pushEnd ? pushEnd : conf.pushEnd;
}

UrlWorker.prototype.get = function (callback) {
    var error = null;

    if (typeof(this.serverCount) === 'undefined' || this.serverCount < 1 || typeof(this.serverCurrent) === 'undefined') {
        error = {code: 0, message: '服务器配置错误'};
        callback('error');
        return;
    }

    for (var i = this.pushBegin; i < this.pushEnd; i++) {
        var isServer = i % this.serverCount;

        //不是当前服务器
        if (isServer !== this.serverCurrent) {
            continue;
        }

        var url = 'https://book.douban.com/subject/' + i;
        urlList.push(url);
    }

    //urlList.sort();

    callback(error, urlList);
};

exports = module.exports = UrlWorker;
