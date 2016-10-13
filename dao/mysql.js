/**
 * Created by michael on 2016-08-12.
 */
var utils = require("util");
var Dao = require("../dao");

function Mysql() {}

utils.inherits(Mysql, Dao);

Mysql.prototype.init = function() {
    console.log("mysql init");
};

Mysql.prototype.add = function() {
    console.log("mysql add");
};

exports = module.exports = Mysql;
