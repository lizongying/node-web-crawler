/**
 * Created by michael on 2016-08-12.
 */

function Common() {
}

Common.prototype = {
    urlWorker: 'mysql',//地址worker
    resultWorker: 'mongodb',//结果worker
    logWorker: 'file',//日志worker
    processor: 'douban',//内容处理
    serverCount: 1,//服务器数量 默认5，必须设置
    serverCurrent: 0,//当前服务器 （从0开始），必须设置
    resultTable: 'srf_book_img',//表
    uri: 'https://book.douban.com/subject/',//目标地址
    pushBegin: 20824100,//开始id，包括 (全部服务器)
    pushEnd: 25000000,//结束id，不包括 (全部服务器)
    uriCountMin: 1,//目标地址数量最小值
    maxConnections: 50,//最大连接
    timeout: 60000,//超时（ms）默认60000
    retries: 1,//重试次数 默认3
    retryTimeout: 10000,//重试超时（ms）默认10000
    reqInterval: 0,//重新请求间隔 ms
    separator: '\r\n',
    isProxy: 0,//0 不使用代理 1 使用代理
    host: 'book.douban.com',
    referer: 'https://book.douban.com/',
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
    proxyList: [
        'http://157.119.71.153:8089',
        'http://157.119.71.78:8089',
        'http://157.119.71.101:8089',
        'http://157.119.71.132:8089',
        'http://157.119.71.58:8089',
        'http://157.119.71.57:8089',
        'http://157.119.71.56:8089',
        'http://157.119.71.55:8089',
        'http://157.119.71.54:8089',
        'http://157.119.71.53:8089',
        'http://157.119.71.52:8089',
        'http://157.119.71.67:8089',
        'http://157.119.71.50:8089',
        'http://157.119.71.49:8089',
        'http://157.119.71.51:8089',
        'http://157.119.71.22:8089',
        'http://157.119.71.48:8089',
        'http://157.119.71.47:8089',
        'http://157.119.71.46:8089',
        'http://157.119.71.45:8089',
        'http://157.119.71.44:8089',
        'http://157.119.71.43:8089',
        'http://157.119.71.42:8089',
        'http://157.119.71.41:8089',
        'http://157.119.71.33:8089',
        'http://103.248.223.207:8089',
        'http://103.248.223.208:8089',
        'http://103.248.220.131:8089',
        'http://103.248.220.125:8089',
        'http://103.248.220.108:8089',
        'http://103.248.220.105:8089',
        'http://103.248.220.85:8089',
        'http://103.248.220.61:8089',
        'http://103.248.220.34:8089',
        'http://103.248.220.3:8089',
        'http://157.119.71.7:8089',
        'http://202.74.232.175:8089',
        'http://202.74.232.114:8089',
        'http://202.74.232.109:8089',
        'http://103.248.220.187:8089',
        'http://103.248.220.161:8089',
        'http://103.248.220.155:8089',
        'http://103.248.220.150:8089',
        'http://157.119.71.153:8089',
        'http://103.248.220.193:8089',
        'http://103.248.220.196:8089',
        'http://103.248.220.222:8089',
        'http://103.248.220.225:8089',
        'http://103.248.223.9:8089',
        'http://157.119.71.61:8089',
        'http://103.248.223.32:8089'
    ] //'http://ip:port'
};

exports = module.exports = Common;