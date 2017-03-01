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
var proxies = conf.proxies;//代理地址列表
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

var web = function () {
    var app = express();
    app.get('/count', function (req, res) {
        var query = {'isbn10': {'$exists': true}};
        var options = {};
        url_worker.count(query, options, '目标地址成功', '目标地址失败')
            .then(function (result) {
                reqState = '运行中';
                res.json({code: 1, message: 'ok', data: result});
            })
            .catch(function (error) {
                log_worker.add('debug', '获取目标地址错误', error.code);
            })
            .done();
    });
    app.get('/count1', function (req, res) {
        var query = {'isbn10': {'$ne': null}};
        var options = {};
        url_worker.count(query, options, '目标地址成功', '目标地址失败')
            .then(function (result) {
                reqState = '运行中';
                res.json({code: 1, message: 'ok', data: result});
            })
            .catch(function (error) {
                log_worker.add('debug', '获取目标地址错误', error.code);
            })
            .done();
    });
    app.get('/count3', function (req, res) {
        var query = {'isbn13': {'$exists': true}};
        var options = {};
        url_worker.count(query, options, '目标地址成功', '目标地址失败')
            .then(function (result) {
                reqState = '运行中';
                res.json({code: 1, message: 'ok', data: result});
            })
            .catch(function (error) {
                log_worker.add('debug', '获取目标地址错误', error.code);
            })
            .done();
    });
    app.get('/count4', function (req, res) {
        var query = {'isbn13': {'$ne': null}};
        var options = {};
        url_worker.count(query, options, '目标地址成功', '目标地址失败')
            .then(function (result) {
                reqState = '运行中';
                res.json({code: 1, message: 'ok', data: result});
            })
            .catch(function (error) {
                log_worker.add('debug', '获取目标地址错误', error.code);
            })
            .done();
    });
    app.get('/find', function (req, res) {
        var skip = req.query.p ? req.query.p * 100 : 0;

        var filter = {'isbn10': {'$exists': true}};
        var options = {'_id': 0, 'skip': skip, 'limit': 100};
        url_worker.page(filter, options, '目标地址成功', '目标地址失败')
            .then(function (result) {
                reqState = '运行中';
                res.json({code: 1, message: 'ok', data: result});
            })
            .catch(function (error) {
                log_worker.add('debug', '获取目标地址错误', error.code);
            })
            .done();
    });
    app.listen(3000, function () {
        console.log('app is listening at port 3000'.green);
    });
};

url_worker.init('地址初始化成功', '地址初始化失败')
    .then(function () {
        web();
    })
    .catch(function (error) {
        }
    )
    .done();