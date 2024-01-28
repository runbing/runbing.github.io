---
layout: post
title: "利用 Aria2 全速下载百度网盘的分享资源"
date: 2016-11-15 16:28:58 +0800
author: Runbing
tags:
- Aria2
- 百度网盘
- 下载工具
categories:
- 技术
description: 以 Aria2 为主要工具，搭配以 webui-aria2 和 BaiduExporter 下载百度网盘资源，速度可喜，本文是此方案的配置方法，步骤以 macOS 系统为例。
---

之前使用百度网盘的 macOS 客户端，同步速度能达到 1MB 左右，对于 20Mbp 的宽带来说虽然没达到全速，但也勉强过得去。今天需要从百度网盘下载大批量的文件，老客户端无法同步了，所以就更新客户端，原来改版了，下载速度也更坑爹了，只有 70KB 左右，这百度真是鸡贼的很，你可以卖会员，但也不能这么过分，依仗垄断地位把原来的下载速度限制到这个地步吧。

在搜索解决方案的时候，得知了 Aria2 这款软件，安装配置完，试着下载一个几十个 G 的文件夹，速度能达到 2.5MB 左右，甚为惊喜。所以记录分享一下。

Aria2 是一款轻量的多线程、多源命令行下载工具。支持 HTTP/HTTPS、FTP、SFTP、BitTorrent 和 Metalink，还可以通过内置的 JSON-RPC 和 XML-RPC 接口控制软件。需要着重说明的是，Aria2 运行时不会占用过多资源，根据官方介绍，内存占用通常在 4MB\~9MB，使用BitTorrent 协议，下行速度 2.8MB/s 时 CPU 占用率约 6%。

网上有小伙伴以 Aria2 为主要工具，搭配以 [webui-aria2](https://github.com/ziahamza/webui-aria2) 和 [BaiduExporter](https://github.com/acgotaku/BaiduExporter) 下载百度网盘资源，速度可喜，下面是此方案的配置方法，步骤以 macOS 系统为例。

## 1、安装 Aria2 软件

为方便安装，推荐先安装装套件管理器 [Brew](http://brew.sh/index_zh-cn.html)，打开“终端”输入以下命令：

```shell
$ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

安装成功后，输入以下命令安装 Aria2：

```shell
$ brew install aria2
```

## 2、添加 Aria2 配置

全选下面这些代码，保存为成一个配置文件，如 [aria2.conf](/sources/aria2.conf)，存放到某路径，如 /usr/local/etc/。

```shell
#用户名
#rpc-user=user
#密码
#rpc-passwd=passwd
#设置加密的密钥
#rpc-secret=secret
#允许rpc
enable-rpc=true
#允许所有来源, web界面跨域权限需要
rpc-allow-origin-all=true
#是否启用https加密，启用之后要设置公钥,私钥的文件路径
#rpc-secure=true
#启用加密设置公钥
#rpc-certificate=/home/name/.config/aria2/example.crt
#启用加密设置私钥
#rpc-private-key=/home/name/.config/aria2/example.key
#允许外部访问，false的话只监听本地端口
rpc-listen-all=true
#RPC端口, 仅当默认端口被占用时修改
#rpc-listen-port=6800
#最大同时下载数(任务数), 路由建议值: 3
max-concurrent-downloads=5
#断点续传
continue=true
#同服务器连接数
max-connection-per-server=5
#最小文件分片大小, 下载线程数上限取决于能分出多少片, 对于小文件重要
min-split-size=10M
#单文件最大线程数, 路由建议值: 5
split=10
#下载速度限制
max-overall-download-limit=0
#单文件速度限制
max-download-limit=0
#上传速度限制
max-overall-upload-limit=0
#单文件速度限制
max-upload-limit=0
#断开速度过慢的连接
#lowest-speed-limit=0
#验证用，需要1.16.1之后的release版本
#referer=*
#文件保存路径, 默认为当前启动位置
dir=D:\Downloads
#文件缓存, 使用内置的文件缓存, 如果你不相信Linux内核文件缓存和磁盘内置缓存时使用, 需要1.16及以上版本
#disk-cache=0
#另一种Linux文件缓存方式, 使用前确保您使用的内核支持此选项, 需要1.15及以上版本(?)
#enable-mmap=true
#文件预分配, 能有效降低文件碎片, 提高磁盘性能. 缺点是预分配时间较长
#所需时间 none < falloc ? trunc << prealloc, falloc和trunc需要文件系统和内核支持
file-allocation=prealloc
#不进行证书校验
check-certificate=false
```

## 3、启动 Aria2 软件

启动 Aria2 有两种方式，一种是实时运行，只需要输入以下命令即可：

```shell
$ aria2c --conf-path="/usr/local/etc/aria2.conf"
```

这种方式需要“终端”窗口一只打开着，可以实时显示下载进度等信息。因为后面会使用界面更友好的 webui-aria2，所以可以让 Aria2 在后台运行，只需要在命令后面添加一个 ```-D``` 即可：

```shell
$ aria2c --conf-path="/usr/local/etc/aria2.conf" -D
```

## 4、使用 webui-aria2

webui-aria2 是专门为 Aria2 而开发的一个界面管理工具，可以通过 RPC 接口控制 Aria2。webui-aria2 不需要安装，只需要访问下面这个地址，然后简单地配置一下即可。

[http://ziahamza.github.io/webui-aria2/](http://ziahamza.github.io/webui-aria2/)

点击菜单中的【设置】->【连接设置】，在“__主机__”中填写 ```localhost```，端口填写 ```6800```，然后点击【保存连接设置】，填入的信息即可以 Cookie 的方式保存下来。

以上，下载工具 Aria2 和界面管理工具 webui-aria2 便配置完成，可以正常工作了。不过为了更方便地下载百度网盘的资源，还需要再安装一个 Chrome 插件（当然前提是你得使用 Chrome 浏览器）。

## 5、下载安装 BaiduExporter

BaiduExporter 是一个生成百度网盘下载链接的小插件，不过目前没法在 Chrome 扩展商店安装，需要手动安装。首先下载 BaiduExporter 源码。可以去[项目主页](https://github.com/acgotaku/BaiduExporter)直接下载，也可以通过 Git 命令下载：

```shell
git clone https://github.com/acgotaku/BaiduExporter
```

下载完毕，进入 BaiduExporter 文件夹，可以看到插件文件 chrome.crx ，但是不要直接安装，不然每次打开 Chrome 的时候会提示插件已禁用，下面会给出解决办法，现在先删除 chrome.crx。

打开 Chrome，通过设置进入扩展页面，或直接在地址栏输入 ```chrome://extensions```，开启“__开发者模式__”。点击【打包扩展程序...】按钮会弹出一个对话框，然后点击“扩展程序跟目录”后的【浏览...】，选择 BaiduExporter 文件夹中的 chrome 文件夹，最后点击【打包扩展程序】按钮。操作完毕，BaiduExporter 文件夹中出现一个新的 chrome.crx 文件，把它拖放到 Chrome 的扩展页面安装。

全选下载下面的代码，保存为 [com.google.Chrome.mobileconfig](/sources/com.google.Chrome.mobileconfig)。然后用代码编辑器把扩展 ID 替换 19 行的 value01，删除第 20 和 21 行，保存。最后双击这个文件导入。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>PayloadContent</key>
    <array>
        <dict>
            <key>PayloadContent</key>
            <dict>
                <key>com.google.Chrome</key>
                <dict>
                    <key>Forced</key>
                    <array>
                        <dict>
                            <key>mcx_preference_settings</key>
                            <dict>
                                <key>ExtensionInstallWhitelist</key>
                                <array>
                                    <string>value01</string>
                                    <string>value02</string>
                                    <string>value03</string>
                                </array>
                            </dict>
                        </dict>
                    </array>
                </dict>
            </dict>
            <key>PayloadEnabled</key>
            <true/>
            <key>PayloadIdentifier</key>
            <string>MCXToProfile.7e2bec75-299e-44ff-b405-628007abffff.alacarte.customsettings.bdac4880-d25f-4cdd-8472-05473f005e7e</string>
            <key>PayloadType</key>
            <string>com.apple.ManagedClient.preferences</string>
            <key>PayloadUUID</key>
            <string>bdac4880-d25f-4cdd-8472-05473f005e7e</string>
            <key>PayloadVersion</key>
            <integer>1</integer>
        </dict>
    </array>
    <key>PayloadDescription</key>
    <string>Included custom settings:
com.google.Chrome
</string>
    <key>PayloadDisplayName</key>
    <string>MCXToProfile: com.google.Chrome</string>
    <key>PayloadIdentifier</key>
    <string>com.google.Chrome</string>
    <key>PayloadOrganization</key>
    <string></string>
    <key>PayloadRemovalDisallowed</key>
    <true/>
    <key>PayloadScope</key>
    <string>System</string>
    <key>PayloadType</key>
    <string>Configuration</string>
    <key>PayloadUUID</key>
    <string>7e2bec75-299e-44ff-b405-628007abffff</string>
    <key>PayloadVersion</key>
    <integer>1</integer>
</dict>
</plist>
```

以上便是所有的安装配置，接下来就可以正式利用它下载百度网盘资源了。

## 6、下载百度网盘资源

首先确保已经运行了 Aria2，也开了 webui-aria2 页面。打开一个百度资源页面，BaiduExporter 插件会自动在【保存到网盘】按钮旁边生成一个【导出下载】按钮，鼠标划上去出现一个菜单，点击“ARIA2 PRC”，即可把该资源添加到 Aria2 下载。打开 webui-aria2 页面可以监控下载进度等信息。

Enjoy it！

---

参考文章：

* [使用Aria2下载百度网盘和115的资源](https://blog.icehoney.me/posts/2015-01-31-Aria2-download)
* [Guide on Packaging and Import Baidu Exporter to Chrome](https://hencolle.com/2016/10/16/baidu_exporter/)