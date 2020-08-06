---
layout: post
title: "某些 Google Fonts 在 Chrome 下字号变大的问题"
date: 2015-05-14 21:35:27 +0800
author: Runbing
tags:
- Web字体
- Google Fonts
- rem
- CSS
categories:
- 前端
description: 使用 Google Fonts 并同时使用 rem 字号时，字体在页面第一次载入后字号变得很大，刷新后又恢复正常。经过反复测试发现，把 Google Fonts 移除，更换另一种字体，或者把 rem 改成 px 后字号变大的问题都会消失，估计是某些 Google Fonts 和 rem 单位之间的某些问题导致浏览器在第一次载入时候渲染出错导致的。
---

在写一个页面的 CSS 时用到了某款 Google Fonts，且同时使用了 rem 单位字号，相关代码如下：

```css
html{
	font-size:62.5%;
}

body{
	font-family:'Merriweather',serif; /* 使用名为 Merriweather 的 Google Fonts  */
	font-size: 1.2rem; /* 设置字号为 1.2rem  */
}
```

以上代码中的“font-family”使用的 Web Fonts 是 Google Fonts 中的一款衬线字体“Merriweather”，在页面中字体的字号大小预期效果应该是 12p 的文字，如下图所示：

![字号为12px的字体](/images/2015/05/big-font_1.png)

但当使用 Chrome 预览页面时，却出现了怪事，每当页面初次载入时，页面中字体的字号总会比 CSS 声明的字号要大很多倍，如下图所示：

![字号为20px的字体](/images/2015/05/big-font_2.png)

但再次刷新页面后，字号又恢复成了 CSS 中声明的字号。随后我又在 Firefox、Safari 中测试了下，均不会出现此问题。Google 了一下相关资料，找到了一个遇到相同问题的网友发布的帖子：

[Font size too large until refresh in Google Chrome](https://wordpress.org/support/topic/font-size-too-large-until-refresh-in-google-chrome "Font size too large until refresh in Google Chrome")

虽然帖子的回复中没有什么比较好的解答，但最后楼主还是给出了具体可行的解决方法：将单位为 rem 的字号在 body 下面的子元素中声明。如在我所写的页面中 #content 是 body 的子元素，那么我就将 CSS 属性 font-size: 1.2rem 放到 #content 中，具体代码如下所示：

```css
html{
	font-size:62.5%;
}

body{
	font-family:'Merriweather',serif;
	/*font-size: 1.2rem;*/  /* 移除 body 中的字号声明 */
}

body #content{
	font-size: 1.2rem;  /* 将 body 中的字号盛名移至其下的子元素中  */
}
```

这样以来问题便得到了解决。但是这个问题到底是什么原因引起的没有细查，不过经过反复测试发现，把 Google Fonts 移除，更换另一种字体，或者把 rem 改成 px 后字号变大的问题都会消失，估计是某些 Google Fonts 和 rem 单位之间的某些问题导致浏览器在第一次载入时候渲染出错导致的。

---

参考资料：

[Fix the Font size bug in Google Chrome](http://techably.com/chrome-font-size-bug-fix/11996/ "Fix the Font size bug in Google Chrome")