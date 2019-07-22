---
title: idea远程代码实时同步
copyright: true
date: 2019-07-10 17:19:52
tags: 
---
{% cq %}
下面介绍一种windows主机与服务器代码同步的方法。这个工具适用于jerbrains公司旗下的很多产品，比如pycharm、webstrom、phpstrom等。
{% endcq %}
<!--more-->

本次例子中讲的是webstrom，pycharm等其他jerbrains是一样的操作
## 步骤
1、打开电脑下的webstrom，选择tools->deployment->brower remote host
![](http://img.superyaqi.top/images/2019/07/22/01.png)
2、点击右上方的三个点，新建一个连接。
依次填写虚拟机信息
root path项选中linux虚拟机中的项目位置

![](http://img.superyaqi.top/images/2019/07/22/02.png)
打开mapping面板,选择deployment path为根路径/,确定保存
![](http://img.superyaqi.top/images/2019/07/22/03.png)
3、只要账号账号密码没错，就能看到下图
![](http://img.superyaqi.top/images/2019/07/22/04.png)

下面就可以找到相应的代码进行修改了
修改好后点击upload就可以上传代码到服务器了


## 使用Alibaba Cloud Explorer
官方文档：{% note default %} {% btn https://cn.aliyun.com/product/cloudtoolkit?msctype=email&mscareaid=cn&mscsiteid=cn&mscmsgid=8180119072200767748&spm=5176.8142029.developerService.12.4cf36d3e6GiMCs, 点击查看,  google fa-fw %}{% endnote %}
安装成功后就有如下的内置终端效果了

![](http://img.superyaqi.top/images/2019/07/22/06.png)