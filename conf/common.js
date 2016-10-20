/**
 * Created by michael on 2016-08-12.
 */

function Common() {
}

Common.prototype = {
    serverCount: 1,//服务器数量 默认5，必须设置
    serverCurrent: 0,//当前服务器 （从0开始），必须设置
    resultTable: 'srf_book_info',//表
    uri: 'https://book.douban.com/subject/',//目标地址
    pushBegin: 20003000,//开始id，包括 (全部服务器)
    pushEnd: 25000000,//结束id，不包括 (全部服务器)
    uriCountMin: 1,//目标地址数量最小值
    maxConnections: 50,//最大连接
    timeout: 60000,//超时（ms）默认60000
    retries: 1,//重试次数 默认3
    retryTimeout: 10000,//重试超时（ms）默认10000
    reqInterval: 4000,//重新请求间隔 ms
    separator: '\r\n',
    isProxy: 1,//0 不使用代理 1 使用代理
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
        'http://157.119.71.154:8089',
        'http://157.119.71.155:8089',
        'http://157.119.71.156:8089',
        'http://157.119.71.157:8089',
        'http://157.119.71.158:8089',
        'http://157.119.71.159:8089',
        'http://157.119.71.160:8089',
        'http://157.119.71.161:8089',
        'http://157.119.71.162:8089',
        'http://157.119.71.7:8089',
        'http://157.119.71.115:8089',
        'http://157.119.71.116:8089',
        'http://157.119.71.117:8089',
        'http://157.119.71.118:8089',
        'http://157.119.71.119:8089',
        'http://157.119.71.120:8089',
        'http://157.119.71.121:8089',
        'http://157.119.71.122:8089',
        'http://157.119.71.123:8089',
        'http://157.119.71.124:8089',
        'http://157.119.71.125:8089',
        'http://157.119.71.126:8089',
        'http://157.119.71.127:8089',
        'http://157.119.71.128:8089',
        'http://157.119.71.129:8089',
        'http://157.119.71.130:8089',
        'http://157.119.71.131:8089',
        'http://157.119.71.247:8089',
        'http://157.119.71.248:8089',
        'http://157.119.71.132:8089',
        'http://157.119.71.133:8089',
        'http://157.119.71.134:8089',
        'http://157.119.71.135:8089',
        'http://157.119.71.136:8089',
        'http://157.119.71.137:8089',
        'http://157.119.71.138:8089',
        'http://157.119.71.139:8089',
        'http://157.119.71.140:8089',
        'http://157.119.71.141:8089',
        'http://157.119.71.142:8089',
        'http://157.119.71.143:8089',
        'http://157.119.71.144:8089',
        'http://157.119.71.145:8089',
        'http://157.119.71.146:8089',
        'http://157.119.71.147:8089',
        'http://157.119.71.148:8089',
        'http://157.119.71.149:8089',
        'http://157.119.71.150:8089',
        'http://157.119.71.243:8089'
    ] //'http://ip:port'
};

exports = module.exports = Common;