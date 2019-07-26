---
title: jupyter的安装和使用
copyright: true
date: 2019-07-26 09:57:20
tags: [jupyter,python]
---

{% cq %}
一款手机电脑端都能用的python笔记本
{% endcq %}
<!--more-->

之前用的是anaconda和nginx来部署jupyter的，由于一直输入py命令一直连接不上服务器，在改了半天的配置后放弃了，以为是服务器内python的兼容问题，于是卸载anaconda，装了个pyenv，结果发现还是运行不了，然后在折腾的过程中发现当输入ip访问jupyter的时候能连接上，但是输入域名就不行了，然后才想到可能是nginx配置问题，于是网上搜了一下果然有一个叫websocket需要配置，然后又尝试了一次，终于成功了！下面是操作操作的全过程
# 安装pyenv
```
yum install zlib-devel bzip2-devel openssl-devel ncurses-devel sqlite-devel readline-devel tk-devel gdbm-devel libpcap-devel xz-devel
mkdir ~/.pyenv
git clone git://github.com/yyuu/pyenv.git ~/.pyenv
echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.bashrc
echo 'export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(pyenv init -)"' >> ~/.bashrc
exec $SHELL -l

```
输入pyenv能看到信息说明安装成功
```
[root@superyaqi ~]# pyenv
pyenv 1.2.13
Usage: pyenv <command> [<args>]

Some useful pyenv commands are:
   commands    List all available pyenv commands
   local       Set or show the local application-specific Python version
   global      Set or show the global Python version
   shell       Set or show the shell-specific Python version
   install     Install a Python version using python-build
   uninstall   Uninstall a specific Python version
   rehash      Rehash pyenv shims (run this after installing executables)
   version     Show the current Python version and its origin
   versions    List all Python versions available to pyenv
   which       Display the full path to an executable
   whence      List all Python versions that contain the given executable
```
# 安装python3.6.5
```
pyenv install -v 3.6.5
```
需要几分钟的时间
安装好的python会放到/root/.pyenv/versions 目录下面
输入pyenv versions可以看到有的python，当然我只装了一个版本所以现在只显示一个版本
```
[root@superyaqi versions]# pyenv versions
  system
* 3.6.5 (set by /root/.pyenv/version)
```
只是输入python -V或者python会发现显示版本是python2.7，因为我们还没有切换过来，所以用的还是centos自带的python2，输入pyenv global 3.6.5切换版本
```
[root@superyaqi versions]# pyenv global 3.6.5
[root@superyaqi versions]# python -V
Python 3.6.5
```
python安装完成！
如果不想用pyenv可以直接用[anaconda](https://yyqzone.cn/2019/06/17/%E5%85%B3%E4%BA%8Ecentos7%E4%B8%8Bpython2%E4%B8%8Epython3%E7%9A%84%E9%97%AE%E9%A2%98/)，anaconda自带jupyter和各种第三方库。这里主要讲jupyter所以不再考虑其他因素

# 安装jupyter
```
pip install --upgrade pip
pip install jupyter
pip install notebook
source ~/.bashrc
```
输入jupyter能看到信息说明安装成功
```
[root@superyaqi versions]# jupyter
usage: jupyter [-h] [--version] [--config-dir] [--data-dir] [--runtime-dir]
               [--paths] [--json]
               [subcommand]
```
## 配置jupyter
在python命令行输入以下命令
```
>>> from notebook.auth import passwd
>>> passwd()
```
然后输入两次自己设置的密码，会弹出一串字符串，记下一会能用上
输入命令重置jupyter配置文件
```
jupyter notebook --generate-config
```
输入y就能看到jupyter的配置文件了，进行编辑
```
 vim /root/.jupyter/jupyter_notebook_config.py
```
因为所有配置都注释了，所有我们直接添加即可
```
c.NotebookApp.allow_origin = '*'
c.NotebookApp.allow_root=True
c.NotebookApp.password = 'sha1:4624ce6cc0e1:11d397b6902454adb4d50a5b48d611541fcd345f'#这里填刚刚获取的字符串
c.NotebookApp.ip = '*'
c.NotebookApp.open_browser = False
c.NotebookApp.port = 1510 #端口，默认是8888
c.NotebookApp.notebook_dir = '/root/jupyter' #填自己的工作目录，需先建好，不然会报错
```
保存好后，开放刚刚输入的端口号，然后输入jupyter notebook即可运行
在浏览器打开ip:端口即可访问

# nginx的配置
由于前面讲到的websocket服务，所以和其他的[应用配置](https://yyqzone.cn/2019/07/20/%E7%94%A8nignx%E9%83%A8%E7%BD%B2%E7%BD%91%E7%AB%99%E7%9A%84%E4%B8%A4%E4%B8%AA%E6%A1%88%E4%BE%8B/)不太一样
这里直接贴上我的配置
```
server
{
    listen       443 ssl;
    server_name jupyter.yyqzone.cn;   #域名
    root html;
    index index.html index.htm;
    ssl_certificate            cert/jupyter.pem;  #引入证书
    ssl_certificate_key        cert/jupyter.key;

    ssl_session_cache    shared:SSL:10m;
    ssl_session_timeout  5m;

    ssl_ciphers  HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers  on;

    location / {
        proxy_pass   http://127.0.0.1:1510/;
                proxy_read_timeout 3000;
        index index.html index.htm;
        proxy_set_header        X-Real-IP $remote_addr;
        proxy_set_header        Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_http_version      1.1;
        proxy_set_header        Upgrade $http_upgrade;
        proxy_set_header        Connection "Upgrade";
        proxy_redirect          off;
    }
}

server
{
    listen 80;
    server_name jupyter.yyqzone.cn;
    charset utf-8;
    location / {
        rewrite ^/(.*) https://$server_name$request_uri? permanent;


    }

}
```

安装部署到此结束，现在就可以愉快的写python笔记了