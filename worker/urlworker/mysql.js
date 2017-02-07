/**
 * Created by michael on 2016-10-17.
 */
var config = require('../../conf/config');
var conf = new config();

var dao = require('../../dao/');

//连接mysql
var db = new dao['mysql']();
var mysqlConf = {
   host: conf.mysqlHost,
   port: conf.mysqlPort,
   user: conf.mysqlUser,
   password: conf.mysqlPassword,
   database: conf.mysqlDatabase
};

db.init(mysqlConf);
console.log(mysqlConf);
console.log(db);

var urlList = [];

//获取目标地址
function UrlWorker(env, serverCount, serverCurrent, pushBegin, pushEnd, uri) {
    this.serverCount = serverCount ? serverCount : conf.serverCount;
    this.serverCurrent = serverCurrent ? serverCurrent : conf.serverCurrent;
    this.pushBegin = pushBegin ? pushBegin : conf.pushBegin;
    this.pushEnd = pushEnd ? pushEnd : conf.pushEnd;
    this.uri = uri ? uri : conf.uri;
}

UrlWorker.prototype.get = function (callback) {
    var error = null;

    if (typeof(this.serverCount) === 'undefined' || this.serverCount < 1 || typeof(this.serverCurrent) === 'undefined') {
        error = {code: 0, message: '服务器配置错误'};
        callback('error');
        return;
    }

    var tableUrl = 'srf_crawler_url';
    var querySql = 'SELECT url FROM ' + tableUrl + ' ' +
        'WHERE mod(id, ' + this.serverCount + ') = ' + this.serverCurrent + ' ORDER BY url ASC';
    // crawler_log('debug', '获取目标地址语句', querySql);

    db.query(querySql, function (err, res) {
        if (err) {
            queryUrlErrorCount++;
            crawler_log('debug', '获取目标地址错误数量', queryUrlErrorCount);
            crawler_log('error', '获取目标地址错误', err);
            return;
        }
        if (res.length > 0) {
            queryUrlSuccessCount++;
            crawler_log('debug', '获取目标地址成功数量', queryUrlSuccessCount);


            for (var i = 0; i < res.length; i++) {
                var url = res[i].url;
                urlList.push(url);
            }

            //urlList.sort();
            beginUrl = urlList[0];
            endUrl = urlList[urlList.length - 1];

            queryUriCount = urlList.length;
            crawler_log('debug', '目标地址数量', urlList.length);

            begin_craw();
        } else {

            //重新获取
            //setTimeout(add_id, addIDInterval);
        }
    });

    for (var i = this.pushBegin; i < this.pushEnd; i++) {
        var isServer = i % this.serverCount;

        //不是当前服务器
        if (isServer !== this.serverCurrent) {
            continue;
        }

        var url = this.uri + i;
        urlList.push(url);
    }

    //urlList.sort();

    callback(error, urlList);
};

exports = module.exports = UrlWorker;
