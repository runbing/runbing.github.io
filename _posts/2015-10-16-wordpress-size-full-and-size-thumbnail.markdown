---
layout: post
title: "Wordpress 插入完整图片部分自动变成缩略图的问题"
date: 2015-10-16 03:07:05 +0800
author: Runbing
tags:
- WordPress
- PHP
category:
- 技术
description: 上传多张图片并插入到文章的时候，在“插入多媒体”中明明显示的都是“完整尺寸”，插入到文章后，正常情况下全尺寸图片的 img 标签都会带着一个“size-full”的 CSS 类，但奇怪的是，除了第一张图片，其余的却都显示成了缩略图，这是怎么回事儿呢？
---

使用 Wordpress 的媒体功能上传图片，我更喜欢使用自己编辑好的全尺寸图片，而不使用 Wordpress 的“缩略图”功能，所以通常都会在“设置”中的“媒体选项”中把“缩略图”、“中等大小”、“大尺寸”这三项的宽高都设置为 0，这样就程序就不会再生成对我来说无用冗余的缩略图了。

但是最近遇到一件很奇怪的事情，在上传多张图片并插入到文章的时候，“插入多媒体”中明明显示的都是“完整尺寸”，正常情况下全尺寸图片的 img 标签都会带着一个 size-full 的 CSS 类，但奇怪的是，插入到文章后，除了第一张图片，其余的却都显示成了缩略图，CSS类显示成了 size-thumbnail。这个问题很久之前就遇到了，但是因为没时间有针对性的研究，一直没解决，今天编辑文章的时候又遇到了，这下不能忍了，必须干掉它。<!--more-->

插入多张图片正常情况下的代码应该是如下所示才对：

```html
<img src="xxxxx-1.jpg" alt="xxx" width="600" height="400" class="alignnone size-full wp-image-184" />
<img src="xxxxx-2.jpg" alt="xxx" width="600" height="400" class="alignnone size-full wp-image-185" />
<img src="xxxxx-3.jpg" alt="xxx" width="600" height="400" class="alignnone size-full wp-image-186" />
```

但是遇到此问题插入多张图片后代码会变成下面这这样：

```html
<img src="xxxxx-1.jpg" alt="xxx" width="600" height="400" class="alignnone size-full wp-image-184" />
<img src="xxxxx-2.jpg" alt="xxx" width="80" height="30" class="alignnone size-thumbnail wp-image-185" />
<img src="xxxxx-3.jpg" alt="xxx" width="80" height="30" class="alignnone size-thumbnail wp-image-186" />
```

注意，不正常的代码中，除了第一张照片，图片的 width 和 height 都变小了，本应是 size-full 这个 CSS 类却变成了 size-thumbnail。在网上搜索了一下，倒是也有人遇到这个问题，比如《[wordpress的文章中选择插入完整尺寸图片时，部分图片变为缩略图。求大神指点](http://zhidao.baidu.com/question/559978317.html)》和《[求助，关于文章图片插入时有部分自动变小的问题](http://tieba.baidu.com/p/2399449549)》，但是都没有靠谱的解答。所以只能自己动手丰衣足食了。

一般遇到这种很“灵异”的问题，我最常用的方法切换到默认主题、禁用所有插件，问题没能解决。然后我就新建一个 Wordpress，用同样的操作对比，终于发现了这个问题的原因。Wordpress 的“插入多媒体”是有记忆功能的，比如这一次我上传插入一个图片时，选择的是“缩略图”，那么下一次插入图片的时候，他会默认选择“缩略图”，问题就出在这里。如果曾经以缩略图、中等尺寸、大尺寸的规格插入图片到文章，如果最后一次插入图片不是选择的“完整尺寸”，就把“缩略图”使用设置宽高为 0 的方式禁用缩略图，那么奇怪的事情就发生了，每次你插入多张图片的时候，就只有第一张图片是全尺寸，其他的都会以你禁用缩略图前的那个规格插入。

知道了原因，解决方法就简单了，那就是先去设置里开启缩略图，把缩略图”、“中等大小”、“大尺寸”这三项的宽高随便设置一个值，如“10”，然后保存。新建一篇文章，添加媒体，在“插入多媒体”中上传一张大图片，然后“尺寸”选择为“完整尺寸”，点击【插入至文章】按钮插入到文章。最后再进入多媒体设置里，把“缩略图”、“中等大小”、“大尺寸”这三项的宽高重新设置为 0，保存。插入多张图片部分尺寸自动变小的问题就解决了。