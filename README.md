## 整合webpack
将background/content/popup 整个为webpack格式


## backgroud/content通讯简化
做简单的chrome插件

将background简化为`插件后台服务,包括插件状态,log等`

将content简化为`当前页面信息服务,包括当前页面信息的dom等内容`  【暂时忽略content嵌套iframe的概念】

将popup简化为`视图`

此时将本地的backgroud/content简化为ajax的格式

调用/发送时,使用`ajax.get('/backgroud/xxx')`与`ajax.get('/content/xxx')` 【伪装为ajax】

注册时,使用`app.get('/backgroud/xxx')` 【伪装为express.router】