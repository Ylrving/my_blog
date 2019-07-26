---
title: 记录一下自己常用的linux命令
copyright: true
date: 2019-07-26 09:54:46
tags: [linux]
---

{% cq %}
多敲一敲自然就记住了！
{% endcq %}
<!--more-->


## 命令行
```
netstat -nlp 查看端口
kill -9 123 杀死PID为123的进程
pkill -9 hexo 杀死名为hexo的进程
kill -9 `lsof -i:18100 | awk 'NR==2{print $2}'` 杀死指定端口进程
ln -s /xxx/xx /usr/bin/xx 添加软连接，参数snf为修改软连接
firewall-cmd --zone=public --add-port=3306/tcp --permanent  永久开放端口
firewall-cmd --reload 重新载入
firewall-cmd --zone=public --query-port=3306/tcp 查看端口开放状态
nohup file1 >> logfile 2>&1 &  后台执行file1并将日志存在logfile内
```


## vim
:%d 清空
:/XXX 查找XXX，按N下一个
:set nu 显示行数
Ctrl+v 多行选择  I 插入，通常用注释和取消注释，输入内容后再按Esc执行（0.5秒的反应时间）
d删除 
:2,65d 删除2-65行               
u 撤销
Ctrl + r 恢复撤销







