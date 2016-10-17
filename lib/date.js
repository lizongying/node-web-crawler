/**
 * Created by michael on 2016-10-17.
 */

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

Date.prototype.diff = function (date) {

//时间差秒
    var dateDiff = this.getTime() - date.getTime();

//计算出相差天数
    var days = Math.floor(dateDiff / (24 * 3600 * 1000));

//计算出小时数
    var leave1 = dateDiff % (24 * 3600 * 1000);  //计算天数后剩余的毫秒数
    var hours = Math.floor(leave1 / (3600 * 1000));

//计算相差分钟数
    var leave2 = leave1 % (3600 * 1000);        //计算小时数后剩余的毫秒数
    var minutes = Math.floor(leave2 / (60 * 1000));

//计算相差秒数
    var leave3 = leave2 % (60 * 1000);     //计算分钟数后剩余的毫秒数
    var seconds = Math.round(leave3 / 1000);

    return (days + '天' + hours + '时' + minutes + '分' + seconds + '秒');
};