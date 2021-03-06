/**
 * Created by michael on 2016-08-12.
 */

function Common() {
}

Common.prototype = {
    urlWorker: 'm',//地址worker
    resultWorker: 'mongodb',//结果worker
    logWorker: 'default',//日志worker
    processor: 'test',//内容处理
    // database: 'node_web_crawler',//数据库
    // urlTable: 'url',//地址表
    database: 'douban',//数据库
    urlTable: 'srf_book_info',//地址表
    resultTable: 'result',//结果表
    resultToUrl: false,//结果作为地址保存
    isAutoDownload: true,//是否判断作为文件下载
    ext: [
        '.png',
        '.jpg',
        '.gif',
        '.PNG',
        '.JPG',
        '.GIF'
    ],//作为文件下载 请先设置isDownloadv
    serverCount: 1,//服务器数量 默认5，必须设置
    serverCurrent: 0,//当前服务器 （从0开始），必须设置
    separator: '\r\n',//分隔符（文件）
    reqInterval: 0,//重新请求间隔 ms
    maxConnections: 50,//最大连接
    rateLimit: 1,//任务间隔
    timeout: 60000,//超时（ms）默认60000
    retries: 1,//重试次数 默认3
    retryTimeout: 10000,//重试超时（ms）默认10000
    referer: '',//请求来源
    rotateUA: true,//false 使用第一个标识 true 循环标识
    userAgent: [
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
    ],
    isProxy: false,//false 不使用代理 true 使用代理
    proxies: ['http://127.0.0.1:1080'] //'http://ip:port'
};

exports = module.exports = Common;