---
layout: article
title: "PHP 中粘贴字符串出现 Soft Hyphen 的解决方法"
date: 2017-04-01 03:04:14 +0800
author: Runbing
tags:
  - php
  - laravel
categories:
  - programming
excerpt: 昨天下午有用户反馈，其购买的激活码无法在系统中成功激活，我对比激活码库检查了下，这几枚出问题的激活码确实是有效的，但是就是无法成功激活，很是奇怪。
---

昨天下午有用户反馈，其购买的激活码无法在系统中成功激活，我对比激活码库检查了下，这几枚出问题的激活码确实是有效的，但是就是无法成功激活，很是奇怪。

晚上专门研究了一下发现，如果直接把激活码拷贝到输入框激活，就会出错，如果手动逐个字符输入就可以正常激活。看来问题一定出在这一串激活码上。先用输入的字符串和序列号做个对比：

```php
dd($request->sn == 'GDDW0-XDE0E-7ER9D-ESRD8-D0X9E')
```

明明两个字符串是一模一样的，结果居然是 ```false```。先 dump 一下这两个字符串有什么不同：

```php
var_dump($request->sn)
var_dump('GDDW0-XDE0E-7ER9D-ESRD8-D0X9E')
```

有意思的事情出现了，正常情况下激活码一共是 19 个字节，但是输入的这一串激活码却有 21 个字节，多出的 2 个字节是什么鬼？把这串多出两个字节的激活码转了一下码：

```none
ASCII: &#71;&#68;&#87;&#48;&#45;&#88;&#68;&#48;&#69;&#45;&#69;&#82;&#57;&#68;&#45;&#69;&#82;&#68;&#173;&#56;
Unicode: \u0047\u0044\u0057\u0030\u002d\u0058\u0044\u0030\u0045\u002d\u0045\u0052\u0039\u0044\u002d\u0045\u0052\u0044\u00ad\u0038
```

真相大白，其中 ```&#173;（\u00ad）``` 是异常字符，也是问题所在。查了下资料，这个字符叫做 Soft Hypen（软连接符），是一个不可见字符，加了一个这东西，肯定和数据库中的激活码匹配不上。

但是这个字符从哪儿来的呢？很可能在某个环节出现的，比如，可能是发送激活码使用的软件导致的，也可能是特定系统或浏览器导致的。不过，看来只要把这个字符去掉就可以解决问题了。

在 [Stack Overflow](http://stackoverflow.com/questions/10148184/php-check-if-string-contains-soft-hypen-and-replace-it) 上寻得一段代码，刚好可以处理这个问题，于是就拿来主义：

```php
preg_replace('~\x{00AD}~u', '', $request->sn);
$request->merge(['sn' => $request->sn]);
```

至此，问题完美解决。

---

参考资料：

* [PHP: Check if string contains soft hypen and replace it](http://stackoverflow.com/questions/10148184/php-check-if-string-contains-soft-hypen-and-replace-it)
* [How to change value of a request parameter in laravel 5.1](http://stackoverflow.com/questions/36812476/how-to-change-value-of-a-request-parameter-in-laravel-5-1)

