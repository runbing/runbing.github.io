---
layout: article
title: "使用命令行工具 icotool 创建 Favicon 图标"
date: 2019-08-02 10:02:23 +0800
updated: 2019-08-09 17:53 +0800
author: Runbing
tags:
  - icotool
  - favicon
categories:
  - technology
excerpt: 本文主要内容是介绍了 Favicon 图标的历史概况、实现标准和实现方法，并介绍了一款好用的制作 ICO 格式图标的命令行工具 icotool，详细说明了这款工具的使用方法。
---

在创建网站的时候，通常会需要一个 Favicon 图标，以便在浏览器的地址栏（或标签上）、收藏夹等处显示网站的小标志，或者当用户创建网站的快捷方式到桌面（或浏览器）时显示网站大点的标志。

本文要介绍的是一款名为 icotool 的命令行工具，它可以非常方便地对 ICO 格式图标进行创建、查看和抽取。不过在进入正题之前，先来详细了解一下 Favicon 图标的来龙去脉。

## 一、Favicon 图标的历史和标准化

首次支持 Favicon 图标的浏览器是 1999 年 3 月微软推出的 Inernet Explorer 5（IE5）。一开始，Favicon 图标是存放在网站根目录的一个名为 favicon.ico 的文件，当页面被加入书签后，IE 会在收藏夹（书签栏）和地址栏的 URL 旁边显示此图标。后来，不论网站是否被加入书签，现代浏览器都在网站地址栏显示 Favicon 图标了。

W3C 在 1999 年 12 月发布的 HTML 4.01 推荐标准和后来在 2000 年发布的 XHTML 1.0 推荐标准中对 Favicon 做了标准化。标准实现是在文档的 `<head>` 部分使用带有 `rel` 属性的 `link` 元素指定文件格式、文件名以及文件路径。和以前实现方案不同的是，文件可以是任意格式，能放在网站的任何目录。

2003 年，ICO 格式由第三方在 IANA 注册成了 MIME 类型 `image/vnd.microsoft.icon`。但是当把 ICO 格式作为图片显示时（不作为 Favicon 图标显示），IE 浏览器无法显示使用标准化 MIME 类型提供的文件。IE 的解决方法是将 .ico 与 Web 服务器中的非标准化 MIME 类型 image/x-icon 相关联。

RFC 5988 创建了 IANA 链接关系注册表，并在 2010 年基于 HTML5 规范注册了`rel="icon"`。流行用法 `<link rel="shortcut icon" type="image/png" href="image/favicon.png">` 理论上确定了两种关系：`shorcut` 和 `icon`，但其中 `shortcut` 未注册，并且是多余的。2011 年 [HTML 活动标准（HTML living standard）](https://github.com/whatwg/html/commit/95978ef2b115e7dbd03b5b5e8d78c00340119588)明确说明，鉴于历史原因，允许紧邻 `icon` 之前使用 `shortcut`（两者之间用一个空格间隔），然而文中并未说明使用 `shortcut` 的意义。

## 二、浏览器对 Favicon 图标的实现

虽然 Favicon 图标的标准实现声称支持任意格式，但是浏览器对不同格式的实现却不尽相同。下表是主流网页浏览器对 Favicon 文件格式的支持情况：

<table style="font-size:small;">
    <thead>
        <tr>
            <th>浏览器</th>
            <th>ICO</th>
            <th>PNG</th>
            <th>GIF</th>
            <th>动态GIF</th>
            <th>JPEG</th>
            <th>APNG</th>
            <th>SVG</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><strong>Chrome</strong></td>
            <td style="background-color:#e8f8e8;">支持</td>
            <td style="background-color:#e8f8e8;">支持</td>
            <td style="background-color:#e8f8e8;">4.0 起支持</td>
            <td style="background-color:#fee;">不支持</td>
            <td style="background-color:#e8f8e8;">4.0 起支持</td>
            <td style="background-color:#fee;">不支持</td>
            <td style="background-color:#fee;">不支持</td>
        </tr>
        <tr>
            <td><strong>Edge</strong></td>
            <td style="background-color:#e8f8e8;">支持</td>
            <td style="background-color:#e8f8e8;">支持</td>
            <td style="background-color:#e8f8e8;">支持</td>
            <td style="background-color:#fee;">不支持</td>
            <td>未知</td>
            <td>未知</td>
            <td>未知</td>
        </tr>
        <tr>
            <td><strong>IE</strong></td>
            <td style="background-color:#e8f8e8;">5.0 起支持</td>
            <td style="background-color:#e8f8e8;">11.0 起支持</td>
            <td style="background-color:#e8f8e8;">11.0 起支持</td>
            <td style="background-color:#fee;">不支持</td>
            <td style="background-color:#fee;">不支持</td>
            <td style="background-color:#fee;">不支持</td>
            <td style="background-color:#fee;">不支持</td>
        </tr>
        <tr>
            <td><strong>Firefox</strong></td>
            <td style="background-color:#e8f8e8;">1.0 起支持</td>
            <td style="background-color:#e8f8e8;">1.0 起支持</td>
            <td style="background-color:#e8f8e8;">1.0 起支持</td>
            <td style="background-color:#e8f8e8;">支持</td>
            <td style="background-color:#e8f8e8;">支持</td>
            <td style="background-color:#e8f8e8;">3.0 起支持</td>
            <td style="background-color:#e8f8e8;">41.0 起支持</td>
        </tr>
        <tr>
            <td><strong>Opera</strong></td>
            <td style="background-color:#e8f8e8;">7.0 起支持</td>
            <td style="background-color:#e8f8e8;">7.0 起支持</td>
            <td style="background-color:#e8f8e8;">7.0 起支持</td>
            <td style="background-color:#e8f8e8;">7.0 起支持</td>
            <td style="background-color:#e8f8e8;">7.0 起支持</td>
            <td style="background-color:#e8f8e8;">9.5 起支持</td>
            <td style="background-color:#e8f8e8;">44.0 起支持</td>
        </tr>
        <tr>
            <td><strong>Safari</strong></td>
            <td style="background-color:#e8f8e8;">支持</td>
            <td style="background-color:#e8f8e8;">4.0 起支持</td>
            <td style="background-color:#e8f8e8;">4.0 起支持</td>
            <td style="background-color:#fee;">不支持</td>
            <td style="background-color:#e8f8e8;">4.0 起支持</td>
            <td style="background-color:#fee;">不支持</td>
            <td style="background-color:#e8f8e8;">12.0 起支持</td>
        </tr>
    </tbody>
</table>

在这些格式中，最常用的是 ICO 格式，也是在歌中浏览器中兼容性最好的一种格式。ICO 格式是一种在 Windows 系统中作为图标使用的图像格式，比如在桌面、开始菜单以及资源管理器中，所有可执行程序都带有 ICO 格式的图标。ICO 一种容器格式，可以包含一个或多个不同尺寸和色彩深度的图标，以便在使用时适时缩放。其中图像的像素大小可以是 16\*16、32\*32、48\*48、64\*64、128\*128、256\*256 等任何你需要的尺寸（包含图像越多文件就越大），色彩深度可以是 8 位、24 位 或 32 位。

由于浏览器的用户界面各不相同，所以显示 Favicon 图标的位置也有所区别。下表是主流网页浏览器对显示 Favicon 图标位置的支持情况：

<table style="font-size:small;">
    <thead>
        <tr>
            <th>浏览器</th>
            <th>地址栏</th>
            <th>地址栏下拉菜单</th>
            <th>链接栏</th>
            <th>书签</th>
            <th>标签</th>
            <th>桌面快捷方式</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><strong>Chrome</strong></td>
            <td style="background-color:#fee;">不支持</td>
            <td style="background-color:#fee;">不支持</td>
            <td style="background-color:#e8f8e8;">支持</td>
            <td style="background-color:#e8f8e8;">支持</td>
            <td style="background-color:#e8f8e8;">1.0 起支持</td>
            <td style="background-color:#fee;">不支持</td>
        </tr>
        <tr>
            <td><strong>IE</strong></td>
            <td style="background-color:#e8f8e8;">7.0 起支持</td>
            <td style="background-color:#fee;">不支持</td>
            <td style="background-color:#e8f8e8;">5.0 起支持</td>
            <td style="background-color:#e8f8e8;">5.0 起支持</td>
            <td style="background-color:#e8f8e8;">7.0 起支持</td>
            <td style="background-color:#e8f8e8;">5.0 起支持</td>
        </tr>
        <tr>
            <td><strong>Edge</strong></td>
            <td style="background-color:#fee;">不支持</td>
            <td style="background-color:#e8f8e8;">支持</td>
            <td style="background-color:#e8f8e8;">支持</td>
            <td style="background-color:#e8f8e8;">支持</td>
            <td style="background-color:#e8f8e8;">支持</td>
            <td style="background-color:#e8f8e8;">支持</td>
        </tr>
        <tr>
            <td><strong>Firefox</strong></td>
            <td style="background-color:#fefef1;">1.0-12.0 期间支持<br />13.0 起不支持</td>
            <td style="background-color:#e8f8e8;">支持</td>
            <td style="background-color:#e8f8e8;">支持</td>
            <td style="background-color:#e8f8e8;">支持</td>
            <td style="background-color:#e8f8e8;">支持</td>
            <td style="background-color:#e8f8e8;">支持</td>
        </tr>
        <tr>
            <td><strong>Opera</strong></td>
            <td style="background-color:#fdfdf4;">7.0-12.17 期间支持<br />14.0 起不支持</td>
            <td style="background-color:#fdfdf4;">不支持</td>
            <td style="background-color:#e8f8e8;">7.0 起支持</td>
            <td style="background-color:#e8f8e8;">7.0 起支持</td>
            <td style="background-color:#e8f8e8;">7.0 起支持</td>
            <td style="background-color:#e8f8e8;">7.0 起支持</td>
        </tr>
        <tr>
            <td><strong>Safari</strong></td>
            <td style="background-color:#e8f8e8;">支持</td>
            <td style="background-color:#e8f8e8;">支持</td>
            <td style="background-color:#fee;">不支持</td>
            <td style="background-color:#e8f8e8;">支持</td>
            <td style="background-color:#e8f8e8;">12.0 起支持</td>
            <td style="background-color:#fee;">不支持</td>
        </tr>
    </tbody>
</table>

如前所述，Favicon 图标的标准实现是在网页文档的 `<head>` 部分使用带有 `rel` 属性的 `link` 元素指定文件格式、文件名以及文件路径。以下是 Chrome、IE、Edge、Firefox、Opera 和 Safari 对不同实现的支持情况：

```html
<link rel="shortcut icon" href="https://example.com/myicon.ico">
```

```html
<link rel="icon" type="image/svg+xml" href="https://example.com/image.svg">
```

▲ 此上两种方式所有浏览器均支持

```html
<link rel="icon" type="image/vnd.microsoft.icon" href="https://example.com/image.ico">
```

```html
<link rel="icon" type="image/x-icon" href="https://example.com/image.ico">
```

▲ 此上两种方式 IE 浏览器在 IE9 之后支持

```html
<link rel="icon" href="https://example.com/image.ico">
```

```html
<link rel="icon" type="image/gif" href="https://example.com/image.gif">
```

```html
<link rel="icon" type="image/png" href="https://example.com/image.png">
```

▲ 此上三种方式 IE 浏览器在 IE11 之后支持

```html
<link rel="mask-icon" href="https://example.com/image.svg" color="red">
```

▲ 此方法只有 Safari 浏览器支持。

当前的 HTML5 规范推荐使用 `<link>` 标签的属性 `rel="icon" size="使用空格分隔的尺寸数值"`为图标指定多种尺寸。还可以通过在 `<link>` 标签内使用属性 `type="文件内容类型"` 提供包括类容器格式（如微软的 `.icon` 和 Mac 系统的 `icns`）以及矢量图形在哪的多种图标格式。

主流浏览器会优先识别 `link` 元素指定的 Favicon 图标，若没有指定，浏览器会尝试读取网站根目录的 favicon.ico 文件，如果不存在会出现找不到 favicon.ico 的 404 错误（一定程度上影响页面载入速度）。

如果使用了两个 `link` 元素同时指定了 ICO 和 PNG 格式的 Favicon 图标，不同浏览器在识别它们时优先级会有所不同：Firefox 始终会优先使用 ICO 格式。Chrome、Safari、Opera 会优先使用像素尺寸为 32\*32、16\*16 的格式，否则会使用 ICO 格式。

## 三、使用 icotool 创建 Favicon 图标

制作 ICO 图标有很多种方法，这里介绍的是利用 icotool 这款工具创建图标的方法。

icotool 是一款专门处理图标文件（后缀为 `.icon`）和光标文件（后缀为 `.cur`）的命令行工具，可在类 Unix 系统（如 Linux、macOS）中使用。本文只介绍图标相关的功能。

icotool 其实是套装命令行程序 [icoutils](https://www.nongnu.org/icoutils/) 中的一个工具，所以想要使用它，需要安装 icoutils。在 macOS 系统中可以直接使用 [Homebrew](https://brew.sh/) 安装：`brew install icoutils`。

安装好 icoutils 之后，可以使用命令 `man icotool` 查看 icotool 的使用说明。从中可以看到 icotool 有三种模式：列出（list）、提取（extract）和创建（create）。每种模式都有一些可选的参数。

### 1、列出 ICO 图标包含的图片

列出模式是指在命令行上列出指定 ICO 文件所包含的所有图片，其用法如下（`-l` 可换成 `--list`）：

```bash
icotool -l /path/to/favicon.ico
```

如操作无误，在命令行上就可以显示出如下所示的图片列表：

```
--icon --index=5 --width=16 --height=16 --bit-depth=8 --palette-size=256
--icon --index=4 --width=24 --height=24 --bit-depth=8 --palette-size=256
--icon --index=3 --width=32 --height=32 --bit-depth=8 --palette-size=256
```

默认情况下该命令会列出 ICO 图标包含的所有图标，你也可以通过以下可选参数过滤列出结果：

* `-i` 或 `--index=N`：列出指定索引编号的图片
* `-w` 或 `--width=PIXELS`：列出指定宽度是的图片
* `-h` 或 `--height=PIXELS`：列出指定高度的图片
* `-b` 或 `--bit-depth=COUNT`：列出指定颜色深度的图片（可用项位 1、2、4、8、16、24 和 32）
* `-p` 或 `--palette-size=PIXELS`：列出指定色彩范围的图片（24、32 位图片不可用）
* `--icon`：只处理有效的 ICO 格式文件

注意，创建图标时，如果 PNG 带有透明部分，颜色深度将自定设定为 32 位。

### 2、提取 ICO 图标包含的图片

提取模式是指把 ICO 文件中的图片提取出来，其用法如下（`-x` 可换成 `--extract`）：

```bash
icotool -x /path/to/favicon.ico
```

如操作无误，就可以在被提取 ICO 文件所在目录看到如下所示的三张图片：

* `favicon_1_16x16x8.png`
* `favicon_2_24x24x8.png`
* `favicon_3_32x32x8.png`

默认情况下该命令会把 ICO 文件中的所有图片都提取出来，你可以像列出功能那样，使用可选参数来提取符合条件的图片，如索引编号、宽度、高度等。

此外你还可以使用 `-o` 或 `--output=PATH` 参数指定存放提取图片的路径。

### 3、用指定图片创建 ICO 图标

创建模式则是通过将现成的单张或多张 PNG 图片转制成 ICO 格式的图标文件。下面是它的具体用法。

在使用 icotool 创建 ICO 图标之前，可以先用图形处理软件（如 PhotoShop）制作好单张的 PNG 图标。

作 Favicon 用的 ICO 图标一般只需要包含 16\*16、24\*\24、32\*32 这三种尺寸就够了（如果考虑到大图标的使用场景也可以加入一个 128\*128 的尺寸，不过这会导致创建的 ICO 图标比较大），如下所示：

* `f16.png`
* `f24.png`
* `f32.png`

单张图标准备好之后，就可以使用如下命令将这些图片转制成 ICO 图标了（`-c` 可换成 `--create`）：

```bash
icotool -c f16.png f24.png f32.png -o favicon.ico
```

注意，这里也和提取命令一样使用了参数 `-o`，用来指定转制的 ICO 文件存放路径。

在创建图标的时候，可以附加几个可选参数：

* `-b` 或 `--bit-depth=COUNT`：为图片指定颜色深度。可以使用一次为所有图片指定色深，也可使用多次为每一个图片指定色深（这种情况下需要为每一张图片都指定色深）
* `-t` 或 `--alpha-threshold=LEVEL`：在创建图标时，为 PNG 图片要变成透明的部分指定最大 Alpha 级别。默认值是 `127`（范围 `0~255`）。一般是在把含 Alpha 通道的色深为 32 的图片转换成色深为 24 的图片时使用，它可以把指定 Alpha 级别以内的像素变成完全透明的（其它则不透明）。
* `-r` 或 `--raw=FILENAME`：将输入文件以原始 PNG 的形式存储（Vista 图标）。默认情况下程序会自动优化输入的 PNG 图片，对于不想要处理的 PNG 就可以使用此参数指定。用法如下所示：

```bash
icotool -c -r f16.png -r f24.png f32.png -o favicon.ico
```

这段代码的意思是，除了 `f32.png` 其它 PNG 图片都会以原始的形式存入生成的图标中。

---

## 补充：iOS 对图标的特殊用法

苹果的 iOS 系统没有采用 HTML 推荐标准，而是用专有方法 `apple-touch-icon` 实现。此方法可以让用户利用 Safari 分享功能上的【添加到主屏幕（Add to Home Screen）】把网站图标添加到主屏上。

此方法要求图标文件必须是 PNG 格式，并可通过两种方式实现。一种是通过在网页 `<head>` 部分添加 `<link rel="apple-touch-icon" href="/custom_icon.png">` 指定图标文件。另一种是在网站根目录添加名为 `apple-touch-icon` 为或以其为前缀的图标文件，如果没有使用 `link` 元素指定图标，系统会自动搜索这些图标文件。如果这两种方式没有使用，系统会用网页的缩略图作为图标。

在图标尺寸方面，iPad 的推荐基准尺寸是 152\*152 像素，iPhone 的基准尺寸是 180\*180 像素（[参考 iOS 当前图标尺寸标准](https://developer.apple.com/design/human-interface-guidelines/ios/icons-and-images/app-icon/)）。在指定图标时，可以根据设备分辨率的不同，指定不同尺寸的图标。例如，为了同时支持 iPhone 和 iPad 设备，可以像下面这样为每个 `link` 元素添加 `sizes` 属性：

```
<link rel="apple-touch-icon" href="touch-icon-iphone.png">
<link rel="apple-touch-icon" sizes="152x152" href="touch-icon-ipad.png">
<link rel="apple-touch-icon" sizes="180x180" href="touch-icon-iphone-retina.png">
<link rel="apple-touch-icon" sizes="167x167" href="touch-icon-ipad-retina.png">
```

如果系统没有找到设备的推荐尺寸图标，会使用比推荐尺寸大的图标，如果仍然没有，就使用当前图标中最大的那一个。例如，如果设备的推荐图标尺寸是 58\*58，系统会按照如下顺序搜索文件名：

```
apple-touch-icon-80x80.png
apple-touch-icon.png
```

iOS 会自动把图标转换成圆角形式。在 iOS7 之前还会为图标添加投影和高光（如果不想添加这些效果需要为图标文件名末尾附加 `-precomposed`）。

---

参考资料：

* [Favicon](https://en.wikipedia.org/wiki/Favicon)
* [ICO (Fileformat)](https://en.wikipedia.org/wiki/ICO_(file_format))
* [Icons](https://docs.microsoft.com/en-us/windows/win32/uxguide/vis-icons)
* [Configuring Web Applications](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html)
* [Portable Network Graphics](https://en.wikipedia.org/wiki/Portable_Network_Graphics)
* [Color depth](https://en.wikipedia.org/wiki/Color_depth)
