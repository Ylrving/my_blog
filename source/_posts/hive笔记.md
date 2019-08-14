---
title: hive数据操作
copyright: true
date: 2019-08-08 17:03:46
tags: [hive,sql]
---
{% cq %}
对时间戳的操作
{% endcq %}
<!--more-->

# 数据类型转换
有时候时间戳在数据库中并不是以int或者bigint类型存在，而是以string类型存在，所以我们先要学会数据类型转换
语法：cast(value as type)
```
cast(session_id as int)
```
注：如何时间戳精确到毫秒是有13位数的，所以应转换为bigint类型才能生效，如果遇到无法转换的数据则会返回NULL

# 时间戳与时间字符串的相互转换
时间戳是相对1970年1月1日 08:00:00（北京时间） 经过的秒数，通俗的讲，时间戳是一份能表示数据在一个特定时间点已经存在的完整的可验证的数据。它主要为用户提供一个电子证据，以证明用户的某些数据的产生时间。
## 一、unix_timestamp 函数的用法
1. unix_timestamp()返回当前时间戳
```
hive> select unix_timestamp();
1565346717
```
2. unix_timestamp(string date) 返回date对应的时间戳，date格式必须为yyyy-MM-dd HH:mm:ss
```
hive> select unix_timestamp('2019-07-29 00:00:00');
1564358400
```
3. unix_timestamp(string date,string format) 返回date对应的时间戳，date格式由format指定
```
hive> select unix_timestamp('2019/07/29 09', 'yyyy/MM/dd HH');
1564390800
```
## 二、from_unixtime函数用法
1. from_unixtime(int/bigint timestamp)返回timestamp时间戳对应的日期，格式为yyyy-MM-dd HH:mm:ss
```
hive> select from_unixtime(1000000000);
2001-09-09 01:46:40
```
2. from_unixtime(int/bigint timestamp,string format) 返回timestamp时间戳对应的是日期，格式由format指定
```
hive> select from_unixtime(1000000000, 'yyyy/MM/dd HH');
2001/09/09 01
```
### 如何辨别时间戳是秒数还是毫秒数
2001-09-09 01:46:40 ~ 2286-11-20 17:46:39的时间戳都是十位数
所以，我们这个时代使用的时间戳一般都是10位数，如果遇到13位的时间戳，则为毫秒数
