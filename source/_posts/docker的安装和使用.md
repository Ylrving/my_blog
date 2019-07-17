---
title: docker的安装和使用
copyright: true
date: 2019-07-06 15:23:06
tags: [docker,mysql]
top: 2
---

{% cq %}
熟练的掌握docker容器能让你更高效的开发、测试、部署服务
{% endcq %}
<!--more-->


# docker-ce 安装
1、卸载老版本，较老版本的Docker被称为docker或docker-engine。如果这些已安装，请卸载它们以及关联的依赖关系。

    sudo yum remove docker \
                      docker-common \
                      docker-selinux \
                      docker-engine
2、安装所需的软件包 yum-utils提供了yum-config-manager 效用，并device-mapper-persistent-data和lvm2由需要devicemapper存储驱动程序。

    sudo yum install -y yum-utils device-mapper-persistent-data lvm2
3、添加镜像源

    sudo yum-config-manager \
        --add-repo \
        https://download.docker.com/linux/centos/docker-ce.repo
4、将软件包添加至本地缓存

    sudo yum makecache fast

5、安装docker-ce


    sudo yum install docker-ce

6、启动docker


    sudo systemctl start docker

7、检查是否安装成功


    sudo docker info

如此时docker版本信息会在终端打印出来，则docker安装成功。
# 案例：mysql容器部署

    docker run -di --name=test_mysql -p 33308:3306 -e MYSQL_ROOT_PASSWORD=123456 mysql

-p 代表端口映射，格式为 宿主机映射端口:容器运行端口

-e 代表添加环境变量 MYSQL_ROOT_PASSWORD 是root用户的登陆密码

mysql 代表镜像名称
## 登陆mysql

    mysql -h127.0.0.1  -P33308 -u root -p
-h后面填写本地IP，-P后面填写映射的端口号，上面的命令可以看到我们映射的是33308端口


原文出处：
[docker的安装与简介](https://blog.xielin.top/2019/03/28/Docker/docker%E7%AE%80%E4%BB%8B%E4%B8%8E%E5%AE%89%E8%A3%85/)   
 [docker常用命令总结](https://blog.xielin.top/2019/04/05/Docker/docker%E5%B8%B8%E7%94%A8%E5%91%BD%E4%BB%A4%E6%80%BB%E7%BB%93/)