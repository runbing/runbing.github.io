---
layout: post
title: "为 Nginx 添加访问限制并按照规则封锁 IP"
date: 2016-06-20 18:05:00 +0800
author: Runbing
tags:
- Nginx
- WEB服务器
- 网站运维
categories:
- 技术
description: 测试
---

前段时间网站被恶意访问（DDos 或 CC 攻击）导致网站宕机，虽然原先使用 sh 脚本写了个规则，按时把恶意访问的 IP 放到 Nginx 的 Deny 列表中，但是这种方法是亡羊补牢之法，需要等待访问过后，过滤 error.log 后才能得到 Deny 名单。所以，当网络上的小流氓频繁使坏的时候，还没等来的及过滤日志，网站就挂了。这就需要加一个主动防御方案了。

## 主动防御：给网站添加访问限制

强大的 Nginx 提供了如下所示的两个模块，结合着使用正好可以满足限制访问的需要：

* 限制连接：[`ngx_http_limit_conn_module`](http://nginx.org/en/docs/http/ngx_http_limit_conn_module.html)
* 限制并发：[`ngx_http_limit_req_module`](http://nginx.org/en/docs/http/ngx_http_limit_req_module.html)

主动防御的思路是这样的。每个 IP 每秒钟同时最多只能建立两个连接，超过则返回 503 (Service Temporarily Unavailable) 错误。并且，每个 IP 每秒不超过 1 个请求，漏桶数 (burst) 为 5。这样就可以把那些每秒钟发送超多请求的 IP 给拒之门外了。

另外，为了不影响 SEO，防止限制搜索引擎蜘蛛（如 Googlebot、bingbot、Baiduspider 等）的抓取，以及防止自己指定的 IP 也被限制，还需要设置一个白名单。具体实现代码如下：

```shell
http{

    ...

    #白名单，生效必须kill nginx再启动
    #访问限制排除搜索引擎
    map $http_user_agent $perip{
        default $binary_remote_addr;
        ~*(Baiduspider|bingbot|Googlebot|Googlebot-Mobile|Googlebot-Image|Mediapartners-Google|Adsbot-Google|Yahoo!\ Slurp|qihoobot|YoudaoBot|Sosospider|Sogou\ spider|Sogou\ web\ spider|MSNBot) "";
    }

     #限制连接
    limit_conn_zone $perip zone=conn_perip:10m; #访客IP地址库conn_perip
    limit_req_zone $perip zone=req_perip:10m rate=1r/s; #访客IP地址库req_perip，请求速率1个/秒

    #定义排除IP
    map $remote_addr $limited{
        default 0;
        #需要排出限制的 IP
        127.0.0.1 1;
    }

    ...

    server{

        #...

        #全站限制访问参数
        limit_rate_after 200k; #当传输量大于此值时，超出部分将限速传送
        limit_rate 100k; #超出的限制速度

        #访问限制排除定义的IP
        if ($limited) {
            set $perip '';
        }

        location / {

            #...

            #禁止代理访问
            if ($http_user_agent ~ must-revalidate) {
                return 403;
            }

            #目录限制访问设置
            limit_conn conn_perip 2; #访客IP只能建立2个连接
            limit_req zone=req_perip burst=5 nodelay; #访客IP最高5个/秒突发请求速率

            #...

        }

        location ~ \.php$ {

            #PHP限制访问设置
            limit_conn conn_perip 2;
            limit_req zone=req_perip burst=5 nodelay;

            #...

        }

    #...

    }
}
```

## 被动防御：按照规则封锁恶意 IP

除了主动防御，如果有需要，还可以加一个被动防御，也就是本文开头所说的，通过过滤 error.log 获取频繁恶意访问网站的 IP 并加入 Nginx 的 Deny 名单。

实现思路是，当恶意访问的 IP 被主动防御拒绝后会产生 503 错误并记录到 error.log 中，可以编写两个 sh 脚本并加入 Crontab 定时任务中，按时（如 10 分钟）过滤一次，发现出现超如规定次数的 IP（如 20 次）则自动加入 Deny 名单。Deny 名单按时（如 1 天）清空。具体实现代码如下：

文件：block-ip.sh

```shell
#!/bin/bash

#从错误日志读取访问超过指定数量IP并将其屏蔽，重启Nginx

ERR_LOG=/usr/local/nginx/logs/error.log
BLOCK_IP_FILE=/usr/local/nginx/conf/blockips.conf
BLOCKED_IP=/usr/local/nginx/conf/blocked-ip.txt
BLOCK_IP=/usr/local/nginx/conf/block-ip.txt
NGINX_CMD=/usr/local/nginx/sbin/nginx

#把屏蔽列表备份到blocked-ip.txt文件
#从错误日志中提取恶意访问IP记录到block-ip.txt文件
#清空错误日志
#重启Nginx

cat $BLOCK_IP_FILE > $BLOCKED_IP &&
/bin/sed -nr 's#.*[^0-9](([0-9]+\.){3}[0-9]+).*#\1#p' $ERR_LOG |/bin/awk '{IP[$1]++}END{for (i in IP) print IP[i],i}'|/bin/awk '{if($1>20)print "deny "$2";"}' > $BLOCK_IP &&
/bin/grep -v -f $BLOCK_IP_FILE $BLOCK_IP >> $BLOCK_IP_FILE &&
#cat /dev/null > $ERR_LOG &&
$($NGINX_CMD -s reload)
```

文件：clear-ip.sh

```shell
#!/bin/bash

#清理分割的错误日志文件

CONF_DIR=/usr/local/nginx/conf
BLOCK_FILE=blockips.conf
BLOCKED_FILE=blocked-ip.txt
NGINX_CMD=/usr/local/nginx/sbin/nginx
LOGS_DIR=/usr/local/nginx/logs
LOG_NAME=error.log

cd $LOGS_DIR &&
/usr/bin/rename $LOG_NAME $(/bin/date +%F-%H -d "last hour").$LOG_NAME $LOG_NAME &&
cat /dev/null > $LOG_NAME &&
cd $CONF_DIR &&
cat /dev/null > $BLOCK_FILE &&
cat /dev/null > $BLOCKED_FILE &&
$($NGINX_CMD -s reload)
```

然后把上面两个文件添加到 crontab 定时任务中：

命令：`crontab -e`

```shell
#每天清空屏蔽列表
0 0 * * * /bin/bash /usr/local/scripts/clear-ip.sh &>/dev/null
#每十分钟检查超过规定的IP，加入屏蔽列表，重启Nginx
*/10 * * * * /bin/bash /usr/local/scripts/block-ip.sh &>/dev/null
```

这样，双管齐下，就可以把大部分非正常访问拒之门外了。