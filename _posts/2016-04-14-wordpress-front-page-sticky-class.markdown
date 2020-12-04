---
layout: post
title: "为 Wordpress 静态主页置顶文章的 Class 添加 sticky"
date: 2016-04-14 16:54:53 +0800
author: Runbing
tags:
- WordPress
- PHP
categories:
- 前端
description: 前段时间把网站的主页换成了静态页面，在使用置顶（Sticky）功能的时候，发现主页的文章列表中设为“置顶”标识不见了，查看了下源码，发现 Class 中的 sticky 不见了。
---

前段时间把网站的主页换成了静态页面，在使用置顶（Sticky）功能的时候，发现主页的文章列表中设为“置顶”标识不见了，查看了下源码，发现 Class 中的 sticky 不见了。

文章列表使用的是自定义的 WP_Query，获取文章列表 Class 用的方法是 `join( ' ', get_post_class() )`。查看了下[相应的源代码](https://core.trac.wordpress.org/browser/tags/4.5/src/wp-includes/post-template.php)，看到第 485\~492 行代码如下：

```php
// sticky for Sticky Posts
if ( is_sticky( $post->ID ) ) {
	if ( is_home() && ! is_paged() ) {
		$classes[] = 'sticky';
	} elseif ( is_admin() ) {
		$classes[] = 'status-sticky';
	}
}
```

可以看到默认情况下 Wordpress 是没有对 `is_front_page()` 进行判断的，当然也就不可能给置顶文章 Class 属性添加 sticky。为解决这个问题，我们需要在 functions.php 中味静态主页文章列表也添加 sticky 这个 Class 属性。方法如下:

```php
function sticky_post_class( $classes ) {
	if ( is_sticky( $post->ID ) ) {
		if ( is_front_page() && ! is_paged() ) {
			$classes[] = 'sticky';
		} elseif ( is_admin() ) {
			$classes[] = 'status-sticky';
		}
	}
    return $classes;
}
add_filter( 'post_class', 'sticky_post_class');
```

当然，如果你使用的方法是把置顶文章和普通文章分开处理的，还有一个更简单的方法，就是直接给 `join( ' ', get_post_class() )` 传入一个 sticky 字符串，变成 `join( ' ', get_post_class('sticky') )`，这样同样可以解决这个问题。