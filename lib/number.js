/**
 * Created by michael on 2016-10-17.
 */

Number.prototype.in_array = function (arr) {
    // 判断参数是不是数组
    if (typeof arr !== 'object' || arr.constructor !== Array) {
        throw "arguments is not Array";
    }

    // 遍历是否在数组中
    for (var i = 0, k = arr.length; i < k; i++) {
        if (this == arr[i]) {
            return true;
        }
    }

    // 如果不在数组中就会返回false
    return false;
};
