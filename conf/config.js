/**
 * Created by michael on 2016-10-18.
 */
var config = require(__dirname);

var env = 'test';//环境 test或production
var conf = new config[env]();

function Config() {
    this.env = env;
    this.urlWorker = conf.urlWorker;//地址worker
    this.resultWorker = conf.resultWorker;//结果worker
    this.logWorker = conf.logWorker;//日志worker
    this.processor = conf.processor;//内容处理
    this.serverCount = conf.serverCount;//服务器数量，必须设置
    this.serverCurrent = conf.serverCurrent;//当前服务器 （从0开始），必须设置
    this.resultTable = conf.resultTable;//表
    this.uri = conf.uri;//目标地址
    this.pushBegin = conf.pushBegin;//开始id，包括 (全部服务器)
    this.pushEnd = conf.pushEnd;//结束id，不包括 (全部服务器)
    this.uriCountMin = conf.uriCountMin;//目标地址数量最小值
    this.maxConnections = conf.maxConnections;//最大连接
    this.timeout = conf.timeout;//超时10,000（ms）默认60000
    this.retries = conf.retries;//重试次数 默认3
    this.retryTimeout = conf.retryTimeout;//重试超时
    this.reqInterval = conf.reqInterval;//重新请求间隔 ms
    this.separator = conf.separator;//分隔符
    this.userAgent = conf.userAgent;//随机页头
    this.isProxy = conf.isProxy;//是否使用代理
    this.host = conf.host;
    this.referer = conf.referer;
    this.proxyList = conf.proxyList;//代理地址列表
    this.mysqlHost = conf.mysqlHost;//mysql地址
    this.mysqlPort = conf.mysqlPort;//mysq端口
    this.mysqlUser = conf.mysqlUser;//mysql用户名
    this.mysqlPassword = conf.mysqlPassword;//mysql密码
    this.mysqlDatabase = conf.mysqlDatabase;//mysql数据库
    this.mongodbHost = conf.mongodbHost;//mongodb地址
    this.mongodbPort = conf.mongodbPort;//mongodb端口
    this.mongodbUser = conf.mongodbUser;//mongodb用户名
    this.mongodbPassword = conf.mongodbPassword;//mongodb密码
    this.mongodbDatabase = conf.mongodbDatabase;//mongodb数据库
}

exports = module.exports = Config;

