---
title: 关于centos7下python2与python3的问题
copyright: true
date: 2019-06-17 13:39:36
tags:
---

{% cq %}
如何优雅的让python2与python3共存
{% endcq %}
<!--more-->

# 安装anaconda
## 什么是anaconda
Anaconda指的是一个开源的Python发行版本，其包含了conda、Python等180多个科学包及其依赖项。  因为包含了大量的科学包，Anaconda 的下载文件比较大。

## 下载anaconda
```
wget https://repo.anaconda.com/archive/Anaconda3-2019.03-Linux-x86_64.sh
```
若wget报错则先安装wget再执行上面的命令：

    yum install wget
  ## 安装anaconda
下载好目标文件后，进入文件所在目录，执行以下命令进行安装：

    bash Anaconda3-2019.03-Linux-x86_64.sh

一路回车后会遇到yes/no
第一个是问是否安装anaconda
第二个是问是否配置环境变量
第三个是问是否安装对应软件
一般为yes yes no
### 错误1：“bunzip2: command not found”
第一个yes之后可能会报错：
`bunzip2: command not found`
这是要先安装bunzip2:

    yum install bzip2
安装好bzip2后将/root/anaconda 目录删除

    rm -rf /root/anaconda

然后继续运行上面的命令安装anaconda即可

# 解决系统python2与安装的python3的冲突
## 修改与python2相关连文件
若直接把python2删除，则可能会导致yum等功能有问题，所以为了避免不必要的排错，这里将保留python2，实现python2与python3共存
分别修改以下两个文件

    vi /usr/bin/yum 
将文件开头的路径声明改为

     #! /usr/bin/env python 修改为   #! /usr/bin/env python2.7
同样修改另一个文件

    vi /usr/libexec/urlgrabber-ext-down
    

## 建立python3的软连接

    ln -s /root/anaconda3/bin/python /usr/bin/python3

这样相当于生成了python3的一个快捷方式
输入python3就可以进入我们安装的python3的交互界面了

然而我们想要的是输入python就能够进入我们所安装的python3交互界面
所以修改/usr/bin/python 的连接目标

    ln -snf /usr/bin/python3 /usr/bin/python

相当于又将python3的快捷方式指向了python这个命令
此时输入python进入的就是python3的交互界面了

## 修改pip的软连接
### 错误2：“ImportError: Failed to import any qt binding”
这时我们已经能够使用python3了，但是之后会发现莫名其妙的报包的错误
这时我们应该使用anaconda的pip才能对的上python版本，输入以下命令即可：

    ln -snf /root/anaconda3/bin/pip /usr/bin/pip


现在，我们就可以愉快的在centos上面运行python项目啦！
