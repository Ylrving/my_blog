---
layout: hive
title: sql查询优化
date: 2019-07-19 09:21:27
tags: [hive,sql]
---

{% cq %}
如何在有限的资源下，提高sql查询效率
{% endcq %}

<!--more-->
# hive sql查询优化
## 一、Hive优化目标
在有限的资源下，提高执行效率

## 二、Hive执行
HQL——> Job——> Map/Reduce
## 三、查询优化
### 1. join优化
优化前：
```
select m.cid,u.id from order m join customer u on m.cid=u.id where m.dt='2013-12-12';
```
优化后：

```
select m.cid,u.id from (select cid from order where dt='2013-12-12')m join customer u on m.cid=u.id;
```
### 2.or优化
优化前：
```
select * from t1 where 条件1 or 条件2；
```
优化后：
```
select * from t1 where 条件1 union all select * from t1 where 条件2;
```