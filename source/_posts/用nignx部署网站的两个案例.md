---
title: 用nignx部署网站的两个案例
copyright: true
date: 2019-07-20 08:46:05
tags: [nginx]
top: true
---
{% cq %}
nginx两种简单的部署方法
{% endcq %}
<!--more-->
{% note info %} 首先说说我的环境：
				用[宝塔面板](https://www.bt.cn/bbs/thread-19376-1-1.html)一键装的LNMP环境（linux、nginx、mysql、php）
                nginx安装目录：/www/server/nginx
                nginx配置文件：/www/server/panel/vhost/nginx/目录下的所有.conf文件。
{% endnote %}

# 案例一：hexo（即本博客）
在域名还没备案好的时候，我是通过ip:4000访问博客的，域名备案好后，将yyqzone.cn解析至该ip中，做完以下步骤就可以通过域名访问博客啦
如果没有ssl证书，请[点击跳转](#jump)
## 有ssl证书：
首先将ssl证书放到nginx下的配置文件目录下的cert目录（需要新建）下，再将下载的证书复制过去即可
进入/www/server/panel/vhost/nginx/下新建一个blog.conf作为博客的配置文件，vim编辑改文件，内容如下：
```
[root@superyaqi ~]# cd /www/server/panel/vhost/nginx/
[root@superyaqi nginx]# vim blog.conf
```
![](https://img.superyaqi.top/images/2019/07/23/04.png)
{% note warning %}  上处红框的地方要自己填写。配置完重载后发现只能通过 https://yyqzone.cn 访问，这时在后面再加几行代码就能实现http强制转换https，完整配置代码如下：
{% endnote %}
```
#hexo配置
server
{
    listen       443 ssl;
    server_name yyqzone.cn;   #域名
    root html;
    index index.html index.htm;
    ssl_certificate            cert/yyqzone.pem;  #引入证书
    ssl_certificate_key        cert/yyqzone.key;

    ssl_session_cache    shared:SSL:10m;
    ssl_session_timeout  5m;

    ssl_ciphers  HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers  on;

    location / {
        proxy_pass   http://127.0.0.1:4000/;
                proxy_read_timeout 3000;
        index index.html index.htm;
    }
}

server
{
    listen 80;
    server_name yyqzone.cn;
    charset utf-8;
    location / {
    rewrite ^/(.*) https://$server_name$request_uri? permanent;
    }

}

```
配置完成后要检查配置文件然后重载配置文件：
```
[root@superyaqi nginx]# nginx -t
nginx: the configuration file /www/server/nginx/conf/nginx.conf syntax is ok
nginx: configuration file /www/server/nginx/conf/nginx.conf test is successful
[root@superyaqi nginx]# nginx -s reload
```
<span id="jump"></span>
## 没有ssl证书的话配置文件改成如下即可
```
server
{
    listen 80;
    server_name yyqzone.cn;
    charset utf-8;
    location / {
         proxy_pass   http://127.0.0.1:4000/;
                 proxy_read_timeout 3000;
         index index.html index.htm;
    }

}
```
{% note warning %} 改完配置记得检查和重载 {% endnote %}





# 案例二:静态网站，简单的公司官网模板
### 这个案例我采用的是用宝塔面板直接部署的方法，首先从网上下载了一个企业官网的模板，文件目录如下：
![](https://img.superyaqi.top/images/2019/07/23/01.png)
### 点击面板上的网站→添加站点，弹出下面界面：
![](https://img.superyaqi.top/images/2019/07/23/02.png)
点击创建之后会在/www/wwwroot/下生成一个www.superyaqi.top文件夹，然后我们进入这个文件夹，将里面的内容清空，然后将刚刚的模板代码上传进来
### 如果有ssl证书，可以再面板上点击网站→对应网站的设置→ssl→其他证书，然后将对应的key和pem复制过来即可，这里面还可以设置https强制转换


