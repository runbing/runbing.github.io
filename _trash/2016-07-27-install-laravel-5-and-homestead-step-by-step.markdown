---
layout: post
title: "Laravel 5.2 与 Homestead 的详细安装配置步骤"
date: 2016-07-27 14:31:43 +0800
author: Runbing
tags:
- Laravel 5
- Laravel
- Homestead
- Vagrant
- PHP
categories:
- 技术
description: 在安装 PHP 框架 Laravel 5.2 的时候遇到很多坑，我认为这些坑其实都是官方文档不甚详尽导致的。因为对于刚接触这个框架的人来说，在没有针对性研究的情况下，官方文档那种看似条理清晰、言简意赅的表述就显得过于轻率了，这也自然会让人产生一种对初学者不友好的印象。
---

在安装 PHP 框架 Laravel 5.2 的时候遇到很多坑，我认为这些坑其实都是官方文档不甚详尽导致的。因为对于刚接触这个框架的人来说，在没有针对性研究的情况下，官方文档那种看似条理清晰、言简意赅的表述就显得过于潦草了，这也自然会有一种对初学者不友好的印象。其实如果操作熟练了，你会发现官方文档提供的步骤只能当 Tips 看。花了一些时间研究并厘清各种问题之后，用一篇文章备忘一下。

以下内容皆以 Mac 系统为例，Linux 除一点儿小区别外也基本适用。

## 一、安装 Composer

安装 Laravel 需要用到 Composer 这个依赖关系管理工具。Laravel 作为一个 PHP 框架自然少不了许多相关依赖，使用 Composer 就可以免去手动处理，很方便地对这些依赖进行自动处理。关于这个工具的详细介绍和用法可以去[英文官网](https://getcomposer.org/)或[中文官网](http://www.phpcomposer.com/)查看，此处仅涉及到能用到的一些功能。

安装 Composer 很简单，只需依次运行下面两行命令即可将 Composer 安装到执行文件目录里。

```bash
$ curl -sS https://getcomposer.org/installer | php
$ mv composer.phar /usr/local/bin/composer
```

\* 注意，如果下载出错，请尝试直接去[官网下载页面](https://getcomposer.org/download/)获取最新版本 composer.phar 文件的下载链接，然后再使用 wget 命令或迅雷直接下载。下载完毕后再执行上面的第二条命令。

如果成功安装，在终端中输入以下命令，就可以显示出 Composer 的帮助内容：

```bash
$ composer
```

注意，如果输入命令后提示没有找到命令，需要检查下路径有没有写错，正确路径应该是 `/usr/local/bin/`。如果路径确认无误，就使用命令 ```echo $PATH``` 看一下当前帐号的环境变量中有没有 `/usr/local/bin/` 这个路径（比如一般 Linux 下以 root 登录后 PATH 变量没有此路径）。

如果没有的话可以使用 `export PATH=/usr/local/bin:$PATH` 命令临时添加一条到 PATH 变量中（或者将这条命令添加到用户根目录下的 .bash_profile 文件中，这样每次开机即可自动添加）。

或者使用命令 `ln -s /usr/local/bin/composer /usr/bin/composer` 添加一个软链接到系统执行程序目录中，也可以达到同样的效果。

## 二、配置 Composer

虽然 Composer 安装完了，但还需要一点点配置才能安心使用。在使用 Composer 的时候，它会到原镜像源拉数据，但是由于国内糟糕的网络环境，会经常出现无法连接、下载过慢或下载中断的情况。这就需要修改一下，让 Composer 使用[国内的镜像源](http://pkg.phpcomposer.com/)，以便拉取数据时畅通无阻。

使用国内镜像源有两种方式，一种是在系统全局配置，即将配置信息添加到 Composer 的全局配置文件 config.json 中。具体方法为，在终端执行下面这行命令：

```bash
$ composer config -g repo.packagist composer https://packagist.phpcomposer.com
```

另一种是在单个项目中进行配置，即将配置信息添加到某个项目的配置文件 composer.json 中。具体方法为，先用 `cd` 定位到项目目录，然后执行下面这行命令：

```bash
$ composer config repo.packagist composer https://packagist.phpcomposer.com
```

其实以上这两个命令就是在不同位置的 json 配置文件中添加下面这段代码。全局配置文件在用户根目录下：`~/.composer/config.json`；而单个项目配置文件是在项目目录中：`composer.json`。

```json
{
    "repositories": {
        "packagist": {
            "type": "composer",
            "url": "https://packagist.phpcomposer.com"
        }
    }
}
```

这样在使用 Composer 的 `composer install` 和 `composer update` 命令时，速度就相当快了。

\* **注意！**如果使用的是 Linux 系统，非 Root 用户可能会找不到 `~/composer/config.json` 这个路径，就检查一下路径是否是 `~/.config/composer/config.json`。

## 三、安装 Laravel

接下来就轮到安装本文的主角 Laravel 了。其安装方法也有两种，一种是直接使用 Composer 创建 Laravel 项目，另一种是先用 Composer 全局安装 Laravel，再用 Laravel 命令创建项目。

### 方法一：使用 Composer 直接创建 Laravel 项目

在终端运行下面这行命令，即可创建一个新的 Laravel 项目。其中 YOURPROJECT 改为项目目录名。

```bash
$ composer create-project laravel/laravel YOURPROJECT
```

### 方法二：全局安装 Laravel 再用其命令创建项目

首先运行下面这个命令全局安装 Laravel：

```bash
$ composer global require "laravel/installer"
```

安装完毕后，可以在路径 `~/.composer/vendor/bin/` 下找到 ```laravel``` 这个命令文件，在当前目录输入 ```./laravel``` 即可执行。但是想要在任意位置使用 `laravel` 命令，还需要将其所在目录添加到 PATH 环境变量中才行。添加方法和前面提到的 Composer 命令是一样的。

一种是通过命令 `export PATH=~/.composer/vendor/bin/:$PATH` 临时添加到 PATH 变量中（或者将这条命令添加到用户跟目录下的 .bash_profile 文件中，这样每次开机可以自动添加）。

另一种是使用命令 `ln -s ~/.composer/vendor/bin/laravel /usr/bin/laravel` 添加一个软链接到系统执行程序目录中。这样在终端中直接输入 `laravel` 就可以调用 Laravel 命令了。

\* **注意！**如果使用的是 Linux 系统，非 Root 用户可能会找不到 `~/.composer/vendor/bin/laravel` 这个路径，就检查一下路径是否是 `~/.config/composer/vendor/bin/laravel`。

最后，执行下面这条命令就可以直接创建一个 Laravel 项目。其中 YOURPROJECT 改为项目目录名。

```bash
$ laravel new YOURPROJECT
```

当你看到命令只玩完毕并出现 `Application ready! Build something amazing.` 这行提示信息，就说明成功创建好 Laravel 项目了。

## 四、测试 Laravel

如果已经安装好了 php，可以先使用 cd 命令定位到 Laravel 项目的 public 文件夹中，执行下面的命令，然后打开浏览器访问 127.0.0.1:8080 简单测试一下项目是否能正常运行：

```bash
$ php -t ./ -S 127.0.0.1:8080
```

如果访问测试地址出现 500 错误，可能是因为缺少依赖，这就需要使用 Composer 安装相关依赖了。首先在终端通过 cd 命令进入 Laravel 项目目录，然后依次输入下面两条命令：

```bash
$ composer install
$ composer update
```

## 五、配置测试环境

关于 Lavavel 所需要的环境配置，Laravel 官网已经给列出来了，如下所示：

* PHP >= 5.5.9
* OpenSSL PHP Extension
* PDO PHP Extension
* Mbstring PHP Extension
* Tokenizer PHP Extension

当然你可以找一台旧电脑装上 Linux 手动配置服务器环境，也可以直接在本机安装一个 MAMP 或类似的服务器集成软件。当然也可以使用 Laravel 推荐使用的 Homestead。

对于刚接触的人来说 Homestead 这个东西让人特别晕。但是厘清之后就明白是真么一回事儿了。简单讲，就是利用 Vagrant 根据 Homestead 配置在 VirtualBox 中创建一个集成好开发环境的虚拟机。

Homestead 虽然省去了手动配置环境的麻烦，但也只适用于开发时使用，而真正的运营环境，手动配置环节的工作还是省不掉的。而且，其实质上是在本机虚拟出一个 Ubuntu 系统，所以也要考虑到自己电脑的内存大小是否合适。配置安装摸清门路倒是不难，只是要注意一些坑，下面会适时给出提示。

### 1、安装 VirtualBox 和 Vagrant

首先需要安装 VirtualBox 和 Vagrant 这个软件，前者是虚拟机软件，后者是一款用来构建虚拟开发环境的工具，可以通过它封装一个统一规格的开发环境。两个软件的下载页面如下：

* VirtualBox 下载：[https://www.virtualbox.org/wiki/Downloads](https://www.virtualbox.org/wiki/Downloads)
* Vagrant 下载：[https://www.vagrantup.com/downloads.html](https://www.vagrantup.com/downloads.html)

### 2、添加 laravel/homestead 虚拟机

下载并安装好两个软件。其中 VirtualBox 安装好就不需要管了，我们只用 Vagrant 管理虚拟机即可。首先执行下面这条命令，下载并添加 laravel/homestead 虚拟机文件。

```bash
$ vagrant box add laravel/homestead
```

需要注意的是，同样是因为国内网络环境的原因，下载速度极慢且容易断线，所以当在终端看到类似下面这个链接时，按 `Ctrl + C` 中断下载，然后把这个链接拷贝到迅雷等下载软件中下载。

[https://atlas.hashicorp.com/laravel/boxes/homestead/versions/0.5.0/providers/virtualbox.box](https://atlas.hashicorp.com/laravel/boxes/homestead/versions/0.5.0/providers/virtualbox.box)

文件大小 1.22G 左右。下载完毕后使用下面这个命令添加到虚拟机。需要注意的是，命令行中虚拟机文件的路径 `~/Downloads/virtualbox.box` 应该填写下载到的文件 virtualbox.box 的真实路径。

```bash
$ vagrant box add laravel/homestead ~/Downloads/virtualbox.box
```

添加完成后，运行命令 `$ vagrant box list` 查看以下虚拟机列表，如果出现 `laravel/homestead (virtualbox, 0)` 则表示添加成功了。其中 0 是版本号，这个小问题下面会提到。

### 3、配置 laravel/homestead 虚拟机

这个虚拟机就像一个黑盒子，里面已经配置好了 Laravel 所需要的环境。我们无需知道里面都有什么，也无需修改它们。只需要修改本机相关配置，把真实的项目目录映射进虚拟机，然后通过 Host 文件把任意域名映射到虚拟机 IP，就可以边开发项目边测试效果了。Homestead 就是起到这个配置作用。

首先在用户根目录安装 Homestead：

```bash
$ cd ~
$ git clone https://github.com/laravel/homestead.git Homestead
```

然后运行 init.sh 初始化一下 Homestead：

```bash
$ cd Homestead
$ bash init.sh
```

接着修改 Homestead 的配置文件：

```bash
$ vim ~/.homestead/Homestead.yaml
```

修改 folders 代码块，把本机项目路径映射到虚拟机：

```yaml
folders:
    - map: ~/sites/YOURPROJECT
      to: /home/vagrant/project
```

\* **注意！**其中 `map:` 后的路径是本机项目路径，`to:` 后面的是虚拟机中的映射路径。

修改 sites 代码块，把域名映射到虚拟机的项目路径：

```yaml
sites:
    - map: yoursite.com
      to: /home/vagrant/project/public
```

\* **注意！**其中 `map:` 后的是项目路径绑定的域名，`to:` 后面的是虚拟机中的映射路径。

保存并关闭文件。运行下面这行命令可以启动虚拟机了：

```bash
$ cd ~/Homestead
$ vagrant up
```

\* **重要！**需要特别注意的是，如果运行 `vagrant up` 命令后出现 `Box 'laravel/homestead' could not be found.` 的提示，无法成功启动运行虚拟机，是因为本地添加的虚拟机文件版本号为 0，从而导致 Homestead 配置无法正确识别虚拟机文件的版本号。解决方法为修改下面这个文件：

```bash
$ vim ~/Homestead/scripts/homestead.rb
```

找到下面这行代码，把版本号 `0.4.0` 改为 `0` 即可。

```ruby
config.vm.box_version = settings["version"] ||= ">= 0.4.0"
```

保存并退出，再运行 `vagrant up` 命令，就可以正常启动虚拟机了。[via](http://www.tuicool.com/articles/7ZjeUrJ)

### 4、在 Host 文件中添加域名映射

虚拟机默认 IP 为 192.168.10.10，比如在 Homestead 配置文件中配置好了域名 yoursite.com，那么就可以在 Host 文件中把这个域名映射至虚拟机的 IP，就可以在本机通过域名访问项目了。

使用 Root 权限修改 hosts 文件：

```bash
$ sudo vim /etc/hosts
```

在末尾最后添加一行：

```text
192.168.10.10   yoursite.com
```

保存并关闭。然后在浏览器中输入 yoursite.com 就可以访问项目了。

### 5、在同一个虚拟机中添加多个站点

如果有需要的话，Homestead 还支持在同一个虚拟机中添加多个站点。

修改 Homestead 配置文件：

```bash
$ vim ~/.homestead/Homestead.yaml
```

添加多个网站目录和域名映射：

```yaml
folders:
    - map: ~/sites/PROJECT1
      to: /home/vagrant/project1
    - map: ~/sites/PROJECT2
      to: /home/vagrant/project2
sites:
    - map: yoursite1.com
      to: /home/vagrant/project1/public
    - map: yoursite2.com
      to: /home/vagrant/project2/public
```

最后运行下面这条命令让虚拟机重载配置文件：

```bash
$  vagrant provision
```

\* **注意！**为了可以通过自定义域名访问添加的项目，别忘了在 hosts 文件中添加域名的映射。

### 6、虚拟机的端口映射功能

虚拟机提供了 localhost 端口转发的功能，比如在本机访问 localhost:8000 或 127.0.0.1:8000 时，端口会自动转发到虚拟机的 80 端口中。其他端口转发规则如下：

* SSH：2222 → 轉發至 22
* HTTP：8000 → 轉發至 80
* HTTPS：44300 → 轉發至 443
* MySQL：33060 → 轉發至 3306
* Postgres：54320 → 轉發至 5432

除以上默认的转发规则之外，还可以自定义端口转发，只需要修改 Homestead 配置文件即可。

```bash
$ vim ~/.homestead/Homestead.yaml
```

修改 ports 代码块，添加想要的转发规则：

```yaml
ports:
  - send: 93000
    to: 9300
  - send: 7777
    to: 777
    protocol: udp
```

### 7、一些常用的虚拟机操作命令

因为 Vagrant 命令需要根据 Homestead 配置操控虚拟机，所以运行时需要先进入 Homestead 文件夹。

```bash
$ cd ~/Homestead
```

启动虚拟机：

```bash
$ vagrant up
```

重载虚拟机：

```bash
vagrant reload --provision
```

重置虚拟机：

```bash
vagrant destroy --force
```

关闭虚拟机：

```bash
vagrant halt
```

### 8、Vagrant 命令和 Homestead 命令

在 4.x 版本时，官方文档出现过使用 Homestead 命令，如 `homestead up` 等，当时在 Homestead V2 版本中，这些命令被移除了，使用 Vagrant 命令取而代之，如 `vagrant up` 等。[via](https://laracasts.com/discuss/channels/general-discussion/issues-installing-homestead-3-os-x)

如果仍然习惯 Homestead 命令，或者想要在任意位置运行 vagrant 命令，可以通过在用户根目录的 .bash_profile 文件中添加以下代码。这样开机启动后即可以实现了。

```bash
function homestead() {
    ( cd ~/Homestead && vagrant $* )
}
```

注意，想要立即生效请在修改保存后运行 `source ~/.bash_profile` 命令。

当然也可以通过 alias 命令以添加别名的方式实现，如下所示。

```bash
$ alias homestead='function __homestead() { (cd ~/Homestead && vagrant $*); unset -f __homestead; }; __homestead'
```

这样就可以通过 `homestead up` 等命令替代 `vargrant up` 命令了。

把整个安装配置步骤写下来颇耗费一些时间。希望这些内容可以为想要快速入门者提供一些帮助，也为自己日后回顾的方便。真希望帮助文档写的更平易近人一些，而不是该详细描述的地方缺斤少两。