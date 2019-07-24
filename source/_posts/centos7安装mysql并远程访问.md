---
title: centos7安装mysql并远程访问
copyright: true
date: 2018-12-06 15:23:06
tags: [centos,mysql]
top: False
---


{% cq %}
要想sql写的好，得先工具装的好！
{% endcq %}
<!--more-->

# 彻底卸载原有的mysql
查询之前安装的mysql的依赖包
```
rpm -qa | grep -i mysql
```
删除查询出来的包：rpm  -ev 包名
```
例如：rpm -ev mysql-connector-odbc-8.0.15-1.el7.x86_64
```
将相关文件夹删除

```
cd /var/lib/
rm -rf mysql/
```

# 安装mysql5.7.26

```
安装noarch包
rpm -ivh https://dev.mysql.com/get/mysql80-community-release-el7-3.noarch.rpm
```
修改一些内容

    cd /etc/yum.repos.d/
    vim mysql-community.repo

将mysql57的enabled=0改成enabled=1

    [mysql57-community]
    name=MySQL 5.7 Community Server
    baseurl=http://repo.mysql.com/yum/mysql-5.7-community/el/7/$basearch/
    enabled=0  #改成1
    gpgcheck=1
同样将mysql80的enabled=1改成enabled=0

    [mysql80-community]
    name=MySQL 8.0 Community Server
    baseurl=http://repo.mysql.com/yum/mysql-8.0-community/el/7/$basearch/
    enabled=1  #改成0
    gpgcheck=1

然后再yum安装mysql软件包
```
yum install mysql-community-common.x86_64 mysql-community-libs.x86_64 mysql-community-client.x86_64 mysql-community-server.x86_64 -y
```
主要是安装四个组件：客户端client、通用包common、依赖库libs和服务器server，时间比较长

```
mysql-community-client
mysql-community-common
mysql-community-libs
mysql-community-server
```
此时mysql已经安装完成，查看mysql版本

    mysql --version

启动mysql服务并找到初始密码：

    service mysqld start
    grep 'temporary password' /var/log/mysqld.log
    如果出现了多行密码则选择最下面的为最新密码
进行登录,输入刚刚查询到的初始密码

    mysql -u root -p
## 修改密码
 **先修改mysql密码规则否则你设置的密码要很复杂才能设置成功** 

    set global validate_password_policy=0;
    set global validate_password_length=4;
    set password for root@localhost = password('123456');
这里将密码修改为123456


# navicat远程访问

首先在mysql交互界面给root用户授权：

    GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY '123456' WITH GRANT OPTION;

刷新权限：

    FLUSH  PRIVILEGES;


## 虚拟机可以选择关闭防火墙

    systemctl stop firewalld.service
静止防火墙开机启动

    systemctl disable firewalld.service 
## 如果是服务器则开放相对应的端口

    // --permanent 永久生效,没有此参数重启后失效
    firewall-cmd --zone=public --add-port=3306/tcp --permanent 

重新载入

    firewall-cmd --reload
查看状态

    firewall-cmd --zone=public --query-port=3306/tcp

最后就能用navicat进行远程连接了
