/**
 * Created by michael on 2016-08-11.
 */
var colors = require('colors');
var config = require('../conf/config');
var conf = new config();

function Processor() {
}

Processor.prototype.handle = function (result, $, callback) {
    var douban_id = result.options.uri.replace(/[^0-9]/ig, '');

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
    var alt = conf.uri + douban_id;
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

    callback(null, resultData);
};

exports = module.exports = Processor;
