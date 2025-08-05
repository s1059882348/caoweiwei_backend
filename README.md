后台管理1.0
===============


## 框架介绍
最简洁、清爽、易用的layui后台框架模板-layuimini。

项目会不定时进行更新，建议star和watch一份。

技术交流QQ群：[716235988](https://jq.qq.com/?_wv=1027&k=7TMTuAJv)、[1165301500🈵](https://jq.qq.com/?_wv=1027&k=TYKWy5Oo)、[667813249🈵](https://jq.qq.com/?_wv=1027&k=5lyiE2Q)、[561838086🈵](https://jq.qq.com/?_wv=1027&k=5JRGVfe) `加群请备注来源：如gitee、github、官网等`。




## 框架特性
* 界面足够简洁清爽，响应式且适配手机端。
* 一个接口`几行代码而已`直接初始化整个框架，无需复杂操作。
* 页面支持多配色方案，可自行选择喜欢的配色。
* 支持多tab，可以打开多窗口。
* 支持无限级菜单和对font-awesome图标库的完美支持。
* 失效以及报错菜单无法直接打开，并给出弹出层提示`完美的线上用户体验`。
* url地址hash定位，可以清楚看到当前tab的地址信息。
* 刷新页面会保留当前的窗口，并且会定位当前窗口对应左侧菜单栏。
* 支持font-awesome图标选择插件



## 项目结构

- index.html   主页，包含顶部菜单、左侧菜单、管理员信息、中间业务页面等
- login.html   登录页面
- css          公共样式文件
- images       图片文件
- js           layui自定义扩展js 
- lib          第三方SDK
- page/panda   业务页面，每个页面的css、js独立出一个文件
- js/lay-module/panda  项目扩展js





## 请求接口

1. 忽略文件config.js中设置接口公共地址Requesthttp
2. js/lay-module/panda/myAjax.js定义了请求接口的公共方法
3. myAjax.normal是请求不需要token的一些接口
4. myAjax.authAjax是请求带token的一些接口
5. 接口返回的数据结构
```
{
  "code": 0,
  "msg": "",
  "count": 1000,
  "data": [
    {
      "id": 10000,
      "username": "user-0",
      "sex": "女",
      "city": "城市-0",
      "sign": "签名-0",
      "experience": 255,
      "logins": 24,
      "wealth": 82830700,
      "classify": "作家",
      "score": 57
    }
  ]
}
```

