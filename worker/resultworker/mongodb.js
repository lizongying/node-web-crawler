/**
 * Created by michael on 2016-10-17.
 */
var config = require('../../conf/config');
var conf = new config();

var dao = require('../../dao/');

// 连接mongodb
var mg = new dao['mongodb']();
var mongodbConf = {
    host: conf.mongodbHost,
    port: conf.mongodbPort,
    user: conf.mongodbUser,
    password: conf.mongodbPassword,
    database: conf.mongodbDatabase
};

mg.init(mongodbConf, function (err) {
    if (err) {
        log_worker.add('error', 'mongodb初始化错误', err);
        return;
    }
});

function ResultWorker(resultTable) {
    this.resultTable = resultTable ? resultTable : conf.resultTable;//表
}

ResultWorker.prototype.error = function (resultStatus, lastUrl, createTime, callback) {
    var douban_id = lastUrl.replace(/[^0-9]/ig, '');

    //写入数据库
    // var sql = 'INSERT INTO ' + tableBook + '(' +
    //     'douban_number, ' +
    //     'douban_error, ' +
    //     'create_time' +
    //     ') VALUES (' +
    //     '?, ' +
    //     '?, ' +
    //     '?' +
    //     ')';
    //
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
    // var logParams = [
    //     douban_id,
    //     douban_status,
    //     create_time
    // ];
    //
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

    var mongodbParams = {
        douban_id: douban_id,
        douban_status: resultStatus,
        create_time: createTime
    };

    //mongodb
    mg.add(this.resultTable, mongodbParams, function (err, res) {
        callback(err, res);
    });
};

ResultWorker.prototype.false = function (resultStatus, lastUrl, createTime, callback) {
    var douban_id = lastUrl.replace(/[^0-9]/ig, '');

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

    var mongodbParams = {
        douban_id: douban_id,
        douban_status: resultStatus,
        create_time: createTime
    };

    //mongodb
    mg.add(this.resultTable, mongodbParams, function (err, res) {
        callback(err, res);
    });
};

ResultWorker.prototype.success = function (resultData, resultStatus, lastUrl, createTime, callback) {

    //写入MySQL
    //     sql = 'INSERT INTO ' + tableBook + '(' +
    //         'rating, ' +
    //         'subtitle, ' +
    //         'author, ' +
    //         'pubdate, ' +
    //         'tags, ' +
    //         'origin_title, ' +
    //         'image, ' +
    //         'binding, ' +
    //         'translator, ' +
    //         'catalog, ' +
    //         'pages, ' +
    //         'alt, ' +
    //         'douban_number, ' +
    //         'publisher, ' +
    //         'isbn10, ' +
    //         'isbn13, ' +
    //         'title, ' +
    //         'url, ' +
    //         'alt_title, ' +
    //         'author_intro, ' +
    //         'summary, ' +
    //         'series, ' +
    //         'price, ' +
    //         'create_time' +
    //         ') VALUES (' +
    //         '?, ' +
    //         '?, ' +
    //         '?, ' +
    //         '?, ' +
    //         '?, ' +
    //         '?, ' +
    //         '?, ' +
    //         '?, ' +
    //         '?, ' +
    //         '?, ' +
    //         '?, ' +
    //         '?, ' +
    //         '?, ' +
    //         '?, ' +
    //         '?, ' +
    //         '?, ' +
    //         '?, ' +
    //         '?, ' +
    //         '?, ' +
    //         '?, ' +
    //         '?, ' +
    //         '?, ' +
    //         '?, ' +
    //         '?' +
    //         ')';
    //
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
    //     logParams = [
    //         rating,
    //         subtitle,
    //         author,
    //         pubdate,
    //         tag,
    //         origin_title,
    //         large,
    //         binding,
    //         translator,
    //         catalog,
    //         pages,
    //         alt,
    //         douban_id,
    //         publisher,
    //         isbn10,
    //         isbn13,
    //         title,
    //         url,
    //         alt_title,
    //         author_intro,
    //         summary,
    //         series,
    //         price,
    //         createTime
    //     ];
    //
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
    // var mongodbParams = resultData;
    //
    // mg.add(this.resultTable, mongodbParams, function (err, res) {
    //     callback(err, res);
    // });
};

exports = module.exports = ResultWorker;
