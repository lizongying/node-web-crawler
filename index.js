/**
 * Created by michael on 2016-08-11.
 */
// 请求
var crawler = require('crawler');

// web
var express = require('express');

var colors = require('colors');
var Q = require('q');
var uuidV4 = require('uuid/v4');
var path = require('path');

var fs = require('fs');

// 拓展
require('./lib/array.js');
require('./lib/date.js');
require('./lib/string.js');
require('./lib/number.js');

// 设置
var config = require('./conf/config');
var conf = new config();

var urlWorker = conf.urlWorker;//地址worker，必须设置
var resultWorker = conf.resultWorker;//结果worker，必须设置
var logWorker = conf.logWorker;//日志worker，必须设置
var processor = conf.processor;//内容处理，必须设置
var resultToUrl = conf.resultToUrl;
var isAutoDownload = conf.isAutoDownload;//是否作为文件下载
var ext = conf.ext;
var serverCount = conf.serverCount;//服务器数量，必须设置
var serverCurrent = conf.serverCurrent;//当前服务器 （从0开始），必须设置
var reqInterval = conf.reqInterval;//重新请求间隔 ms
var maxConnections = conf.maxConnections;//最大连接
var rateLimit = conf.rateLimit;//任务间隔
var timeout = conf.timeout;//超时10,000（ms）默认60000
var retries = conf.retries;//重试次数 默认3
var retryTimeout = conf.retryTimeout;//重试超时
var referer = conf.referer;
var isProxy = conf.isProxy;//是否使用代理
var proxyList = conf.proxyList;//代理地址列表
var rotateUA = conf.rotateUA;
var userAgent = conf.userAgent;// 随机页头

var cCount = 0;//当前队列数量，不需要设置
var reqCount = 0;//请求数量
var rspCount = 0;//返回数量
var noneErrorCount = 0;//返回错误数量
var noneErrorErrorCount = 0;//保存返回错误失败数量
var noneErrorSuccessCount = 0;//保返回态错误成功数量
var stateErrorCount = 0;//状态错误数量
var stateErrorCount404 = 0;//状态404错误数量
var stateErrorCount403 = 0;//状态403错误数量
var stateErrorErrorCount = 0;//保存状态错误失败数量
var stateErrorSuccessCount = 0;//保存状态错误成功数量
var stateSuccessCount = 0;//状态正确数量
var stateSuccessErrorCount = 0;//保存状态正确失败数量
var stateSuccessSuccessCount = 0;//保存状态正确成功数量
var queryUrlErrorCount = 0;//获取目标地址错误次数
var queryUrlSuccessCount = 0;//获取目标地址成功次数
var queryUriCount = 0;//获取目标地址数量

var reqState = '准备中';//请求状态
var beginTime = '';//开始时间
var endTime = '';//结束时间
var urlList = [];//url列表
var reqUrl = '';//当前请求的url
var lastUrl = '';//最后返回的url
var successUrl = '';//最后成功url
var beginUrl = '';//开始的url
var endUrl = '';//结束的url

// 日志worker
var lWorker = require('./worker/logworker/' + logWorker);
var log_worker = new lWorker();

// 地址worker
var uWorker = require('./worker/urlworker/' + urlWorker);
var url_worker = new uWorker();

// 结果worker
var rWorker;
if (resultToUrl) {
    rWorker = require('./worker/urlworker/' + urlWorker);
} else {
    rWorker = require('./worker/resultworker/' + resultWorker);
}
var result_worker = new rWorker();

// 内容处理
var pr = require('./processor/' + processor);
var processor_worker = new pr();

var c = new crawler({
    maxConnections: maxConnections,
    rateLimit: rateLimit,
    timeout: timeout,
    retries: retries,
    retryTimeout: retryTimeout,
    referer: referer,
    rotateUA: rotateUA,
    userAgent: userAgent,
    callback: function (error, result, $) {
        cCount--;
        log_worker.add('debug', '当前队列数量', cCount);

        rspCount++;
        log_worker.add('debug', '返回数量', rspCount);

        resultStatus = result.statusCode;
        lastUrl = result.options.url;
        createTime = (new Date()).getTime().toString().substr(0, 10);

        //检查是否结束
        if (rspCount === queryUriCount) {
            log_worker.add('info', 'work', '已结束');
            reqUrl = '';
            reqState = '已结束';
            endTime = (new Date()).format('MM-dd HH:ii:ss');

            // 关闭url数据库
            // db.close();
        } else {
            if (isProxy) {
                var proxy = result.options.proxies[0];
                // console.log(proxy);

                // begin_craw(proxy);
            } else {
                // setTimeout(function () {
                //     begin_craw();
                // }, parseInt(Math.random() * reqInterval, 10));
            }
        }

        log_worker.add('info', 'processor', resultStatus + '    ' + lastUrl);

        // console.log(result);
        var resultData = {
            url: result.request.href,
            result: {},
            created_at: createTime,
            updated_at: createTime,
            state: result.statusCode
        };

        if (error) {
            noneErrorCount++;
            log_worker.add('debug', '返回错误数量', noneErrorCount);
            log_worker.add('error', '返回错误', proxy + '   ' + error);

            result_worker.error(resultData, '保存成功', '保存失败', function (err, res) {
                if (err) {
                    noneErrorErrorCount++;
                    log_worker.add('debug', '保存返回错误失败数量', noneErrorErrorCount);
                    log_worker.add('error', '保存返回错误失败', err);
                } else {
                    noneErrorSuccessCount++;
                    log_worker.add('debug', '保存返回错误成功数量', noneErrorSuccessCount);
                    log_worker.add('debug', '保存返回错误成功', res);
                }
            });

            return;
        }

        if (resultStatus !== 200) {
            switch (resultStatus) {
                case 404:
                    stateErrorCount404++;
                    break;
                case 403:
                    stateErrorCount403++;
                    break;
                default:
                    break;
            }
            stateErrorCount++;
            log_worker.add('debug', '状态错误数量', stateErrorCount);
            log_worker.add('debug', '状态错误', resultStatus);

            result_worker.false(resultData, '保存成功', '保存失败', function (err, res) {
                if (err) {
                    stateErrorErrorCount++;
                    log_worker.add('debug', '保存状态错误失败数量', stateErrorErrorCount);
                    log_worker.add('error', '保存状态错误失败', err);
                } else {
                    stateErrorSuccessCount++;
                    log_worker.add('debug', '保存状态错误成功数量', stateErrorSuccessCount);
                    log_worker.add('debug', '保存状态错误成功', res);
                }
            });

            return;
        }

        // 如果是文件
        if (result.options.encoding === null) {
            var savePath = 'download/' + uuidV4() + path.extname(result.request.href);
            fs.writeFile(path.join(__dirname, savePath), result.body, function (err) {
                if (!err) {
                    resultData.result.save_path = savePath;
                }
            });
        } else {
            processor_worker.handle(result, $, function (err, res) {
                if (!err) {
                    resultData.result = res;
                }
            });
        }

        result_worker.success(resultData, '保存成功', '保存失败', function (err, res) {
            if (err) {
                stateSuccessErrorCount++;
                log_worker.add('debug', '保存状态正确失败数量', stateSuccessErrorCount);
                log_worker.add('error', '保存状态正确失败', err);
            } else {
                stateSuccessSuccessCount++;
                log_worker.add('debug', '保存状态正确成功数量', stateSuccessSuccessCount);
                log_worker.add('debug', '保存状态正确成功', res);
                successUrl = lastUrl;
            }
        });

        stateSuccessCount++;
        log_worker.add('debug', '状态成功数量', stateSuccessCount);
    }
});

c.on('schedule',function(options){
    console.log('sssssssssssssssssssssss',options);
});

//开始爬取
function begin_craw(proxy) {
    //检查目标地址是否存在，应该在获取目标地址之后执行爬取
    if (urlList.length < 1) {
        log_worker.add('info', 'fetcher', 'finished');
        return;
    }

    //获取目标地址
    reqUrl = urlList.shift();

    log_worker.add('debug', '请求数据', reqUrl);
    var encoding = '';
    if (isAutoDownload) {
        if (path.extname(reqUrl).in_array(ext)) {
            encoding = null;
        }
    }
    var proxyies = [];
    if (proxy) {
        proxyies = [proxy];
    }

    c.queue([{
        uri: urlList,
        encoding: encoding,
        proxies: proxyies
    }]);

    cCount++;
    log_worker.add('debug', '当前队列数量', cCount);

    reqCount++;
    log_worker.add('debug', '请求数量', reqCount);
}

beginTime = new Date();

var web = function () {
    var app = express();
    app.get('/api', function (req, res) {
        var currentTime = new Date();
        var pass = currentTime.getTime() - beginTime.getTime();
        var speed = 0;

        if (reqState === '运行中') {
            speed = parseInt(rspCount / pass * 1000 * 3600);
        }

        var finishTime = parseInt((queryUriCount - rspCount) / (rspCount / pass));

        var return_data = {
            serverCount: {info: '服务器总数', val: serverCount},
            serverCurrent: {info: '当前服务器', val: serverCurrent},
            speed: {info: '当前速度', val: speed + '个/小时'},
            passTime: {info: '已过时间', val: currentTime.diff(beginTime)},
            currentTime: {info: '当前时间', val: currentTime.format('MM-dd HH:ii:ss')},
            beginTime: {info: '开始时间', val: beginTime.format('MM-dd HH:ii:ss')},
            finishTime: {
                info: '预计结束时间',
                val: finishTime > 0 ? (new Date(currentTime.getTime() + finishTime)).format('MM-dd HH:ii:ss') : ''
            },
            endTime: {info: '结束时间', val: endTime},
            reqState: {info: '请求状态', val: reqState},
            lastUrl: {info: '最后返回URL', val: lastUrl},
            successUrl: {info: '最后成功URL', val: successUrl},
            pushBegin: {info: '开始URL', val: beginUrl},
            pushEnd: {info: '结束URL', val: endUrl},
            reqUrl: {info: '当前请求URL', val: reqUrl},
            cCount: {info: '当前队列数量', val: cCount},
            queryUrlErrorCount: {info: '获取目标地址失败', val: queryUrlErrorCount},
            queryUrlSuccessCount: {info: '获取目标地址成功', val: queryUrlSuccessCount},
            queryUriCount: {info: '获取目标地址数量', val: queryUriCount},
            reqCount: {info: '请求数量', val: reqCount},
            rspCount: {info: '返回数量', val: rspCount},
            noneErrorCount: {info: '返回错误数量', val: noneErrorCount},
            noneErrorErrorCount: {info: '保存返回错误失败', val: noneErrorErrorCount},
            noneErrorSuccessCount: {info: '保存返回错误成功', val: noneErrorSuccessCount},
            stateErrorCount: {info: '状态错误数量', val: stateErrorCount},
            stateErrorCount404: {info: '状态404错误数量', val: stateErrorCount404},
            stateErrorCount403: {info: '状态403错误数量', val: stateErrorCount403},
            stateErrorErrorCount: {info: '保存状态错误失败', val: stateErrorErrorCount},
            stateErrorSuccessCount: {info: '保存状态错误成功', val: stateErrorSuccessCount},
            stateSuccessCount: {info: '状态成功数量', val: stateSuccessCount},
            stateSuccessErrorCount: {info: '保存状态正确失败', val: stateSuccessErrorCount},
            stateSuccessSuccessCount: {info: '保存状态正确成功', val: stateSuccessSuccessCount}
        };

        switch (parseInt(req.query.server)) {
            case serverCurrent:
                res.json({code: 1, message: 'ok', data: return_data});
                break;
            default:
                res.json({code: 0, message: 'not allow'});
                break;
        }
    });

    var pathname = __dirname + '/web';

    app.use(express.static(pathname));

    app.listen(3000, function () {
        console.log('app is listening at port 3000'.green);
    });
};

Q.all([
    log_worker.init('日志初始化成功', '日志初始化失败'),
    result_worker.init('结果初始化成功', '结果初始化失败'),
    url_worker.init('地址初始化成功', '地址初始化失败')
])
    .then(function () {
        url_worker.get('目标地址成功', '目标地址失败')
            .then(function (result) {
                reqState = '运行中';
                queryUrlSuccessCount++;
                log_worker.add('debug', '获取目标地址成功数量', queryUrlSuccessCount);
                log_worker.add('info', 'scheduler', 'ok');
                urlList = result;

                beginUrl = urlList[0];
                endUrl = urlList[urlList.length - 1];

                queryUriCount = urlList.length;
                log_worker.add('debug', '目标地址数量', urlList.length);

                log_worker.add('info', 'fetcher', 'beginning');

                if (isProxy) {

//    遍历代理 forEach是函数
                    proxyList.forEach(function (proxy) {
                        begin_craw(proxy);
                    });
                } else {
                    begin_craw();
                }
            })
            .catch(function (error) {
                log_worker.add('debug', '获取目标地址错误', error.code);
            })
            .done();
    })
    .then(function () {
        // web();
    })
    .catch(function (error) {
        }
    )
    .done();