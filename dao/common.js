/**
 * Created by michael on 2016-08-12.
 */
// 构造函数里面的属性不会被继承
// 继承的属性不会被console.log()当做属性输出
function Common() {
}

Common.prototype = {
};

exports = module.exports = Common;
