/**
 * Created by michael on 2016-08-11.
 */
var crawler = require('crawler');
var mysql = require('mysql');
var mongodb = require('mongodb');
var express = require('express');
var http = require('http');
var url = require('url');
var util = require('util');
var cheerio = require('cheerio');
var superagent = require('superagent');
var qs = require('querystring');

var conf = require('./conf/');
var dao = require('./dao/');

var env = 'test';//环境 test或production
var config = new conf[env]();

var mysqlHost = config.mysqlHost;//mysql地址
var mysqlPort = config.mysqlPort;//mysq端口
var mysqlUser = config.mysqlUser;//mysql用户名
var mysqlPassword = config.mysqlPassword;//mysql密码
var mysqlDatabase = config.database;//mysql数据库
var mongodbHost = config.mongodbHost;//mongodb地址
var mongodbPort = config.mongodbPort;//mongodb端口
var mongodbDatabase = config.mongodbDatabase;//mongodb数据库

var serverCount = config.serverCount;//服务器数量 默认5，必须设置
var serverCurrent = config.serverCurrent;//当前服务器 （从0开始），必须设置
var tableBook = config.tableBook;//书表
var uri = config.uri;//目标地址
var pushBegin = config.pushBegin;//开始id，包括 (全部服务器)
var pushEnd = config.pushEnd;//结束id，不包括 (全部服务器)
var uriCountMin = config.uriCountMin;//目标地址数量最小值
var expire = config.expire;//代理ip过期时间 默认60 * 60（一小时）
var maxConnections = config.maxConnections;//最大连接
var timeout = config.timeout;//超时10,000（ms）默认60000
var retries = config.retries;//重试次数 默认3
var retryTimeout = config.retryTimeout;//重试超时
var showLogInterval = config.showLogInterval;//显示log时间间隔 ms
var reqInterval = config.reqInterval;//重新请求间隔 ms

var pushCurrent = 0;//当前id，不需要设置
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
var updateTimeErrorCount = 0;//更新时间失败
var updateTimeSuccessCount = 0;//更新时间成功
var queryUriCount = 0;//获取目标地址数量
var reqID = 0;//请求的id
var logPath = '/default.log';//log地址
var sql = '';//sql
var logParams = [];//log参数
var mongodbParams = {};//mongodb参数
var proxy = '';//代理地址
var separator = '\n';

var douban_id = 0;//豆瓣id
var douban_status = 0;//豆瓣状态
var create_time = 0;//创建时间
var idSuccess = 0;//最后成功id

//随机
var userAgent = [
    'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.1.6) Gecko/20091201 Firefox/3.5.6',
    'Mozilla/5.0 (Windows NT 6.2) AppleWebKit/535.11 (KHTML, like Gecko) Chrome/17.0.963.12 Safari/535.11',
    'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)',
    'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; en-us) AppleWebKit/534.50 (KHTML, like Gecko) Version/5.1 Safari/534.50',
    'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-us) AppleWebKit/534.50 (KHTML, like Gecko) Version/5.1 Safari/534.50',
    'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)',
    'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0)',
    'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)',
    'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; 360SE)',
    'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Avant Browser)',
    'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1)',
    'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.6; rv:2.0.1) Gecko/20100101 Firefox/4.0.1',
    'Mozilla/5.0 (Windows NT 6.1; rv:2.0.1) Gecko/20100101 Firefox/4.0.1',
    'Opera/9.80 (Macintosh; Intel Mac OS X 10.6.8; U; en) Presto/2.8.131 Version/11.11',
    'Opera/9.80 (Windows NT 6.1; U; en) Presto/2.8.131 Version/11.11',
    'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Maxthon 2.0)',
    'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; TencentTraveler 4.0)',
    'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1)',
    'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; The World)',
    'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Trident/4.0; SE 2.X MetaSr 1.0; SE 2.X MetaSr 1.0; .NET CLR 2.0.50727; SE 2.X MetaSr 1.0)'
];

var c = new crawler({
    maxConnections: maxConnections,
    timeout: timeout,
    retries: retries,
    retryTimeout: retryTimeout,
    callback: function (error, result, $) {

        setTimeout(begin_craw, parseInt(Math.random() * reqInterval, 10));

        cCount--;
        crawler_log('debug', '当前队列数量', cCount);

        rspCount++;
        crawler_log('debug', '返回数量', rspCount);

        create_time = (new Date()).getTime().toString().substr(0, 10);
        douban_id = result.options.id;
        douban_status = result.statusCode;

        sql = 'INSERT INTO ' + tableBook + '(' +
            'douban_number, ' +
            'douban_error, ' +
            'create_time' +
            ') VALUES (' +
            '?, ' +
            '?, ' +
            '?' +
            ')';

        logParams = [
            douban_id,
            douban_status,
            create_time
        ];

        mongodbParams = {
            douban_id: douban_id,
            douban_status: douban_status,
            create_time: create_time
        };

        if (error) {
            noneErrorCount++;
            crawler_log('debug', '返回错误数量', noneErrorCount);
            crawler_log('error', '返回错误', error);

            //写入数据库
            //db.add(sql, logParams, function(err, res){
            //    if (err) {
            //        noneErrorErrorCount++;
            //        crawler_log('debug', '返回状态错误失败数量', noneErrorErrorCount);
            //        crawler_log('debug', '返回状态错误失败', err.message);
            //    } else {
            //        noneErrorSuccessCount++;
            //        crawler_log('debug', '保存返回错误成功数量', noneErrorSuccessCount);
            //        crawler_log('debug', '保存返回错误成功', res.insertId);
            //    }
            //});

            //写入文件
            //logPath = '/log/error-' + (new Date()).format('yyyy-MM-dd') + '.log';//文件名
            //log.add(logPath, logParams.join(','), separator, function (err) {
            //    if (err) {
            //        noneErrorErrorCount++;
            //        crawler_log('debug', '保存返回错误失败数量', noneErrorErrorCount);
            //        crawler_log('error', '保存返回错误失败', err);
            //    } else {
            //        noneErrorSuccessCount++;
            //        crawler_log('debug', '保存返回错误成功数量', noneErrorSuccessCount);
            //        crawler_log('debug', '保存返回错误成功', '');
            //    }
            //});

            //mongodb
            mg.add(tableBook, mongodbParams, function (err, res) {
                if (err) {
                    noneErrorErrorCount++;
                    crawler_log('debug', '保存返回错误失败数量', noneErrorErrorCount);
                    crawler_log('error', '保存返回错误失败', err);
                } else {
                    noneErrorSuccessCount++;
                    crawler_log('debug', '保存返回错误成功数量', noneErrorSuccessCount);
                    crawler_log('debug', '保存返回错误成功', res);
                }
            });

            return;
        }

        if (douban_status != 200) {
            stateErrorCount++;
            crawler_log('debug', '状态错误数量', stateErrorCount);
            crawler_log('debug', '状态错误', douban_status);

            //写入数据库
            //db.add(sql, logParams, function(err, res){
            //    if (err) {
            //        stateErrorErrorCount++;
            //        crawler_log('debug', '保存状态错误失败数量', stateErrorErrorCount);
            //        crawler_log('debug', '保存状态错误失败', err.message);
            //    } else {
            //        stateErrorSuccessCount++;
            //        crawler_log('debug', '保存状态错误成功数量', stateErrorSuccessCount);
            //        crawler_log('debug', '保存状态错误成功', res.insertId);
            //    }
            //});

            //写入文件
            //logPath = '/log/false-' + (new Date()).format('yyyy-MM-dd') + '.log';//文件名
            //log.add(logPath, logParams.join(','), separator, function (err) {
            //    if (err) {
            //        stateErrorErrorCount++;
            //        crawler_log('debug', '保存状态错误失败数量', stateErrorErrorCount);
            //        crawler_log('error', '保存状态错误失败', err);
            //    } else {
            //        stateErrorSuccessCount++;
            //        crawler_log('debug', '保存状态错误成功数量', stateErrorSuccessCount);
            //        crawler_log('debug', '保存状态错误成功', '');
            //    }
            //});

            //mongodb
            mg.add(tableBook, mongodbParams, function (err, res) {
                if (err) {
                    stateErrorErrorCount++;
                    crawler_log('debug', '保存状态错误失败数量', stateErrorErrorCount);
                    crawler_log('error', '保存状态错误失败', err);
                } else {
                    stateErrorSuccessCount++;
                    crawler_log('debug', '保存状态错误成功数量', stateErrorSuccessCount);
                    crawler_log('debug', '保存状态错误成功', res);
                }
            });

            return;
        }
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
        sql = 'INSERT INTO ' + tableBook + '(' +
            'rating, ' +
            'subtitle, ' +
            'author, ' +
            'pubdate, ' +
            'tags, ' +
            'origin_title, ' +
            'image, ' +
            'binding, ' +
            'translator, ' +
            'catalog, ' +
            'pages, ' +
            'alt, ' +
            'douban_number, ' +
            'publisher, ' +
            'isbn10, ' +
            'isbn13, ' +
            'title, ' +
            'url, ' +
            'alt_title, ' +
            'author_intro, ' +
            'summary, ' +
            'series, ' +
            'price, ' +
            'create_time' +
            ') VALUES (' +
            '?, ' +
            '?, ' +
            '?, ' +
            '?, ' +
            '?, ' +
            '?, ' +
            '?, ' +
            '?, ' +
            '?, ' +
            '?, ' +
            '?, ' +
            '?, ' +
            '?, ' +
            '?, ' +
            '?, ' +
            '?, ' +
            '?, ' +
            '?, ' +
            '?, ' +
            '?, ' +
            '?, ' +
            '?, ' +
            '?, ' +
            '?' +
            ')';

        logParams = [
            rating,
            subtitle,
            author,
            pubdate,
            tag,
            origin_title,
            large,
            binding,
            translator,
            catalog,
            pages,
            alt,
            douban_id,
            publisher,
            isbn10,
            isbn13,
            title,
            url,
            alt_title,
            author_intro,
            summary,
            series,
            price,
            create_time
        ];

        mongodbParams = {
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
            create_time: create_time
        };

        //写入MySQL
        //db.add(sql, logParams, function(err, res){
        //    if (err) {
        //        stateSuccessErrorCount++;
        //        crawler_log('debug', '保存状态正确失败数量', stateSuccessErrorCount);
        //        crawler_log('debug', '保存状态正确失败', err.message);
        //    } else {
        //        stateSuccessSuccessCount++;
        //        crawler_log('debug', '保存状态正确成功数量', stateSuccessSuccessCount);
        //        crawler_log('debug', '保存状态正确成功', res.insertId);
        //    }
        //});

        //写入文件
        //logPath = '/log/success-' + (new Date()).format('yyyy-MM-dd') + '.log';//文件名
        //separator = '#%#';
        //log.add(logPath, logParams.join('#$#'), separator, function (err) {
        //    if (err) {
        //        stateSuccessErrorCount++;
        //        crawler_log('debug', '保存状态正确失败数量', stateSuccessErrorCount);
        //        crawler_log('error', '保存状态正确失败', err);
        //    } else {
        //        stateSuccessSuccessCount++;
        //        crawler_log('debug', '保存状态正确成功数量', stateSuccessSuccessCount);
        //        crawler_log('debug', '保存状态正确成功', '');
        //    }
        //});

        //mongodb
        mg.add(tableBook, mongodbParams, function (err, res) {
            if (err) {
                stateSuccessErrorCount++;
                crawler_log('debug', '保存状态正确失败数量', stateSuccessErrorCount);
                crawler_log('error', '保存状态正确失败', err);
            } else {
                stateSuccessSuccessCount++;
                crawler_log('debug', '保存状态正确成功数量', stateSuccessSuccessCount);
                crawler_log('debug', '保存状态正确成功', res);
                idSuccess = douban_id;
            }
        });
        stateSuccessCount++;
        crawler_log('debug', '状态成功数量', stateSuccessCount);
    }
});

//增加地址
function add_uri() {

    //如果初始的情况下
    if (pushCurrent === 0) {
        pushCurrent = pushBegin;
    }

    //结束地址
    var push = pushCurrent + serverCount;
    if (push > pushEnd) {
        push = pushEnd;
    }
    crawler_log('debug', '开始目标地址', pushCurrent);
    crawler_log('debug', '结束目标地址', push);

    for (var i = pushCurrent; i < push; i++) {
        var isServer = i % serverCount;
        crawler_log('debug', '验证服务器', isServer);
        crawler_log('debug', '当前服务器', serverCurrent);

        //不是当前服务器
        if (isServer !== serverCurrent) {
            continue;
        }

        reqID = i;
        crawler_log('debug', '目标地址增加', reqID);

        queryUriCount++;
        crawler_log('debug', '目标地址数量', queryUriCount);

        pushCurrent = i + 1;
    }
}

//开始爬取
function begin_craw() {
    reqID = 0;

    //获取目标地址
    add_uri();

    //检查目标地址是否存在，应该在获取目标地址之后执行爬取
    if (reqID === 0) {
        crawler_log('debug', '当前目标地址为空', reqID);
        return;
    }

    var numAgent = parseInt(Math.random() * 20, 10);

    crawler_log('debug', '请求数据', reqID);

    c.queue({
        uri: uri + reqID,
        userAgent: userAgent[numAgent],
        id: reqID
    });

    cCount++;
    crawler_log('debug', '当前队列数量', cCount);

    reqCount++;
    crawler_log('debug', '请求数量', reqCount);
}

//log
function crawler_log(level, title, content) {
    var timeCurrent = new Date();

    //判断环境
    switch (env) {
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
            logPath = '/log/' + level + '/' + timeCurrent.format('yyyy-MM-dd') + '.log';//文件名
            logParams = [
                timeCurrent.format('HH:ii:ss'),
                level,
                title,
                content
            ];

            log.add(logPath, logParams.join(','), separator, function (err) {
                if (err) {
                    //console.log('debug', '写入文件失败');
                } else {
                    //console.log('debug', '写入文件成功');
                }
            });
            break;
        default :
            console.log(title, content);
            break;
    }
}

//目标地址不能少于最小值
if (pushEnd - pushBegin < uriCountMin) {
    crawler_log('debug', '请求数据不能小于', uriCountMin);
    return;
}

//显示log
function show_log() {
    var currentTime = (new Date()).format('MM-dd HH:ii:ss');
    crawler_log('info', '当前时间        ', currentTime);
    crawler_log('info', '开始时间        ', beginTime);
    crawler_log('info', '最后返回id      ', douban_id);
    crawler_log('info', '最后成功id      ', idSuccess);
    crawler_log('info', '开始id          ', pushBegin);
    crawler_log('info', '结束id          ', pushEnd);
    crawler_log('info', '当前请求id      ', reqID);
    crawler_log('info', '当前队列数量    ', cCount);
    crawler_log('info', '获取目标地址数量', queryUriCount);
    crawler_log('info', '请求数量        ', reqCount);
    crawler_log('info', '返回数量        ', rspCount);
    crawler_log('info', '返回错误数量    ', noneErrorCount);
    crawler_log('info', '保存返回错误失败', noneErrorErrorCount);
    crawler_log('info', '保存返回错误成功', noneErrorSuccessCount);
    crawler_log('info', '状态错误数量    ', stateErrorCount);
    crawler_log('info', '保存状态错误失败', stateErrorErrorCount);
    crawler_log('info', '保存状态错误成功', stateErrorSuccessCount);
    crawler_log('info', '状态成功数量    ', stateSuccessCount);
    crawler_log('info', '保存状态正确失败', stateSuccessErrorCount);
    crawler_log('info', '保存状态正确成功', stateSuccessSuccessCount);
    crawler_log('info', '更新时间失败    ', updateTimeErrorCount);
    crawler_log('info', '更新时间成功    ', updateTimeSuccessCount);
    crawler_log('info', '################', '################');
}

Array.prototype.indexOf = function (val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};

Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(i)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).format('yyyy-MM-dd hh:ii:ss.S') ==> 2006-07-02 08:09:04.423
// (new Date()).format('yyyy-M-d h:i:s.S')      ==> 2006-7-2 8:9:4.18
Date.prototype.format = function (fmt) { //author: meizz
    var o = {
        'M+': this.getMonth() + 1,                 //月份
        'd+': this.getDate(),                    //日
        'H+': this.getHours(),                   //小时
        'h+': this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
        'i+': this.getMinutes(),                 //分
        's+': this.getSeconds(),                 //秒
        'q+': Math.floor((this.getMonth() + 3) / 3), //季度
        'S': this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp('(' + k + ')').test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
    return fmt;
};

var beginTime = (new Date()).format('MM-dd HH:ii:ss');

//连接mysql
//var db = new dao['mysql']();
//var mysqlConf = {
//    host: mysqlHost,
//    port: mysqlPort,
//    user: mysqlUser,
//    password: mysqlPassword,
//    database: mysqlDatabase
//};
//db.init(mysqlConf);

//连接mongodb
var mg = new dao['mongodb']();
var mongodbConf = {
    host: mongodbHost,
    port: mongodbPort,
    database: mongodbDatabase
};

//写入文件
var log = new dao['file']();
var path = __dirname;
log.init(path);

mg.init(mongodbConf, function (err) {
    if (err) {
        crawler_log('error', 'mongodb初始化错误', err);
        return;
    }
    begin_craw();
});

//展示log
// setInterval(show_log, showLogInterval);

//请求
// superagent.get('')
//     .end(function (err, res) {
//         if (err) {
//             return next(err);
//         }
//         var $ = cheerio.load(res.text);
//     });

var app = express();
app.get('/', function (req, res) {
    var currentTime = (new Date()).format('MM-dd HH:ii:ss');
    return_json = {
        currentTime: {name: 'currentTime', info: '当前时间        ', val: currentTime},
        beginTime: {name: 'beginTime', info: '开始时间        ', val: beginTime},
        douban_id: {name: 'douban_id', info: '最后返回id      ', val: douban_id},
        idSuccess: {name: 'idSuccess', info: '最后成功id      ', val: idSuccess},
        pushBegin: {name: 'pushBegin', info: '开始id          ', val: pushBegin},
        pushEnd: {name: 'pushEnd', info: '结束id          ', val: pushEnd},
        reqID: {name: 'reqID', info: '当前请求id      ', val: reqID},
        cCount: {name: 'cCount', info: '当前队列数量    ', val: cCount},
        queryUriCount: {name: 'queryUriCount', info: '获取目标地址数量', val: queryUriCount},
        reqCount: {name: 'reqCount', info: '请求数量        ', val: reqCount},
        rspCount: {name: 'rspCount', info: '返回数量        ', val: rspCount},
        noneErrorCount: {name: 'noneErrorCount', info: '返回错误数量    ', val: noneErrorCount},
        noneErrorErrorCount: {name: 'noneErrorErrorCount', info: '保存返回错误失败', val: noneErrorErrorCount},
        noneErrorSuccessCount: {name: 'noneErrorSuccessCount', info: '保存返回错误成功', val: noneErrorSuccessCount},
        stateErrorCount: {name: 'stateErrorCount', info: '状态错误数量    ', val: stateErrorCount},
        stateErrorErrorCount: {name: 'stateErrorErrorCount', info: '保存状态错误失败', val: stateErrorErrorCount},
        stateErrorSuccessCount: {name: 'stateErrorSuccessCount', info: '保存状态错误成功', val: stateErrorSuccessCount},
        stateSuccessCount: {name: 'stateSuccessCount', info: '状态成功数量    ', val: stateSuccessCount},
        stateSuccessErrorCount: {name: 'stateSuccessErrorCount', info: '保存状态正确失败', val: stateSuccessErrorCount},
        stateSuccessSuccessCount: {name: 'stateSuccessSuccessCount', info: '保存状态正确成功', val: stateSuccessSuccessCount},
        updateTimeErrorCount: {name: 'updateTimeErrorCount', info: '更新时间失败    ', val: updateTimeErrorCount},
        updateTimeSuccessCount: {name: 'updateTimeSuccessCount', info: '更新时间成功    ', val: updateTimeSuccessCount}
    };
    switch (req.query.server) {
        case 'admin':
            res.json(return_json);
            break;
        default:
            res.json(return_json);
            break;
    }
});

app.listen(3000, function () {
    console.log('app is listening at port 3000');
});