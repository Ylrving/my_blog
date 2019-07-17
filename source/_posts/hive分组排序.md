---
title: hive分组排序
copyright: true
date: 2019-07-17 10:20:09
tags: [hive]
---

{% cq %}
你了解Hive中Distribute by、Group by以及Cluster by的用法吗？
{% endcq %}
<!--more-->



# 了解Hive中Order by 、Sort by的用法以及区别

本文数据源下载：
链接：https://pan.baidu.com/s/1MERWCWSOrWmvmZhIAGwB_w 
 提取码：v3x8 

## Order by的演示

在Hive中创建一个goods_visit表，有goods_id ，click_num 2个字段，字符类型都为string，以‘\t’为分隔符。

    create table goods_visit(goods_id string,click_num int)  
    row format delimited fields terminated by '\t'  stored as textfile; 

 

将本地 /data/hive4下的表goods_visit中数据导入到Hive中的goods_visit表中



    load data local inpath'/data/hive4/goods_visit' into table goods_visit;

使用Order by对商品点击次数从大到小排序，并通过limit取出10条数据:

    select * from goods_visit order by click_num desc limit 10;



## Sort by 的演示

将Reduce个数设置为三个:

    set mapred.reduce.tasks=3;

创建订单明细表，名为order_items，包含item_id 、order_id 、goods_id 、goods_number 、shop_price 、goods_price 、goods_amount 七个字段，字符类型都为string，以‘\t’为分隔符。

    create table order_items(item_id string,order_id string,goods_id string,goods_number string,  
    shop_price string,goods_price string,goods_amount string)  
    row format delimited fields terminated by '\t'  stored as textfile;  

将本地/data/hive4/下的表order_items中数据导入到Hive中的order_items表中

    load data local inpath '/data/hive4/order_items' into table order_items;

按商品ID(goods_id)进行排序:

    select * from order_items sort by goods_id;



## Group by的演示

买家收藏夹表，名为buy_favorite，有buyer_id 、goods_id 、dt 三个字段，字符类型都为string，以‘\t’为分隔符。

    create table buyer_favorite(buyer_id string,goods_id string,dt string)  
    row format delimited fields terminated by '\t'  stored as textfile;  

将本地/data/hive4/下的表buyer_favorite中数据导入到Hive中的buyer_favorite表中

    load data local inpath '/data/hive4/buyer_favorite' into table buyer_favorite;

按dt分组查询每天的buyer_id数量:

    select dt,count(buyer_id) from buyer_favorite group by dt;  



## Distribute by的演示

将Reduce个数设置为三个:

    set mapred.reduce.tasks=3;

使用买家收藏夹表，按用户ID(buyer_id)做分发(distribute by)，输出到本地/data/hive4/out中:

    insert overwrite local directory '/data/hive4/out' select * from buyer_favorite distribute by buyer_id;

可以看到数据按buyer_id分发到三个文件中



## Cluster by 的演示

将Reduce个数设置为3个：

    set mapred.reduce.tasks=3;

按buyer_id将buyer_favorite分发成三个文件，并按buyer_id排序

    select * from buyer_favorite cluster by buyer_id;
# 了解Hive中Distribute by、Group by以及Cluster by的用法于区别
## Order by 与Sort by 对比

Order by的查询结果是全部数据全局排序，它的Reduce数只有一个，Reduce任务繁重，因此数据量大的情况下将会消耗很长时间去执行，而且可能不会出结果，因此必须指定输出条数。

Sort by是在每个Reduce端做排序，它的Reduce数可以有多个，它保证了每个Reduce出来的数据是有序的，但多个Reduce出来的数据合在一起未必是有序的，因此在Sort by做完局部排序后，还要再做一次全局排序，相当于先在小组内排序，然后只要将各小组排序即可，在数据量大的情况下，可以提升不少的效率。

## Distribute by 与Group by 对比

Distribute by是通过设置的条件在Map端拆分数据给Reduce端的，按照指定的字段对数据划分到不同的输出Reduce文件中。

Group by它的作用是通过一定的规则将一个数据集划分成若干个小的区域，然后针对若干个小区域进行数据处理，例如某电商想统计一年内商品销售情况，可以使用Group by将一年的数据按月划分，然后统计出每个月热销商品的前十名。

两者相比，都是按Key值划分数据，都使用Reduce操作，唯一不同的是Distribute by只是单纯的分散数据，而Group by把相同Key的数据聚集到一起，后续必须是聚合操作。