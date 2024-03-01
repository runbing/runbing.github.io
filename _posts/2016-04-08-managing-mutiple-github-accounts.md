---
layout: article
title: "如何在一台电脑中使用多个 GitHub 账号"
date: 2016-04-08 14:33:12 +0800
author: Runbing
tags:
  - github
  - git
categories:
  - technology
excerpt: 因为需要需要在同一台电脑上使用两个 GitHub 账号，搜索了一番中文资料，仍然是各种坑。最后还在看了老外的一篇文章才搞定（总是这样）。为方便记忆整理一下存档。注意，下面是以 Mac OS X 系统为例的。
---

因为需要需要在同一台电脑上使用两个 GitHub 账号，搜索了一番中文资料，仍然是各种坑。最后还在看了老外的一篇文章才搞定（总是这样）。为方便记忆整理一下存档。注意，本文是以 Mac OS X 系统为例。

## 一、分别为两个 GitHub 账号生成 SSH 密钥

下面以“first”和“second”两个 GitHub 账号作为例子，说明一下实现方法。

因为 GitHub 是通过 SSH 密钥配对的方式验证的，所以需要先给两个 GitHub 账号分别准备一份 SSH 密钥。具体方法如下：

```bash
$ cd ~/.ssh
$ ssh-keygen -t rsa -f id_rsa_first -C "your_first_email@domain.com"
$ ssh-keygen -t rsa -f id_rsa_second -C "your_second_email@domain.com"
```

操作完成后，在 `~/.ssh/` 路径下会出现四个文件：

* id_rsa_first
* id_rsa_first.pub
* id_rsa_second
* id_rsa_second.pub

## 二、把 SSH 密钥分别添加到两个 GitHub 账户中

使用下列命令获取两个 SSH 密钥的值：

```bash
$ cat id_rsa_first.pub
$ cat id_rsa_second.pub
```

把这两个值分别粘贴到 GitHub 账号中的 SSH keys 中保存。

## 三、设置配置文件让不同账号访问不同 SSH 密钥

使用下面的命令在 `~/.ssh/` 下新建一个名为 `config` 的文件并编辑：

```bash
$ touch config
$ vim config
```

填入以下内容：

```html
#First GitHub
Host first
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_rsa_first
#Second GitHub
Host second
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_rsa_second
```

然后清空一下本地的 SSH 缓存，添加一下新的 SSH 密钥：

```bash
$ ssh-add -D
$ ssh-add id_rsa_first
$ ssh-add id_rsa_second
```

最后确认一下新密钥已经添加成功：

```bash
$ ssh-add -l
```

最后验证一下两个帐户是否可用：

```bash
$ ssh -T first
$ ssh -T second
```

如果均出现“xxx! You've successfully authenticated, but GitHub does not provide bash access.”的提示，说明已经设置成功。

## 测试使用 Git 推送到不同的 GitHub 账号

首先在 GitHub 上新建一个名为 test-first 的远程库。然后再在本地建一个本地库：

```bash
$ cd ~/documnts
$ mkdir test-first
$ cd test-first
```

在本地库中随便新建一个文件（如一个名为 README.md 的空文件）测试推送：

```bash
$ touch README.md
$ git init
$ git add .
$ git commit -m "First Commit"
$ git remote add origin git@first:first/test-first.git
$ git push origin master
```

注意，上面示例中用 `git@first``` 替代了 ```git@github.com`。另外一个帐户“second”同样如法炮制。

---

参考资料：

* [Managing Multiple Github Accounts](http://mherman.org/blog/2013/09/16/managing-multiple-github-accounts)
