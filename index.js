/**
 * Created by michael on 2016-08-11.
 */
var Crawler = require("crawler");
var url = require('url');
var mysql = require('mysql');
//var mongodb = require('mongodb');
//var HttpsProxyAgent = require('https-proxy-agent');
//var proxy = 'http://120.132.72.199:52179';
//var agent = new HttpsProxyAgent(proxy);


var idList = [];
var uri = "https://book.douban.com/subject/";
//var uri = "https://api.douban.com/v2/book/";
//var uri = "https://baidu.com/v2/book/";

//var push_begin = 1220562;//开始id，包括
//var push_end = 1220563;//结束id，不包括

var push_begin = 9999;//开始id，包括
var push_end = 10002;//结束id，不包括
var push_max = 100;//每次查询最大数量 建议5000 不抄6000 本项目用代理100次换一次ip
var push_current = 0;
var push_count = push_end - push_begin;//经测试超过约30000000就会出现MySQL超时错误，建议在此范围内或者做其他优化

var add_count = 0;

var DATABASE = 'douban';
var TABLE = 'srf_book_info';

//var dao = require("./dao");
//console.log(new dao.mysql());
//var db = new dao["mysql"]();
//db.init();


//创建连接
var client = mysql.createConnection({
    user: 'root',
    password: ''
});


client.connect();
client.query("use " + DATABASE);
//
//var client = new mongodb.Server("127.0.0.1", 27017, {auto_reconnect: true});
//var db = new mongodb.Db(DATABASE, client, {salf: true});

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
var c = new Crawler({
    maxConnections: 10,
    //rotateUA:true,
    //userAgent: userAgent,
    //referer: 'https://book.douban.com/',
    callback: function (error, result, $) {
        //var addSql = 'INSERT INTO ' + TABLE + '(douban_id, douban_status, content) VALUES (?, ?, ?)';
        var errorSql = 'INSERT INTO ' + TABLE + '(' +
            'douban_number, ' +
            'douban_error, ' +
            'create_time' +
            ') VALUES (' +
            '?, ' +
            '?, ' +
            '?' +
            ')';
        var addSql = 'INSERT INTO ' + TABLE + '(' +
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

        if (error) {
            console.log('超时');
            //console.log(error);
            return;
        }

        var douban_id = result.request.path.replace(/[^0-9]/ig, "");
        //var douban_id = result.request.path.replace(/[^0-9]/ig, "").substr(1);//v2
        //console.log(result.request);
        var douban_status = result.statusCode;
        //var content = $("title").text().trim();
        //result.body='';
        console.log(result.body);


        //var content = result.body;
        //console.log(content);
        //var body = JSON.parse(result.body);


        //var sqlParams = [douban_id, douban_status, content];
        //
        if (result.statusCode != 200) {
            var errorParams = [
                douban_id,
                result.statusCode,
                new Date().getTime().toString().substr(0, 10)
            ];
            //console.log(errorSql);
            //console.log(errorParams);
            client.query(errorSql, errorParams, function (err, result) {
                //if (err) {
                //    console.log('INSERT ERROR:', err.message);
                //} else {
                //    console.log('INSERT ID:', result.insertId);
                //}
            });
        } else {
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
                //console.log(u.match(regU));
                var isbnU = u.match(regU);
                if (isbnU) {
                    isbn10 = isbnU[0];
                    console.log(isbn10);
                }
            });

            var addParams = [
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
                new Date().getTime().toString().substr(0, 10)
            ];
            //console.log(addParams);
            client.query(addSql, addParams, function (err, result) {
                if (err) {
                    console.log('INSERT ERROR:', err.message);
                } else {
                    console.log('INSERT ID:', result.insertId);
                }
            });
        }


        //db.open(function (err, db) {
        //    if (err) {
        //        throw err;
        //    } else {
        //        console.log('成功连接数据库');
        //        db.collection('book', function (err, collection) {
        //            collection.insert({
        //                douban_id: douban_id,
        //                douban_status: douban_status,
        //                content: content
        //            }, function (err, result) {
        //                //console.log(result);//插入的内容
        //            });
        //        });
        //    }
        //});

        //console.log(result.statusCode);
        //console.log(result.request.path);

        add_count++;
        console.log(add_count + '/' + push_count);
        if (add_count == push_count) {
            //由于异步操作，暂不关闭数据库
            //mysql关闭
            //client.end();

            //mongodb关闭
            //db.close();
            //db.on('close',function(err,db){
            //    if(err){
            //        throw err;
            //    }else{
            //        console.log("成功关闭数据库");
            //    }
            //});
            console.log("已返回全部信息");
        }
    }
});

//请求数据
//for (i = 1; i < 10000000; i++) {
//    idList.push(uri + i);
//}
//console.log(idList);

if (push_count < 1) {
    console.log("请求数据不能小于1");
    return;
}
//c.init({headers: {
//    //"Connection": "keep-alive",
//    //"Host": "book.douban.com"
//    "Upgrade-Insecure-Requests": "1"
//}});

//userAgent = [
//    'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.1.6) Gecko/20091201 Firefox/3.5.6',
//    'Mozilla/5.0 (Windows NT 6.2) AppleWebKit/535.11 (KHTML, like Gecko) Chrome/17.0.963.12 Safari/535.11',
//    'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)',
//    'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; en-us) AppleWebKit/534.50 (KHTML, like Gecko) Version/5.1 Safari/534.50',
//    'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-us) AppleWebKit/534.50 (KHTML, like Gecko) Version/5.1 Safari/534.50',
//    'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)',
//    'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0)',
//    'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)',
//    'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; 360SE)',
//    'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Avant Browser)',
//    'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1)'
//];

for (i = push_begin; i < push_end; i++) {
    push_current++;
    //console.log(push_current + '/' + push_count);
    idList.push(uri + i);
    //idList.push('https://www.google.com');
    if (push_current % push_max == 0) {
        //console.log(idList.length);
        c.queue(idList);
        idList = [];
    } else {
        if (push_current == push_count) {
            //console.log(idList.length);
            c.queue(idList);
            //c.queue({
            //    uri: idList,
            //    referer: 'https://book.douban.com/'
            //    //proxies: ['http://120.132.72.199:52179']
            //});
        }
    }
}
