/**
 * Created by michael on 2016-08-11.
 */
var crawler = require('crawler');
var express = require('express');

var logWorker = require('./worker/logworker');
var urlWorker = require('./worker/urlworker');
var resultWorker = require('./worker/resultworker');

require('./lib/array.js');
require('./lib/date.js');

var config = require('./conf/config');
var conf = new config();

var serverCount = conf.serverCount;//服务器数量，必须设置
var serverCurrent = conf.serverCurrent;//当前服务器 （从0开始），必须设置
var uri = conf.uri;//目标地址
var pushBegin = conf.pushBegin;//开始id，包括 (全部服务器)
var pushEnd = conf.pushEnd;//结束id，不包括 (全部服务器)
var uriCountMin = conf.uriCountMin;//目标地址数量最小值
var maxConnections = conf.maxConnections;//最大连接
var timeout = conf.timeout;//超时10,000（ms）默认60000
var retries = conf.retries;//重试次数 默认3
var retryTimeout = conf.retryTimeout;//重试超时
var reqInterval = conf.reqInterval;//重新请求间隔 ms
var userAgent = conf.userAgent;// 随机页头
var isProxy = conf.isProxy;//是否使用代理
var proxyList = conf.proxyList;//代理地址列表

var cCount = 0;//当前队列数量，不需要设置
var reqCount = 0;//请求数量
var rspCount = 0;//返回数量
var noneErrorCount = 0;//返回错误数量
var noneErrorErrorCount = 0;//保存返回错误失败数量
var noneErrorSuccessCount = 0;//保返回态错误成功数量
var stateErrorCount = 0;//状态错误数量
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

var log_worker = new logWorker(); //log
var url_worker = new urlWorker(); //获取地址
var result_worker = new resultWorker(); //保存结果

var c = new crawler({
    maxConnections: maxConnections,
    timeout: timeout,
    retries: retries,
    retryTimeout: retryTimeout,
    callback: function (error, result, $) {

        cCount--;
        log_worker.add('debug', '当前队列数量', cCount);

        rspCount++;
        log_worker.add('debug', '返回数量', rspCount);

        resultStatus = result.statusCode;
        lastUrl = result.options.uri;
        createTime = (new Date()).getTime().toString().substr(0, 10);

        if (error) {
            noneErrorCount++;
            log_worker.add('debug', '返回错误数量', noneErrorCount);
            log_worker.add('error', '返回错误', error);

            result_worker.error(resultStatus, lastUrl, createTime, function (err, res) {
                if (err) {
                    noneErrorErrorCount++;
                    log_worker.add('debug', '保存返回错误失败数量', noneErrorErrorCount);
                    log_worker.add('error', '保存返回错误失败', err);
                } else {
                    noneErrorSuccessCount++;
                    log_worker.add('debug', '保存返回错误成功数量', noneErrorSuccessCount);
                    log_worker.add('debug', '保存返回错误成功', res.ops);
                }
            });

            //检查是否结束
            if (rspCount === queryUriCount) {
                log_worker.add('info', 'work', '已结束');
                reqUrl = '';
                reqState = '已结束';
                endTime = (new Date()).format('MM-dd HH:ii:ss');

                // 关闭url数据库
                // db.close();
            }
            return;
        }

        if (resultStatus != 200) {
            stateErrorCount++;
            log_worker.add('debug', '状态错误数量', stateErrorCount);
            log_worker.add('debug', '状态错误', resultStatus);

            result_worker.false(resultStatus, lastUrl, createTime, function (err, res) {
                if (err) {
                    stateErrorErrorCount++;
                    log_worker.add('debug', '保存状态错误失败数量', stateErrorErrorCount);
                    log_worker.add('error', '保存状态错误失败', err);
                } else {
                    stateErrorSuccessCount++;
                    log_worker.add('debug', '保存状态错误成功数量', stateErrorSuccessCount);
                    log_worker.add('debug', '保存状态错误成功', res.ops);
                }
            });

            //检查是否结束
            if (rspCount === queryUriCount) {
                log_worker.add('info', 'work', '已结束');
                reqUrl = '';
                reqState = '已结束';
                endTime = (new Date()).format('MM-dd HH:ii:ss');

                // 关闭url数据库
                // db.close();
            }

            return;
        }

        // console.log(resultStatus);
        // proxy = result.options.proxies[0];

        var douban_id = lastUrl.replace(/[^0-9]/ig, '');

        var rating = $("#wrapper .rating_num").text();
        //console.log(rating);

        var title = $("#wrapper h1 span").text().trim();
        //console.log(title);

        var authors = [];
        var translators = [];

        $("#info span").each(function () {
            if ($(this).find(".pl").text().trim() == "作者") {
                $(this).find("a").each(function () {
                    authors.push($(this).text())
                });
            }
            if ($(this).find(".pl").text().trim() == "译者") {
                $(this).find("a").each(function () {
                    translators.push($(this).text())
                });
            }
        });
        var author = authors.join(",");
        //console.log(author);

        var translator = translators.join(",");
        //console.log(translator);

        var info = $("#info").text().split("\n");
        var subtitle = '';
        var pubdate = '';
        var origin_title = '';
        var binding = '';
        var pages = '';
        var isbn13 = '';
        var publisher = '';
        var series = '';
        var price = '';

        for (var i = 0; i < info.length; i++) {
            //console.log(info[i]);
            var regSubtitle = /[\u6807][\u9898]\:(?:(\s*)[^\s]+)/g;
            if (regSubtitle.test(info[i])) {
                subtitle = info[i].replace("副标题:", "").trim();
                //console.log(subtitle);
            }
            var regPubdate = /[\u7248][\u5e74]\:(?:(\s*)[^\s]+)/g;
            if (regPubdate.test(info[i])) {
                pubdate = info[i].replace("出版年:", "").trim();
                //console.log(pubdate);
            }
            var regOrigin = /[\u4f5c][\u540d]\:(?:(\s*)[^\s]+)/g;
            if (regOrigin.test(info[i])) {
                origin_title = info[i].replace("原作名:", "").trim();
                //console.log(origin_title);
            }
            var regbinding = /[\u88c5][\u5e27]\:(?:(\s*)[^\s]+)/g;
            if (regbinding.test(info[i])) {
                binding = info[i].replace("装帧:", "").trim();
                //console.log(binding);
            }
            var regPages = /[\u9875][\u6570]\:(?:(\s*)[^\s]+)/g;
            if (regPages.test(info[i])) {
                pages = info[i].replace("页数:", "").trim();
                //console.log(pages);
            }
            var regPublisher = /[\u7248][\u793e]\:(?:(\s*)[^\s]+)/g;
            if (regPublisher.test(info[i])) {
                publisher = info[i].replace("出版社:", "").trim();
                //console.log(publisher);
            }
            var regISBN = /ISBN\:(?:(\s*)[^\s]+)/g;
            if (regISBN.test(info[i])) {
                var ISBN = info[i].replace("ISBN:", "").trim();
                if (ISBN.length == 13) {
                    isbn13 = ISBN;
                    //console.log(isbn13);
                }
            }
            var regSeries = /[\u4e1b][\u4e66]\:(?:(\s*)[^\s]+)/g;
            if (regSeries.test(info[i])) {
                series = info[i].replace("丛书:", "").trim();
                //console.log(series);
            }
            var regPrice = /[\u5b9a][\u4ef7]\:(?:(\s*)[^\s]+)/g;
            if (regPrice.test(info[i])) {
                price = info[i].replace("定价:", "").trim();
                //console.log(price);
            }
        }
        var tags = [];
        $("#db-tags-section .tag").each(function () {
            tags.push($(this).text());
            //console.log($(this).text());
        });

        var tag = tags.join(",");
        var alt = uri + douban_id;
        var url = "https://api.douban.com/v2/book/" + douban_id;
        var alt_title = origin_title;
        var intro = [];
        $(".intro").each(function () {
            intro.push($(this).text());
            //console.log($(this).index() + $(this).text());
        });
        var author_intro = '';
        var summary = $("#link-report .intro").text().trim();
        //console.log(summary);

        if (intro.length > 1) {
            var author_intro = intro[1];
        }
        var catalog = $("#dir_" + douban_id + "_full").text().replace("· · · · · ·     (收起)", "").replace("目 录", "").trim();
        //console.log(catalog);

        var large = $("#mainpic a").attr("href");
        //console.log(large);

        var isbn10 = '';
        $("#borrowinfo a").each(function () {
            var u = $(this).attr("href");
            var regU = /\d{10}/;
            var isbnU = u.match(regU);
            if (isbnU) {
                isbn10 = isbnU[0];
                //console.log(isbn10);
            }
        });

        resultData = {
            rating: rating,
            subtitle: subtitle,
            author: author,
            pubdate: pubdate,
            tag: tag,
            origin_title: origin_title,
            large: large,
            binding: binding,
            translator: translator,
            catalog: catalog,
            pages: pages,
            alt: alt,
            douban_id: douban_id,
            publisher: publisher,
            isbn10: isbn10,
            isbn13: isbn13,
            title: title,
            url: url,
            alt_title: alt_title,
            author_intro: author_intro,
            summary: summary,
            series: series,
            price: price,
            create_time: createTime
        };

        result_worker.success(resultData, resultStatus, lastUrl, createTime, function (err, res) {
            if (err) {
                stateSuccessErrorCount++;
                log_worker.add('debug', '保存状态正确失败数量', stateSuccessErrorCount);
                log_worker.add('error', '保存状态正确失败', err);
            } else {
                stateSuccessSuccessCount++;
                log_worker.add('debug', '保存状态正确成功数量', stateSuccessSuccessCount);
                log_worker.add('debug', '保存状态正确成功', res.ops);
                successUrl = lastUrl;
                log_worker.add('info', 'processor', successUrl);
            }
        });

        stateSuccessCount++;
        log_worker.add('debug', '状态成功数量', stateSuccessCount);

        //检查是否结束
        if (rspCount === queryUriCount) {
            log_worker.add('info', 'work', '已结束');
            reqUrl = '';
            reqState = '已结束';
            endTime = (new Date()).format('MM-dd HH:ii:ss');

            // 关闭url数据库
            // db.close();
        }
    }
});

//开始爬取
function begin_craw() {

    //检查目标地址是否存在，应该在获取目标地址之后执行爬取
    if (urlList.length < 1) {
        log_worker.add('info', 'work', '目标地址已全部加入请求队列');
        return;
    }

    if (isProxy) {
//    遍历代理 forEach是函数
        proxyList.forEach(function (e) {

            //检查目标地址是否存在，应该在获取目标地址之后执行爬取
            if (urlList.length < 1) {
                log_worker.add('info', 'work', '目标地址已全部加入请求队列');
            } else {

                //获取目标地址
                reqUrl = urlList.shift();

                var numAgent = parseInt(Math.random() * 20, 10);

                log_worker.add('debug', '请求数据', reqUrl);

                c.queue({
                    uri: reqUrl,
                    userAgent: userAgent[numAgent],
                    proxies: [e]
                });
                log_worker.add('debug', '代理地址', e);

                cCount++;
                log_worker.add('debug', '当前队列数量', cCount);

                reqCount++;
                log_worker.add('debug', '请求数量', reqCount);
            }

        });
    } else {

        //获取目标地址
        reqUrl = urlList.shift();

        var numAgent = parseInt(Math.random() * 20, 10);

        log_worker.add('debug', '请求数据', reqUrl);

        c.queue({
            uri: reqUrl,
            userAgent: userAgent[numAgent]
        });

        cCount++;
        log_worker.add('debug', '当前队列数量', cCount);

        reqCount++;
        log_worker.add('debug', '请求数量', reqCount);
    }

    log_worker.add('info', 'fetcher', 'fetcher is ok');
    setTimeout(begin_craw, parseInt(Math.random() * reqInterval, 10));
}

//目标地址不能少于最小值
if (pushEnd - pushBegin < uriCountMin) {
    log_worker.add('debug', '请求数据不能小于', uriCountMin);
    return;
}

beginTime = new Date();

url_worker.get(function (error, result) {
    reqState = '运行中';

    queryUrlSuccessCount++;
    log_worker.add('debug', '获取目标地址成功数量', queryUrlSuccessCount);

    if (error) {
        log_worker.add('debug', '获取目标地址错误', error.code);
    } else {
        urlList = result;

        beginUrl = urlList[0];
        endUrl = urlList[urlList.length - 1];

        queryUriCount = urlList.length;
        log_worker.add('debug', '目标地址数量', urlList.length);

        setTimeout(begin_craw, parseInt(Math.random() * reqInterval, 10));
    }
});

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

app.listen(3000, function () {
    log_worker.add('info', 'webUi', 'app is listening at port 3000');
});