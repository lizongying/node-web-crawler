/**
 * Created by michael on 2016-08-12.
 */
function Common() {}

Common.prototype = {
    serverCount: 5,//服务器数量 默认5，必须设置
    serverCurrent: 0,//当前服务器 （从0开始），必须设置
    tableBook: 'srf_book_info',//书表
    uri: 'http://book.douban.com/subject/',//目标地址
    pushBegin: 10000000,//开始id，包括 (全部服务器)
    pushEnd: 20000000,//结束id，不包括 (全部服务器)
    uriCountMin: 1,//目标地址数量最小值
    maxConnections: 10,//最大连接
    timeout: 60000,//超时（ms）默认60000
    retries: 3,//重试次数 默认3
    retryTimeout: 10000,//重试超时
    showLogInterval: 1000,//显示log时间间隔 ms
    reqInterval: 5000//重新请求间隔 ms
};

exports = module.exports = Common;
