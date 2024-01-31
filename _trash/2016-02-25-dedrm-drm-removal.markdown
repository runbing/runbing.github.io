---
layout: post
title: "用 DeDRM 移除 Kindle 电子书 DRM 保护"
date: 2016-02-25 23:51:10 +0800
author: Runbing
tags:
- Kindle
- DeDRM
- DRM
- AZW3
- 电子书
categories:
- 技术
description: 亚马逊提供的azw或azw3格式电子书都是经过DRM加密了的，无法在其他Kindle设备阅读，也无法通过Calibre软件对其进行格式转换。为了突破这种限制，就需要移除电子书的DRM保护。
---

**\* 提示：**请确保要移除 DRM 保护的电子书是用你自己的亚马逊账号所购买的，本方法不适用他人购买的电子书。为规避法律风险，请不要将移除 DRM 的电子书以任何形式公开发布到互联网。


## 一、何为 DRM 保护？

DRM，全称 Digital Rights Management（数字版权管理），是随着电子音频视频节目在互联网上的广泛传播而发展起来的一种新技术。出版者利用这些技术保护有数字化内容（例如：软件、音乐、电影），防止数字出版物被非法复制，或者在一定程度上使复制很困难，使得最终用户必须得到授权后才能使用数字媒体。其实在这里我们只需要知道DRM是为了保护电子书版权而使用的一种限制技术就可以了。[via](http://zh.wikipedia.org/wiki/%E6%95%B0%E5%AD%97%E7%89%88%E6%9D%83%E7%AE%A1%E7%90%86)

## 二、为何移除 DRM？

先举个例子，我从亚马逊购买了一本电子书，尝试使用 Calibre 软件把这本电子书的 azw 格式文件换成 mobi 格式时，会弹出如下图所示的错误提示，无法转换格式也无法阅读：

![azw-drm-alert](/assets/img/2014/08/azw-drm-alert.png)

在美国亚马逊（美亚）或日本亚马逊（日亚）购买的 Kindle 设备（如 Kindle4、Kindle5）是无法绑定中国亚马逊账号的，这就导致在中国亚马逊购买的电子书不能通过正常推送渠道推送电子书，同样，在美亚日亚购买的电子书也无法推送到绑定中国亚马逊账号的Kindle中。

为了保护电子书的版权，亚马逊提供的 AZW 或 AZW3 格式电子书都是经过 DRM 加密了的，即便是获取到了 AZW 或 AZW3 格式的电子书文件，也无法直接在其他阅读器或阅读设备上阅读。比如你在亚马逊买到一本电子书，想要共享给自己的亲朋好友，或拷贝到另外一台 Kindle 设备，但由于 DRM 保护的存在变得不可行。为了突破这种限制，就需要移除 DRM 保护。

## 三、如何移除 DRM？

[DeDRM tools](https://github.com/apprenticeharper/DeDRM_tools) 这款软件让移除 DRM 的过程变得很简单。下面是详细的操作步骤：

### 1、下载 DeDRM tools 软件

![DeDRM](/assets/img/2014/08/DeDRM.png)

下载 DeDRM tools 备用。运行该软件可能会需要如下所示的那些依赖项，请按需处理。

* **DeDRM tools (v6.3.3) 下载**：[官方下载](https://github.com/apprenticeharper/DeDRM_tools/releases)

DeDRM tools 依赖 Python 环境，macOS 系统自带 Python 环境，无需手动安装，Windows 系统需要手动安装 **Python** 和 **PyCrypto**：

* __Python 下载__：[官方下载](http://www.activestate.com/activepython/downloads)
* __PyCrypto 下载__：[官方下载](http://www.voidspace.org.uk/python/modules.shtml#pycrypto)（要下载和 Python 版本相对应的版本）

另外，如果你下载的是最新版本的 DeDRM tools，还需要安装如下依赖模块：

```shell
pip install pylzma
```

注意，对于 Windows 系统，安装次模块需要安装 [Microsoft Visual C++ Compiler for Python 2.7](https://www.microsoft.com/en-us/download/details.aspx?id=44266)。

### 2、获取含 DRM 的电子书

准备好需要移除 DRM 的 AZW 或 AZW3 格式的电子书文件。电子书的获取方式如下：

#### ① 从亚马逊云端下载（推荐）

登录你的亚马逊账号并进入“**[我的内容](https://z.cn/myk)**”（注意要用绑定 Kindle 设备的亚马逊账号登录），点击电子书列表中某本电子书旁边的【**...**】按钮，在弹出的菜单中点击“**通过电脑下载USB传输**”，选择你的 Kindle 设备并点击【下载】按钮下载。

#### ② 从 Kindle 应用中获取

此方法需要安装 Kindle 桌面应用程序。安装完成后打开软件，用你的亚马逊账号登录并下载电子书，就可以从软件存放电子书的位置找到它，电子书的文件名类似于 `B0080BKP1K_EBOK.azw`。

以下是 Kindle 桌面应用程序的官方下载链接：

* **Kindle for Windows 版**：[官方下载](http://www.amazon.cn/kindlepcdownload)
* **Kindle for Mac 版**：[官方下载](https://itunes.apple.com/cn/app/kindle-dian-zi-yue-du-qi-ke/id302584613?mt=8)

以下是从 Kindle 应用程序下载的电子书存放位置：

* Kindle for PC 版：`C:\Users\你的用户名\Documents\My Kindle Content`
* Kindle for Mac 版：`/Users/你的用户名/Library/Application Support/Kindle/My Kindle Content`

#### ③ 从 Kindle 阅读器中获取

用 USB 数据线将 Kindle 连接到电脑，打开 Kindle 磁盘，在根目录里的 Documents 文件夹内找到 AZW 或 AZW3 格式的电子书文件并将其拷贝出来。

注意，这不是一个推荐方法，因为新的 Kindle 系统会分离电子书的内容，比如将其中的图片抽离，这会导致下载到 Kindle 的电子书缺失图片。此特性对除 MOBI7 格式之外的大部分电子书都有影响。

### 3、移除电子书的 DRM 保护

DeDRM tools 提供了不同的 DRM 移除方式，你可以根据自己的情况或喜好选用。

#### 方法一：利用 Kindle 设备的序列号

此方法需要 Kindle 设备的序列号。Kindle 的序列号可以在包装盒或保修单上找到，也可以在系统信息中找到。不同型号的 Kindle 设备其序列号位置不一样，下面列出了各个版本查看序列号的步骤：

* **Kindle Paperwrite 或更新版本的 Kindle：**
    * 中文版：`首页 — 菜单（右上角的三道杠） — 设置 — 菜单（右上角三道杠） — 设备信息`
    * 英文版：`Home — Menu — Settings — Menu — Device Info`
* **Kindle 4/Kindle Touch：**`home — menu — setting — 第二页的Device Info里的“Serial Number:”`
* **Kindle 1/2/3/Keyboard/DX/DXG：** `home — menu — settings — 屏幕右下角会显示序列号（未证实）`

**★ macOS 操作系统操作步骤**

打开刚才解压的 DeDRM\_tools-master 文件夹，进入 DeDRM\_Macintosh\_Application 目录，双击打开 DeDRM，界面如下图所示，点击界面右下角【Configure...】

![dedrm-mac](/assets/img/2014/08/dedrm-mac.jpg)

在弹出的窗口中选中第一项【eInk Kindle ebooks】，然后点击【Configure...】（也可以双击【eInk Kindle ebooks】这一项）。

![dedrm-mac2](/assets/img/2014/08/dedrm-mac2.jpg)

在弹出的窗口中输入你的 Kindle 序列号，点击【Add】按钮。

![dedrm-mac3](/assets/img/2014/08/dedrm-mac3.jpg)

返回主界面后，点击界面下方的【Select Ebook】，选择刚才拷贝的那个 AZW 或 AZW3 文件，点击确定即可完成 DRM 的移除。

**★ Windows 操作系统操作步骤**

打开刚才解压的 DeDRM\_tools-master 文件夹，进入 DeDRM\_Windows\_Application\\DeDRM\_App 目录，双击打开 DeDRM\_Drop\_Target.bat，出现如下界面：

![dedrm-windows](/assets/img/2014/08/dedrm-windows.jpg)

在【eInk Kindle Serial Number list】一栏中填写你的 Kindle 序列号，然后点击下方的【Set Prefs】按钮保存。接下来，点击界面下面的【Select an eBook to Process】一栏后面的【...】按钮，选择电子书，点击【Process eBook】即可完成 DRM 的移除。

#### 方法二：利用 Kindle 应用程序 KEY

此方法仅支持小于 1.25 版本的 Kindle for PC/Mac。

操作步骤与“方法一”大体相同，但是不再需要手动配置 Kindle 序列号之类的东西了。只要你安装了 Kindle 应用程序并登录了亚马逊账号，就可以直接使用 DeDRM Tools 移除电子书 DRM 了。

首次移除 DRM 时，DeDRM Tools 会自动读取 Kindle 应用的 KEY 信息并保存起来，以便下次复用。

## 五、相关问答

### 1、为何移除 DRM 的电子书不显示图片？

检查一下移除 DRM 前后的 AZW3 文件大小是否相同，如果相同说明移除 DRM 前图片就是不存在的。这可能是由于 Kindle 系统分离了电子书内容和图片导致的，请通过本文介绍的其它方式获取电子书。

### 2、如何用 Calibre 插件移除DRM保护？

如果你习惯使用 [Calibre](https://calibre-ebook.com/) 管理电子书，可以安装插件形式的 DeDRM Tools。只需要将“DeDRM\_tools-master/DeDRM\_calibre\_plugin”文件夹里的插件包“DeDRM\_plugin.zip”导入到 Calibre 的插件里，这样就可以通过将 AZW 或 AZW3 格式的文件拖入书库自动移除 DRM 保护。

![calibre-plugin](/assets/img/2014/08/calibre-plugin.jpg)

导入插件并移除电子书 DRM 保护的详细步骤：

1. 打开 Calibre，点击菜单中的【首选项】，在高级选项区域点击【插件】
2. 点击右下角的【从文件加载插件】，选择刚才解压的文件 DeDRM\_tools-master/DeDRM\_calibre\_plugin/DeDRM\_plugin.zip。
3. 在“文件类型 插件”中双击刚刚导入的插件，在弹出的窗口中点击【eInk Kindle ebooks】按钮，在新弹出的对话框中点击右侧的【+】按钮，在弹出的对话框中的【EInk Kindle Serial Number】一栏里输入你的 Kindle 序列号。然后一路确定、关闭、确定。
4. 应用更改后重新启动 Calibre 软件，插件即可生效，把带 DRM 的书拖进书库即可完成 DRM 的移除。