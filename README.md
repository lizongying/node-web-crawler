# node-web-crawler
node网页爬虫
* 支持多种数据保存方式。file、mysql、mongodb等。
* 支持多机器（公用地址库），可以规模部署。
* 支持webui，监控方便。
* 支持配置，大多数参数都可以调整，多环境支持，切换方便。
* 地址来源、数据处理、数据保存、日志记录等都实现模块化，拓展方便。

## 安装
* 安装node。
```bash
yum install node
```
* 安装npm。
```bash
yum install npm
```
* 安装需要的数据库。如MySQL、mongodb等，按需安装
```bash
yum install mysql
yum install mongodb
```
* 安装node-web-crawler.
```bash
npm install node-web-crawler
```

## 模块说明
1. <code>/conf/</code> 配置
2. <code>/dao/</code> 数据库
3. <code>/data/</code> 数据（如内容数据保存为file）
4. <code>/download/</code> 数据（如文件数据保存为file）
5. <code>/lib/</code> 拓展函数
6. <code>/log/</code> 日志
7. <code>/processor/</code> 数据处理
8. <code>/web/</code> webui
9. <code>/worker/logworker/</code> 日志处理
10. <code>/worker/resultworker/</code> 返回处理
11. <code>/worker/urlworker/</code> 来源处理

## 配置说明

## 使用
* 启动mysql/mongodb等。
```bash
systemctl start mysql.service
systemctl start mongodb.service
```
* 启动node-web-crawler
```bash 
node ./index.js
 ```
* webui。<code>http://localhost:3000/assets/index.html</code>
![image](https://github.com/lizongying/node-web-crawler/raw/master/screenshots/example.PNG)