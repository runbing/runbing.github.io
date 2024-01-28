---
layout: post
title: "三种压缩 WordPress 前端 HTML 代码的方法"
date: 2015-09-09 01:01:53 +0800
author: Runbing
tags:
- WordPress
- WordPress插件
- PHP
categories:
- 前端
description: 使用 WordPress 的代码高亮插件 Crayon Syntax Highlighter 时，发现一个问题，当双击代码进入纯文本模式的时候发现代码全都挤到一块了，在插件设置里反复开启关闭一些选项也没有解决。于是 Google 可能和这种情况有关的关键词，真正原因慢慢的显现出来。
---

使用 WordPress 的代码高亮插件 Crayon Syntax Highlighter 时，发现一个问题，当双击代码进入纯文本模式的时候发现代码全都挤到一块了，在插件设置里反复开启关闭一些选项也没有解决。于是 Google 可能和这种情况有关的关键词，真正原因慢慢的显现出来。<!--more-->

原来是因为我使用了一段压缩 HTML 代码，把 Crayon Syntax Highlighter 插件包裹在 ``<textarea>`` 标签里的代码也给压缩了，所以才造成代码挤在一块的现象。我实用的那段压缩 HTML 的代码如下所示：

```php
function wpjam_minify_html($html) {
	$search = array(
		'/\>[^\S ]+/s',	// 删除标签后面空格
		'/[^\S ]+\</s',	// 删除标签前面的空格
		'/(\s)+/s' // 将多个空格合并成一个
	);
	$replace = array(
		'>',
		'<',
		'\\1'
	);
	$html = preg_replace($search, $replace, $html);
	return $html;
}
if( !is_admin() ){
	add_action("wp_loaded", 'wp_loaded_minify_html');
	function wp_loaded_minify_html(){
		ob_start('wpjam_minify_html');
	}
}
```

知道原因了解决办法也就显而易见了，只需要将 Crayon Syntax Highlighter 包裹代码的 ``<textarea>`` 标签忽略，不要压缩即可。刚好在 Google 上也发现了现成的一个方案：

```php
function wp_compress_html(){
	function wp_compress_html_main ($buffer){
		$initial=strlen($buffer);
		$buffer=explode("<!--wp-compress-html-->", $buffer);
		$count=count ($buffer);
		for ($i = 0; $i <= $count; $i++){
			if ( stristr($buffer[$i], '<!--wp-compress-html no compression-->') ){
				$buffer[$i]=(str_replace("<!--wp-compress-html no compression-->", " ", $buffer[$i]));
			} else {
				$buffer[$i]=(str_replace("\t", " ", $buffer[$i]));
				$buffer[$i]=(str_replace("\n\n", "\n", $buffer[$i]));
				$buffer[$i]=(str_replace("\n", "", $buffer[$i]));
				$buffer[$i]=(str_replace("\r", "", $buffer[$i]));
				while (stristr($buffer[$i], '  ')){
					$buffer[$i]=(str_replace("  ", " ", $buffer[$i]));
				}
			}
			$buffer_out.=$buffer[$i];
		}
		return $buffer_out;
	}
	ob_start("wp_compress_html_main");
}
add_action('get_header', 'wp_compress_html');
```

这段代码其实是来自一款 WordPress 的插件 [WP-Compress-HTML](https://wordpress.org/plugins/wp-compress-html/)，当然你可以直接把这段代码放进 functions.php 中，而不必安装一个插件。这段代码会压缩所有 HTML 代码，如果不想压缩某一部分内容，只需要把不想要压缩的代码使用两个 ``<!--wp-compress-html no compression-->`` 包裹住即可。

```html
<!--wp-compress-html no compression-->
忽略不压缩的 code ...
<!--wp-compress-html no compression-->
```

但问题是这需要添加额外代码，这不是我想要的，有没有自动识别并忽略 ``textarea`` 标签的压缩方式呢？于是又发现了另外一款插件 [WP-HTML-Compression](https://wordpress.org/plugins/wp-html-compression/)，这款插件会忽略 ``<pre>``、``<textarea>``、``<script>`` 标签所包裹的内容。安装测试了下，很不错，没有添加任何代码，基本能达到想要的效果。

但还是有些美中不足的事，它会将 ``<script>`` 中的代码也给忽略了，不能忍，于是又找到一个[更加完美的方法](http://setuix.com/minify-javascript-html-wordpress-without-plugin/)。其实这段代码也是从 WP-HTML-Compression 这款插件中提取出来修改的，其实也可以直接修改那款插件，但比起安装一款插件，我更喜欢直接把这些代码添加到 functions.php 中。这段代码如下：

```php
class WP_HTML_Compression{
	// Settings
	protected $compress_css = true;
	protected $compress_js = true;
	protected $info_comment = true;
	protected $remove_comments = true;
	// Variables
	protected $html;
	public function __construct($html){
		if (!empty($html)){
			$this->parseHTML($html);
		}
	}
	public function __toString(){
		return $this->html;
	}
	/*protected function bottomComment($raw, $compressed){
		$raw = strlen($raw);
		$compressed = strlen($compressed);
		$savings = ($raw-$compressed) / $raw * 100;
		$savings = round($savings, 2);
		return '<!--HTML compressed, size saved '.$savings.'%. From '.$raw.' bytes, now '.$compressed.' bytes-->';
	}*/
	protected function minifyHTML($html){
		$pattern = '/<(?<script>script).*?<\/script\s*>|<(?<style>style).*?<\/style\s*>|<!(?<comment>--).*?-->|<(?<tag>[\/\w.:-]*)(?:".*?"|\'.*?\'|[^\'">]+)*>|(?<text>((<[^!\/\w.:-])?[^<]*)+)|/si';
		preg_match_all($pattern, $html, $matches, PREG_SET_ORDER);
		$overriding = false;
		$raw_tag = false;
		// Variable reused for output
		$html = '';
		foreach ($matches as $token){
			$tag = (isset($token['tag'])) ? strtolower($token['tag']) : null;
			$content = $token[0];
			if (is_null($tag)){
				if ( !empty($token['script']) ){
					$strip = $this->compress_js;
				}
				else if ( !empty($token['style']) ){
					$strip = $this->compress_css;
				}
				else if ($content == '<!--wp-html-compression no compression-->'){
					$overriding = !$overriding;
					// Don't print the comment
					continue;
				}
				else if ($this->remove_comments){
					if (!$overriding && $raw_tag != 'textarea'){
						// Remove any HTML comments, except MSIE conditional comments
						$content = preg_replace('/<!--(?!\s*(?:\[if [^\]]+]|<!|>))(?:(?!-->).)*-->/s', '', $content);
					}
				}
			}else{
				if ($tag == 'pre' || $tag == 'textarea'){
					$raw_tag = $tag;
				} else if ($tag == '/pre' || $tag == '/textarea'){
					$raw_tag = false;
				}else{
					if ($raw_tag || $overriding){
						$strip = false;
					} else {
						$strip = true;
						// Remove any empty attributes, except:
						// action, alt, content, src
						$content = preg_replace('/(\s+)(\w++(?<!\baction|\balt|\bcontent|\bsrc)="")/', '$1', $content);
						// Remove any space before the end of self-closing XHTML tags
						// JavaScript excluded
					 	$content = str_replace(' />', '/>', $content);
					}
				}
			}
			if ($strip){
				$content = $this->removeWhiteSpace($content);
			}
			$html .= $content;
		}
		return $html;
	}
	public function parseHTML($html){
		$this->html = $this->minifyHTML($html);
		/*if ($this->info_comment){
			$this->html .= "\n" . $this->bottomComment($html, $this->html);
		}*/
	}
	protected function removeWhiteSpace($str){
		$str = str_replace("\t", ' ', $str);
		$str = str_replace("\n",  '', $str);
		$str = str_replace("\r",  '', $str);
		while (stristr($str, '  ')){
			$str = str_replace('  ', ' ', $str);
		}
		return $str;
	}
}
function wp_html_compression_finish($html){
	return new WP_HTML_Compression($html);
}
function wp_html_compression_start(){
	ob_start('wp_html_compression_finish');
}
add_action('get_header', 'wp_html_compression_start');
```

其中注释的部分可以再页面代码底部添加压缩信息，需要的话可以把注释取消。上面这段代码只会忽略 ``<textarea>`` 中的代码的压缩，如果你还想忽略 ``<script>`` 或 ``<style>`` 中的代码，可以相应的禁用他们的压缩，如下所示：

```php
protected $compress_css = false;
protected $compress_js = false;
```

完美达到预期，感谢代码贡献者。