---
layout: article
title: "更换服务器后更新 Let's Encrypt 证书报错解决方法"
date: 2017-01-21 23:42:14 +0800
author: Runbing
tags:
  - lets-encrypt
  - ssl
  - https
categories:
  - technology
excerpt: 网站项目一直在用 Letsencrypt 的免费 SSL 证书，期间更换过服务器，在试图更新证书时出现了错误。解决方法是重新生成一下符号链接即可
---

网站项目一直在用 Letsencrypt 的免费 SSL 证书，期间更换过服务器，转移站点时，直接把 `/etc/letsencrypt` 目录拷贝到新服务器上了，能正常使用没什么问题。由于 Letsencrypt 每 90 天需要更新一次证书，前两天收到了证书将要过期邮件通知，今天试图通过以下命令更新一下证书：

```shell
$ certbot renew
```

但是却出现了类似下面这种错误提示：

```shell
expected /etc/letsencrypt/live/yoursite.com/cert.pem to be a symlink
Renewal configuration file /etc/letsencrypt/renewal/yoursite.com.conf is broken. Skipping.```
```

大概意思是路径 `/etc/letsencrypt/live/yoursite.com` 下的 cert.pem 应该是一个符号链接，因此导致配置文件无效，从而无法完成更新。

这可能是因为直接把 `/etc/letsencrypt` 从之前的服务器拷贝到新服务器上，导致符号链接失效的缘故。解决方案是从在 [GitHub](https://github.com/certbot/certbot/issues/2550#issuecomment-197417732) 上找到的，只需要重新生成一下符号链接即可：

```shell
$ rm /etc/letsencrypt/live/yoursite.com/*.pem && \
ln -s /etc/letsencrypt/archive/yoursite.com/fullchain1.pem /etc/letsencrypt/live/yoursite.com/fullchain.pem && \
ln -s /etc/letsencrypt/archive/yoursite.com/cert1.pem /etc/letsencrypt/live/yoursite.com/cert.pem && \
ln -s /etc/letsencrypt/archive/yoursite.com/chain1.pem /etc/letsencrypt/live/yoursite.com/chain.pem && \
ln -s /etc/letsencrypt/archive/yoursite.com/privkey1.pem /etc/letsencrypt/live/yoursite.com/privkey.pem
```

这样再次运行命令 `certbot renew` 就可以成功更新证书了。
