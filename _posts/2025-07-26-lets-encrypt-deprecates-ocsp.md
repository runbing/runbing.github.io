---
layout: article
title: "Let's Enncrypt: no OCSP responder URL in the certificate"
date: 2025-07-26 01:20:37 +0800
updated: 2025-07-26 01:20:37 +0800
author:
  - Runbing
tags:
  - lets-encrypt
  - ssl
  - https
categories:
  - technology
excerpt: Let’s Encrypt 正在逐步废弃 OCSP 吊销机制，自 2025 年 5 月起，其签发的所有新证书将不再包含 OCSP URL，导致启用 OCSP Stapling 的 Nginx 出现警告。主流浏览器如 Chrome、Firefox 和 Safari 已采用本地缓存或预加载吊销信息，无需实时联网查询。站点管理员可安全关闭 OCSP Stapling 配置，无需担心安全影响。
---

我的站点用的是 Let’s Encrypt 颁发的证书，前几天我像往常一样更新证书，重启 Nginx 时出现了警告：

```
nginx: [warn] "ssl_stapling" ignored, no OCSP responder URL in the certificate
```

因为平时只是简单地更新一下证书，没有深究过与 HTTPS 相关的技术细节，突然看到这个警告感到颇为疑惑。查了半天资料，才发现问题的根源是 Let’s Encrypt 正在逐步**废除 OCSP 支持**。

---

## 为什么会出现这个警告？

在 HTTPS 中，`ssl_stapling`（OCSP Stapling）是一个 TLS 特性。简单来说，它让 Web 服务器在握手过程中主动提供一份由 CA 签名的“证书状态证明”（OCSP 响应），这样浏览器就不需要自己去访问 CA 的服务器，节省了一次网络请求，也更能保护用户隐私。

但是 OCSP Stapling 能正常工作有个前提：证书里要包含 OCSP 的 URL，也就是告诉服务器应该去哪个地址获取那份“证明”。而 Let’s Encrypt 最近签发的新证书，已经 **不再包含 OCSP URL** 了。于是 Nginx 配置里启用了 `ssl_stapling`，却找不到目标地址，自然就抛出 warning。

---

## OCSP 是什么？它本来是干什么的？

OCSP，全称是 Online Certificate Status Protocol，是浏览器或客户端用来检查 TLS 证书是否“被吊销”的机制之一。

比如某个网站的私钥被盗了，那它的证书就可能被 CA 吊销。为了避免用户还在误信这个证书，浏览器就可以在连接时，通过 OCSP 去 CA 问一句：“这张证书还好吗？没出事吧？”如果 CA 回复“这证书已经废了”，浏览器就会终止连接，防止中间人攻击。

所以理论上，OCSP 是用来增强 HTTPS 安全性的。但实践中，它的问题非常多，逐渐成了一个“有名无实”的机制。

---

## 那么，为什么 Let’s Encrypt 要废除它？

Let’s Encrypt 官方在 2024 年底发了一篇[博客](https://letsencrypt.org/2024/12/05/ending-ocsp/)，详细解释了他们的理由。我总结一下，原因主要有三个：

第一是 **隐私问题**。当用户访问一个网站时，如果浏览器去请求 OCSP，就等于是告诉 CA：“我刚访问了 example.com”。这在技术上就构成了一个流量泄露。哪怕 CA 自己不保存这些请求记录，在法律压力下也可能被迫开启追踪。

第二是 **性能与稳定性差**。OCSP 需要网络请求，一旦 CA 的服务器宕机，浏览器可能会“软失败”——也就是假装没这回事，继续连接。听上去很灵活，但其实等于没有安全性可言。

第三是 **运行成本高**。Let’s Encrypt 每秒要处理数万个 OCSP 请求，虽然用了 CDN 缓解，但原始请求也非常庞大。作为一个非盈利组织，他们宁可把这些资源花在更有用的地方。

总之，OCSP 又慢、又漏、又贵，对 Let’s Encrypt 和用户都不划算。于是，他们决定彻底放弃。

---

## Let’s Encrypt 都做了哪些调整？

为了平稳过渡，Let’s Encrypt 制定了一个明确的分阶段计划：

* 从 **2025 年 5 月开始**，所有新签发的证书将**完全不再包含 OCSP URL**。
* 如果你使用的是 OCSP Must-Staple 扩展（这个比较小众），Let’s Encrypt 也会一并停止支持。
* 到 **2025 年 8 月**，他们会彻底关闭自己的 OCSP 响应服务。

与此同时，Let’s Encrypt 会继续提供 **CRL（证书吊销列表）**，作为另一种吊销信息的发布方式。新证书中会带上 CRL URL，客户端可以离线下载来判断证书是否有效。但话说回来，现在的大部分客户端根本不看这些了。

---

## 那浏览器现在是怎么做证书吊销检查的？

你可能会觉得疑惑：既然 OCSP 被嫌弃，CRL 又没人用，那浏览器就不查了？

其实还真是这样。Chrome、Firefox、Safari 都有自己的应对策略，核心目标就是两个字：**不查**。

Chrome 早就默认不做 OCSP 和 CRL 联网查询，而是使用 Google 自己维护的 **CRLSet 黑名单**。这是一份只包含高危吊销证书的小型列表，通过浏览器更新时同步下载。简单、快速、够用。

Firefox 则更进一步，使用 Mozilla 的 **CRLite**。它用一种叫布隆过滤器的技术，把整个证书吊销数据库打包压缩成一个可以本地查询的文件，效果很好，而且更全面。Let’s Encrypt 的证书也已支持 CRLite。

Safari 大多依赖 macOS 系统级的安全策略，背后也有一些 Apple 自己的“黑科技”，但原则上也是尽量不做在线检查，保障隐私与速度优先。

---

## 那我们这些网站管理员该怎么办？

如果你用的是 Let’s Encrypt 的证书，最近也遇到了和我一样的 warning，不必紧张。这不影响网站服务，也不影响 TLS 握手成功，只是告诉你“现在不用再 stapling 了”。

你可以选择修改一下 Nginx 的配置，把这两行注释掉或移除：

```nginx
# ssl_stapling on;
# ssl_stapling_verify on;
# ssl_trusted_certificate /etc/letsencrypt/live/example.com/chain.pem;
```

也可以继续留着，Nginx 会忽略它，只报个 warning，不会导致启动失败。看你对日志洁癖的程度决定就好。

更重要的是：你不需要手动启用 CRL，不需要去改客户端，也不需要做任何“补救性配置”。浏览器那边的机制已经在演进，会自动适应这个变化。
