---
layout: post
title: "页面首部 X-Robots-Tag 设为 none 引发的灾难事件"
date: 2017-10-26 03:16:00 +0800
author: Runbing
tags:
- SEO
- Google
- Bing
- 网站运维
categories:
- 技术
description: 昨天下午有用户反馈，其购买的激活码无法在系统中成功激活，我对比激活码库检查了下，这几枚出问题的激活码确实是有效的，但是就是无法成功激活，很是奇怪。
---

其实这次事故是因为自己的粗心大意而导致的，结果是包含 Google、Bing、Yahoo 在内的各大搜索引擎把网站的所有收录全部清空，得到的教训是，在使用某些关键参数是一定要搞明白了再用！

我的 B 网站一直以来在 Google 的收录情况都很好，每次发布完原创文章 Google 很快就会收录。忘了是多久之前，曾偶然用 Google 搜索了一下前不久发布的文章标题，竟然发现抄袭该文章的网站排名在首位，当时有些纳闷，却也没有深究，也正是对问题的不敏感，导致严重的问题拖延了两个月之久！

前天（24 日）下午在进行新项目的间隙，偶然在 Google 上用搜索指令 site 了一下 B 站，结果惊出我一身冷汗！只剩下两个结果！我简直不敢相信自己的眼睛，但是我比较肯定这又是我的误操作导致的。

我确定 B 网站的内容不存在被 K 的风险，所以也确信这不可能是 Google 的惩罚。打开 Google 的网站管理工具，也印证了我的想法，一切指标都是正常的，唯独“索引状态”的曲线十分诡异：

![索引状态](/images/2017/10/index-status.png)

从统计曲线可以看出，自 B 站更换新域名的日期 2017-07-02 开始索引，直到 2017-08-27 到达最高点 1388 条，然后 2017-09-02 突然滑落到 723 条，直到最近 2017-10-22 的 158 条。从 8 月 27 日到 9 月 2 日这一段时间到底发生了什么导致了这种断崖式的索引缩减？首先我想到的是，前不久给网站的下载页面添加了一个如下所示的 meta 标签，用来禁止搜索引擎索引和收录。

{% highlight html %}
<meta name="robots" content="noindex,nofollow" />
{% endhighlight %}

赶紧审核了一遍下载页面的代码，发现在下载页面中，标示页面唯一性的 canonical 标签指向的是文章页面，而不是当前这个下载页面地址，难道是因为这个原因导致网站所有页面都被搜索引擎剔除的？

{% highlight html %}
<meta name="robots" content="noindex,nofollow" />
<link rel="canonical" href="https://samplesite.com/post/samplepost.html" />
{% endhighlight %}

想到这里，赶紧把 canonical 的链接改正过来，然后再把 robots 这个 meta 标签删除掉。

但是原因真的出在这里吗？心里怎么也不踏实，因为如果是因为 meta 标签中 noindex 和 nofollow 的效果，那也只应该影响文章页面才对，不至于让搜索引擎把首页和页面也都给剔除掉吧，毕竟这些页面是没有添加这个 meta 标签的。然后想到应该查一下 git 的 commit 记录，看看修改 meta 标签是否在 8 月 27 日到 9 月 2 这段时间。查询的结果出任意料，meta 标签修改的时间是 9 月 13 日，距离收录的断崖式缩减已经有一段时间了。所以可以肯定，导致搜索引擎收录清空的原因和添加这个 meta 标签无关。

接着继续审查  8 月 27 日到 9 月 2 这段时间 git 的 commit 记录，却也没有在网站源代码中发现能够影响搜索引擎行为的相关代码。到底问题出现在什么地方呢？正在疑惑中，随手在 Google 网站管理员工具中，用抓取工具随机抓取了一个页面，在 HTTP 响应的首部字段发现了端倪：

![HTTP响应](/images/2017/10/http-headers.png)

这里面的 ```X-Robots-Tag: none``` 是个什么鬼？虽然不知道这个响应头部是什么意思，但通过 Robots 这个关键词能够猜测到是和搜索引擎蜘蛛有关的，于是搜了一下，终于真相大白！

这个页面首部中名为 X-Robots-Tag 的 HTTP 头指令正是控制搜索引擎如何抓取和索引的，如果设置为 none 就等同于为页面同时应用 noindex 和 nofollow，也就是说这两个月来网站的每一个页面都被加上了 noindex 和 nofollow，难怪所有 Google、Bing、Yahoo 这种遵守规则的搜索引擎都把我的 B 站收录给清空了，而 Baidu、Sogou、360 之流都表现正常，到此真不知道是该笑还是该哭。

出现 X-Robots-Tag 指令的原因正是因为 8 月 24 日更改了 Nginx 的配置文件，因为懒省事儿，就直接从 owncloud 的示例配置文件中拷贝过来一块首部，而这个首部里面就含有 ```add_header X-Robots-Tag none;``` 这个指令，而且当时这一块配置还同时应用到了其它两个小站上了，怪不得三个站点在 Google 上都没有收录。更让人无比郁闷的事，居然接近两个月才费劲巴拉的找出原因！

{% highlight shell %}
add_header Strict-Transport-Security "max-age=15768000; preload";
add_header X-Content-Type-Options nosniff;
add_header X-Frame-Options "SAMEORIGIN";
add_header X-XSS-Protection "1; mode=block";
#add_header X-Robots-Tag none; #导致搜索引擎忽略所有网页！！！！
add_header X-Download-Options noopen;
add_header X-Permitted-Cross-Domain-Policies none;
{% endhighlight %}

因为这一重大失误，两个月前开始的网站流量下降、Adsense 广告单价降低、客户转化率降低都有了合理的解释。这太让人羞耻了。应该由此吸取教训，在做任何较大改动，或者对改动结果不怎么确定的时候，都要做记录，并且在短期内定期观察，以免造成长时间的损失。另外就是在使用任何代码的时候都要逐条分析其真正含义，确认之后再选用。问题已解决，接下来等待 Google 等搜索引擎恢复收录吧。

---

参考资料：

* [Robots meta tag and X-Robots-Tag HTTP header specifications](https://developers.google.com/search/reference/robots_meta_tag)
* [SEO优化meta标签 name=＂robots＂ content=＂index,follow,noodp,noydir＂解释](http://blog.sina.com.cn/s/blog_666689090101bg8p.html)

