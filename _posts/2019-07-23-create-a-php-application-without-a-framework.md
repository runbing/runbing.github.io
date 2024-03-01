---
layout: article
title: "[翻译] 如何不依赖框架创建一个PHP应用程序"
date: 2019-07-23 15:52:00 +0800
updated: 2019-08-09 19:44:30 +0800
author: Runbing
tags:
  - php-framwork
  - composer
  - php
categories:
  - programming
  - translation
excerpt: 这个教程的目标是，提供一种简单的方法，给人们以指点。在大多数情况下框架没有意义，在一些第三方组件的帮助下，从头开始编写一个应用要比一些人想象的要容易得多。
---

<!-- ## Introduction -->

## 介绍

<!-- If you are new to the language, this tutorial is not for you. This tutorial is aimed at people who have grasped the basics of PHP and know a little bit about object-oriented programming. -->

如果你不熟悉 [PHP](https://www.php.net/manual/en/index.php) 语言，那本教程不适合你。本教程面向那些掌握了 PHP 基础知识并对面向对象编程有所了解的人。

<!-- You should have at least heard of SOLID. If you are not familiar with it, now would be a good time to familiarize yourself with the principles before you start with the tutorial. -->

你应当至少听说过 [SOLID](https://zh.wikipedia.org/wiki/SOLID_(%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1%E8%AE%BE%E8%AE%A1))。如果你对其不熟悉，在开始这个教程之前的现在，是熟悉这些原则的好时机。

<!-- I saw a lot of people coming into the Stack Overflow PHP chatroom and asking if framework X is any good. Most of the time the answer was that they should just use PHP and not a framework to build their application. But many are overwhelmed by this and don't know where to start. -->

我看到很多人进入 Stack Overflow 的 PHP 聊天室询问某框架好不好。大多情况下，答案是，他们只需要用原生 PHP 而非框架去构建他们的应用。但是很多人对此不知所措，不知道从哪儿开始入手。

<!-- So my goal with this is to provide an easy resource that people can be pointed to. In most cases a framework does not make sense and writing an application from scratch with the help of some third party packages is much, much easier than some people think. -->

因此我的目标是，提供一种可以给人们以指引的简单方法。在大多数情况下，框架没有意义，并且在一些第三方组件的帮助下，从头开始编写一个应用要比人们想象的要容易得多。

<!-- __This tutorial was written for PHP 7.0 or newer versions__. If you are using an older version, please upgrade it before you start. I recommend that you use the [current stable version](http://php.net/downloads.php). -->

__这个教程是为 PHP 7.0 或更高版本编写的__。如果你正在使用旧版本，请在开始操作之前升级它。我推荐你使用[当前的稳定版本](http://php.net/downloads.php)。

<!-- So let's get started right away with the first part. -->

那让我们立即开始第一部分。

---

<!-- ## Parts

## 目录

1. [Front Controller（前端控制器）](#1-front-controller)
2. [Composer（依赖管理器）](#2-composer)
3. [Error Handler（错误处理程序）](#3-error-handler)
4. [HTTP](#4-http)
5. [Router（路由）](#5-router)
6. [Dispatching to a Class（类的调度）](#6-dispatching-to-a-class)
7. [Inversion of Control（控制反转）](#7-inversion-of-control)
8. [Dependency Injector（依赖注入器）](#8-dependency-injector)
9. [Templating（模板）](#9-templating)
10. [Dynamic Pages（动态页面）](#10-dynamic-pages)
11. [Page Menu（页面菜单）](#11-pate-menu)
12. [Frontend（前端）](#12-frontend) -->

## 目录

1. [前端控制器](#1前端控制器)
2. [Composer](#2composer)
3. [错误处理程序](#3错误处理程序)
4. [HTTP](#4http)
5. [路由](#5路由)
6. [类的调度](#6类的调度)
7. [控制反转](#7控制反转)
8. [依赖注入器](#8依赖注入器)
9. [模板](#9模板)
10. [动态页面](#动态页面)
11. [页面菜单](#11页面菜单)
12. [前端](#12前端)

---

<!-- ### 1. Front Controller -->

### 1、前端控制器

<!-- A [front controller](http://en.wikipedia.org/wiki/Front_Controller_pattern) is a single point of entry for your application. -->

[前端控制器](http://en.wikipedia.org/wiki/Front_Controller_pattern)是你应用的一个单一入点。

<!-- To start, create an empty directory for your project. You also need an entry point where all requests will go to. This means you will have to create an `index.php` file. -->

首先，为你的项目创建一个空目录。你还需要一个入点，用来接收所有请求。这意味着你必须创建一个名为 `index.php` 的文件。

<!-- A common way to do this is to just put the `index.php` in the root folder of the projects. This is also how some frameworks do it. Let me explain why you should not do this. -->

通常做法是直接将 `index.php` 放到项目根目录中。有些框架也会这样做。让我来解释一下为什么你不应该这样做。

<!-- The `index.php` is the starting point, so it has to be inside the web server directory. This means that the web server has access to all subdirectories. If you set things up properly, you can still prevent it from accessing your subfolders where your application files are. -->

文件 `index.php` 是一个起点，因此它必须存在于 WEB 服务器的目录中。这意味着 WEB 服务器可以访问所有的子目录。如果你设置无误，还是能够阻止它访问应用程序文件所在子目录的。

<!-- But sometimes things don't go according to plan. And if something goes wrong and your files are set up as above, your whole application source code could be exposed to visitors. I won't have to explain why this is not a good thing. -->

但是有时事情并不按计划进行。如果出现某些问题，并且你的文件是按照之前所说那样创建的，那你的整个应用程序源代码就可能会暴露给访客。我不必解释为什么这不是一件好事。

<!-- So instead of doing that, create a folder in your project folder called `public`. This is a good time to create an `src` folder for your application, also in the project root folder. -->

所以替代做法是，在你的项目文件夹中再创建一个名为 `public` 的文件夹。同时也是为你的应用创建一个名为 `src` 的文件夹的好时机，同样放在项目的根目录。

<!-- Inside the `public` folder you can now create your `index.php`. Remember that you don't want to expose anything here, so put just the following code in there: -->

现在你可以在 `public` 文件夹中创建 `index.php` 了。要记得，你不想在此文件中暴露任何东西，因此只需在其中放入如下代码：

```php
<?php declare(strict_types = 1);

require __DIR__ . '/../src/Bootstrap.php';
```

<!-- `__DIR__` is a [magic constant](http://php.net/manual/en/language.constants.predefined.php) that contains the path of the directory. By using it, you can make sure that the `require` always uses the same relative path to the file it is used in. Otherwise, if you call the `index.php` from a different folder it will not find the file. -->

`__DIR__` 是一个“[**魔术常量**](https://www.php.net/manual/zh/language.constants.predefined.php)”含有文件夹路径。利用它，你可以确保 `require` 始终使用相同的相对路径关联所用文件。否则，如果你从另一个文件夹调用 `index.php`，它将无法找到该文件。

<!-- `declare(strict_types = 1);` sets the current file to [strict typing](http://php.net/manual/en/functions.arguments.php#functions.arguments.type-declaration.strict). In this tutorial we are going to use this for all PHP files. This means that you can't just pass an integer as a parameter to a method that requires a string. If you don't use strict mode, it would be automatically casted to the required type. With strict mode, it will throw an Exception if it is the wrong type. -->

`declare(strict_types = 1);` 设定当前文件为 [严格类型](https://www.php.net/manual/zh/functions.arguments.php#functions.arguments.type-declaration.strict)。在本教程中，我们将在所有 PHP 文件中使用它。这意味着你不能硬把一个整数作为参数传给需要字符串的方法。如果你不使用严格模式，它会自动转换成所需类型。而使用严格模式，如果它是错误类型将会抛出异常（Exception）。

<!-- The `Bootstrap.php` will be the file that wires your application together. We will get to it shortly. -->

`Bootstrap.php` 将会是一个把你的应用联结在一起的文件。我们很快就会谈到它。

<!-- The rest of the public folder is reserved for your public asset files (like JavaScript files and stylesheets). -->

公共文件夹 `public` 的其余部分留作存放公共资源文件之用（如 Javascript 文件和样式表文件）。

<!-- Now navigate inside your `src` folder and create a new `Bootstrap.php` file with the following content: -->

现在进入你的 `src` 文件夹并创建一个含有如下内容的名为 `Bootstrap.php` 的新文件：

```php
<?php declare(strict_types = 1);

echo 'Hello World!';
```

<!-- Now let's see if everything is set up correctly. Open up a console and navigate into your projects `public` folder. In there type `php -S localhost:8000` and press enter. This will start the built-in webserver and you can access your page in a browser with `http://localhost:8000`. You should now see the 'hello world' message. -->

现在让我们看看是否所有都设置正确。打开一个控制台并定位到项目的 `public` 文件夹。然后输入 `php -S localhost:8000` 并回车。这将会启动 PHP 内置的 WEB 服务器，你可以通过在浏览器中输入 `http://localhost:8000` 来访问你的页面。你现在应该可以看到“Hello World!”消息。

<!-- If there is an error, go back and try to fix it. If you only see a blank page, check the console window where the server is running for errors. -->

如果出现了错误，回过头并尝试解决它。如果你只看到空白页面，请检查运行服务器的控制台窗口是否有错误。

<!-- Now would be a good time to commit your progress. If you are not already using Git, set up a repository now. This is not a Git tutorial so I won't go over the details. But using version control should be a habit, even if it is just for a tutorial project like this. -->

现在是时候提交你的进度了。如果你没有准备好使用 Git，那现在就创建一个存储库。这不是一个 Git 教程，所以我不会详细介绍。不过使用版本控制应该是一个习惯，即便只是这样一个教程项目。

<!-- Some editors and IDE's put their own files into your project folders. If that is the case, create a `.gitignore` file in your project root and exclude the files/directories. Below is an example for PHPStorm: -->

有些编辑器和 IDE 会把它们的私有文件放入你的项目文件夹中。如果是这样的话，在你的项目根目录下创建一个 `.gitignre` 文件以排除这些文件或文件夹。下面是一个 PHPStorm 的例子：

```
.idea/
```

---

<!-- ### 2. Composer -->

### 2、Composer

<!-- [Composer](https://getcomposer.org/) is a dependency manager for PHP. -->

[Composer](https://getcomposer.org/) 是一个 PHP 依赖管理器。

<!-- Just because you are not using a framework does not mean you will have to reinvent the wheel every time you want to do something. With Composer, you can install third-party libraries for your application. -->

你不使用某个框架，并不意味着当你想做某事时都必须重新发明轮子。通过 Composer，你可以为应用安装第三方库。

<!-- If you don't have Composer installed already, head over to the website and install it. You can find Composer packages for your project on [Packagist](https://packagist.org/). -->

如果你尚未安装 Composer，去访问网站并安装它。你可以去 [Packagist](https://packagist.org/) 为你的项目寻找 Composer 包。

<!-- Create a new file in your project root folder called `composer.json`. This is the Composer configuration file that will be used to configure your project and its dependencies. It must be valid JSON or Composer will fail. -->

在你的项目根文件夹下创建一个新的文件，名为 `composer.json`。这个 Composer 配置文件会被用来配置你的项目及其依赖项。它必须是一个有效的 JSON 格式，否则 Composer 将会出错。

<!-- Add the following content to the file: -->

将如下内容添加到这个配置文件中：

```json
{
    "name": "Project name",
    "description": "Your project description",
    "keywords": ["Your keyword", "Another keyword"],
    "license": "MIT",
    "authors": [
        {
            "name": "Your Name",
            "email": "your@email.com",
            "role": "Creator / Main Developer"
        }
    ],
    "require": {
        "php": ">=7.0.0"
    },
    "autoload": {
        "psr-4": {
            "Example\\": "src/"
        }
    }
}
```

<!-- In the autoload part you can see that I am using the `Example` namespace for the project. You can use whatever fits your project there, but from now on I will always use the `Example` namespace in my examples. Just replace it with your namespace in your own code. -->

在 `autoload` 部分，你可以看到我正在为项目使用 `Example` 命名空间。你可以使用适合你项目的任何名称，但是从现在开始我会始终在示例中使用 `Example` 命名空间。你只需在自己的代码中用你的命名空间替换它。

<!-- Open a new console window and navigate into your project root folder. There run `composer update`. -->

打开一个新的控制台窗口并定位到你项目根文件夹。然后运行 `composer update`.

<!-- Composer creates a `composer.lock` file that locks in your dependencies and a vendor directory. -->

Composer 创建了一个用来锁定你所用依赖项的 `composer.lock` 文件以及 `vendor` 文件夹。

<!-- Committing the `composer.lock` file into version control is generally good practice for projects. It allows continuation testing tools (such as [Travis CI](https://travis-ci.org/)) to run the tests against the exact same versions of libraries that you're developing against. It also allows all people who are working on the project to use the exact same version of libraries i.e. it eliminates a source of "works on my machine" problems. -->

把 `composer.lock` 提交到版本控制中是项目的通用良好实践。它允许持续测试工具（譬如 [Travis CI](https://travis-ci.org/)）针对你正在开发的版本完全相同的库运行测试。它还允许项目的其它人使用版本完全相同的库，即它可以从源头消除“在我的机器上工作”问题。

<!-- That being said, [you don't want to put the actual source code of your dependencies in your git repository](https://getcomposer.org/doc/faqs/should-i-commit-the-dependencies-in-my-vendor-directory.md). So let's add a rule to our `.gitignore` file: -->

话虽如此，[你并不希望把所有依赖项的实际源代码都放到 Git 存储库中](https://getcomposer.org/doc/faqs/should-i-commit-the-dependencies-in-my-vendor-directory.md)。所以让我们在 `.gitignore` 文件中添加一条规则：

```
vendor/
```

<!-- Now you have successfully created an empty playground which you can use to set up your project. -->

现在你成功为所创建的项目打下了基础。

---

<!-- ### 3. Error Handler -->

### 3、错误处理程序

<!-- An error handler allows you to customize what happens if your code results in an error. -->

错误处理程序允许你在代码出错时自定义产生的结果。

<!-- A nice error page with a lot of information for debugging goes a long way during development. So the first package for your application will take care of that. -->

一个承载大量调试信息的详尽错误页面在开发期间大有帮助。因此你应用的第一个包将解决此事。

<!-- I like [filp/whoops](https://github.com/filp/whoops), so I will show how you can install that package for your project. If you prefer another package, feel free to install that one. This is the beauty of programming without a framework, you have total control over your project. -->

我喜欢 [filp/whoops](https://github.com/filp/whoops)，所以我将展示如何为你的项目安装该软件包。如果你更喜欢其它包，随意安装哪个。这是脱离框架的编程之美，你可以完全掌控项目。

<!-- An alternative package would be: [PHP-Error](https://github.com/JosephLenton/PHP-Error) -->

另一款替代软件包是：[PHP-Error](https://github.com/JosephLenton/PHP-Error)

<!-- To install a new package, open up your `composer.json` and add the package to the require part. It should now look like this: -->

要安装一个新软件包，打开 `composer.json` 并把软件包添加到 `require` 部分。它现在应该是这样：

```php
"require": {
    "php": ">=7.0.0",
    "filp/whoops": "~2.1"
},
```

<!-- Now run `composer update` in your console and it will be installed. -->

现在在你的控制台上执行 `composer update`，软件包就会被安装。

> \* 译者注：安装新软件时也可以直接使用命令 `composer require "filp/whoops:~2.1"`。

<!-- But you can't use it yet. PHP won't know where to find the files for the classes. For this you will need an autoloader, ideally a [PSR-4](http://www.php-fig.org/psr/psr-4/) autoloader. Composer already takes care of this for you, so you only have to add a `require __DIR__ . '/../vendor/autoload.php';` to your `Bootstrap.php`. -->

但是你还不能立刻使用它。PHP 不知道去哪里找到这个类的文件。为此你需要一个自动加载器，理想选择是 [PSR-4](http://www.php-fig.org/psr/psr-4/) 自动加载器。Composer 已经为你解决了这个问题，所以你只需要在 `Bootstrap.php` 中添加一行 `require __DIR__ . '/../vendor/autoload.php';` 即可。

<!-- **Important:** Never show any errors in your production environment. A stack trace or even just a simple error message can help someone to gain access to your system. Always show a user friendly error page instead and send an email to yourself, write to a log or something similar. So only you can see the errors in the production environment. -->

**重要提示：** 永远不要在生产环境中显示任何错误信息。一份堆栈追踪或者甚至只是一条简单的错误信息都可以帮助某些人访问你的系统。取而代之的是，始终显示一个用户友好的错误页面，然后向你自己发送一份邮件、写入日志或其它类似的方式。这样，只有你才可以在生产环境中看到这些错误信息。

<!-- For development that does not make sense though -- you want a nice error page. The solution is to have an environment switch in your code. For now you can just set it to `development`. -->

但是在开发环境下这没有意义——你想要一个详尽的错误页面。解决方法是在代码中进行环境切换。当前你可以将其设置为 `development`。

<!-- Then after the error handler registration, throw an `Exception` to test if everything is working correctly. Your `Bootstrap.php` should now look similar to this: -->

接下来，当错误处理程序注册后，抛出一个 `Exception` 来测试是否一切工作正常。你的 `Bootstrap.php` 文件内容现在看起来如下所示：

```php
<?php declare(strict_types = 1);

namespace Example;

require __DIR__ . '/../vendor/autoload.php';

error_reporting(E_ALL);

$environment = 'development';

/**
* Register the error handler
*/
$whoops = new \Whoops\Run;
if ($environment !== 'production') {
    $whoops->pushHandler(new \Whoops\Handler\PrettyPageHandler);
} else {
    $whoops->pushHandler(function($e){
        echo 'Todo: Friendly error page and send an email to the developer';
    });
}
$whoops->register();

throw new \Exception;

```

<!-- You should now see a error page with the line highlighted where you throw the exception. If not, go back and debug until you get it working. Now would also be a good time for another commit. -->

你现在应该可以看到一个错误页面，突出显示了抛出异常的代码行。如果没有，回过头调试，直到它能如期运行。现在也是再次提交代码的好时机。

---

<!-- ### 4. HTTP -->

### 4、HTTP

<!-- PHP already has a few things built in to make working with HTTP easier. For example there are the [superglobals](http://php.net/manual/en/language.variables.superglobals.php) that contain the request information. -->

PHP 已经内置了几种方法，可以更轻松地使用 HTTP。比如“[超全局变量](http://php.net/manual/zh/language.variables.superglobals.php)”就包含了一些请求信息。

<!-- These are good if you just want to get a small script up and running, something that won't be hard to maintain. However, if you want to write clean, maintainable, [SOLID](http://en.wikipedia.org/wiki/SOLID_%28object-oriented_design%29) code, then you will want a class with a nice object-oriented interface that you can use in your application instead. -->

如果你只是想运行一个小型脚本这足够用，它们也不难维护。不过，如果你想要编写整洁、可维护且遵循 [SOLID](http://en.wikipedia.org/wiki/SOLID_%28object-oriented_design%29) 原则的代码，你将需要一个具有良好的面向对象接口的类，你可以在应用中使用它。

<!-- Once again, you don't have to reinvent the wheel and just install a package. I decided to write my own [HTTP component](https://github.com/PatrickLouys/http) because I did not like the existing components, but you don't have to do the same. -->

再说一遍，你不必重新发明轮子，只需要安装一个包。我决定使用我自己写的 [HTTP 组件](https://github.com/PatrickLouys/http)，因为我不喜欢现有的一些组件，但是你不不必这样做。

<!-- Some alternatives: [Symfony HttpFoundation](https://github.com/symfony/HttpFoundation), [Nette HTTP Component](https://github.com/nette/http), [Aura Web](https://github.com/auraphp/Aura.Web), [sabre/http](https://github.com/fruux/sabre-http) -->

其它替代方案：[Symfony HttpFoundation](https://github.com/symfony/HttpFoundation)、[Nette HTTP Component](https://github.com/nette/http)、[Aura Web](https://github.com/auraphp/Aura.Web)、[sabre/http](https://github.com/fruux/sabre-http)。

<!-- In this tutorial I will use my own HTTP component, but of course you can use any package that you like. You just have to adapt the code from the tutorial yourself. -->

在这个教程中我将会使用我自己编写的 HTTP 组件，但是毫无疑问你可以使用任何你喜欢的包。你只需自己调整教程中代码即可。

<!-- Again, edit the `composer.json` to add the new component and then run `composer update`: -->

再一次编辑 `composer.json` 文件添加新组件，然后运行 `composer update` 命令：

```json
  "require": {
    "php": ">=7.0.0",
    "filp/whoops": "~2.1",
    "patricklouys/http": "~1.4"
  },
```

<!-- Now you can add the following below your error handler code in your `Bootstrap.php` (and don't forget to remove the exception): -->

现在你可以在 `Bootstrap.php` 文件的错误处理程序代码下方添加以下代码（不要忘了移除之前故意抛出异常的代码）：

```php
$request = new \Http\HttpRequest($_GET, $_POST, $_COOKIE, $_FILES, $_SERVER);
$response = new \Http\HttpResponse;
```

<!-- This sets up the `Request` and `Response` objects that you can use in your other classes to get request data and send a response back to the browser. -->

这些设置让你能在别的类中使用 `Request` 和 `Response` 对象，以获取请求数据并向浏览器发送响应。

<!-- To actually send something back, you will also need to add the following snippet at the end of your `Bootstrap.php` file: -->

要实际发回一些东西，你还需要在 `Bootstrap.php` 文件末尾添加以下代码片段：

```php
foreach ($response->getHeaders() as $header) {
    header($header, false);
}

echo $response->getContent();
```

<!-- This will send the response data to the browser. If you don't do this, nothing happens as the `Response` object only stores data. This is handled differently by most other HTTP components where the classes send data back to the browser as a side-effect, so keep that in mind if you use another component. -->

这些代码会把响应数据发送到浏览器。如果不这么做，就不会有任何反应，因为 `Response` 对象仅存储数据。而其它大多数 HTTP 组件会用不同的方式处理，类会把数据作为副作用发送回浏览器，如果你使用其它组件要记得这一点。

<!-- The second parameter of `header()` is false because otherwise existing headers will be overwritten. -->

函数 `header()` 的第二个参数是 `false`，不然已存在的消息头将会被覆盖。

<!-- Right now it is just sending an empty response back to the browser with the status code `200`; to change that, add the following code between the code snippets from above (just on top of the `foreach` statement): -->

现在它只是给浏览器返回了一个状态码为 `200` 的空响应；改变这点，要在之前的代码片段之中（就是指 `foreach` 语句上方）添加以下代码：

```php
$content = '<h1>Hello World</h1>';
$response->setContent($content);
```

<!-- If you want to try a 404 error, use the following code: -->

如果你想要尝试 404 错误，则使用以下代码：

```php
$response->setContent('404 - Page not found');
$response->setStatusCode(404);
```

<!-- Remember that the object is only storing data, so if you set multiple status codes before you send the response, only the last one will be applied. -->

要记住，响应对象只会存储数据，所以如果你在发送响应前设置了多个状态码，则只有最后一个会生效。

<!-- I will show you in later parts how to use the different features of the components. In the meantime, feel free to read the [documentation](https://github.com/PatrickLouys/http) or the source code if you want to find out how something works. -->

我会在后面的部分向你展示如何使用组件的不同功能。在此期间，如果你想要了解某些工作原理，可随意阅读“[文档](https://github.com/PatrickLouys/http)”或者源代码。

---

<!-- ### 5. Router -->

### 5、路由

<!-- A router dispatches to different handlers depending on rules that you have set up. -->

路由依靠你设置的规则分派到不同的处理程序。

<!-- With your current setup it does not matter what URL is used to access the application, it will always result in the same response. So let's fix that now. -->

根据你目前的设置，无所谓使用什么 URL 访问应用，它都会返回相同的响应结果。因此让我们来解决这个问题。

<!-- I will use [FastRoute](https://github.com/nikic/FastRoute) in this tutorial. But as always, you can pick your own favorite package. -->

在这个教程中我将使用 [FastRoute](https://github.com/nikic/FastRoute)。但是与以往一样，你可以选择你喜欢的包。

<!-- Alternative packages: [symfony/Routing](https://github.com/symfony/Routing), [Aura.Router](https://github.com/auraphp/Aura.Router), [fuelphp/routing](https://github.com/fuelphp/routing), [Klein](https://github.com/chriso/klein.php) -->

一些替代软件包：[symfony/Routing](https://github.com/symfony/Routing), [Aura.Router](https://github.com/auraphp/Aura.Router), [fuelphp/routing](https://github.com/fuelphp/routing), [Klein](https://github.com/chriso/klein.php)。

<!-- By now you know how to install Composer packages, so I will leave that to you. -->

现在你知道如何使用 Composer 安装软件包了，所以我会留给你自行操作。

<!-- Now add this code block to your `Bootstrap.php` file where you added the 'hello world' message in the last chapter. -->

现在添加这些代码块到你的 `Bootstrap.php` 文件中，要添加到上一章中显示 `Hello World` 消息代码的下方。

```php
$dispatcher = \FastRoute\simpleDispatcher(function (\FastRoute\RouteCollector $r) {
    $r->addRoute('GET', '/hello-world', function () {
        echo 'Hello World';
    });
    $r->addRoute('GET', '/another-route', function () {
        echo 'This works too';
    });
});

$routeInfo = $dispatcher->dispatch($request->getMethod(), $request->getPath());
switch ($routeInfo[0]) {
    case \FastRoute\Dispatcher::NOT_FOUND:
        $response->setContent('404 - Page not found');
        $response->setStatusCode(404);
        break;
    case \FastRoute\Dispatcher::METHOD_NOT_ALLOWED:
        $response->setContent('405 - Method not allowed');
        $response->setStatusCode(405);
        break;
    case \FastRoute\Dispatcher::FOUND:
        $handler = $routeInfo[1];
        $vars = $routeInfo[2];
        call_user_func($handler, $vars);
        break;
}
```

<!-- In the first part of the code, you are registering the available routes for your application. In the second part, the dispatcher gets called and the appropriate part of the switch statement will be executed. If a route was found, the handler callable will be executed. -->

在代码的第一部分，你为应用注册了一个可用的路由。在代码的第二部分，调度器被调用，并执行了 `switch` 语句中合适的部分。

<!-- This setup might work for really small applications, but once you start adding a few routes your bootstrap file will quickly get cluttered. So let's move them out into a separate file. -->

对于非常小的应用这样组织没问题，但是一旦你开始添加几条路由，你的 `Bootstrap.php` 文件将很快变得杂乱无章。所以让我们将这些代码移动到一个单独的文件。

<!-- Create a `Routes.php` file in the `src/` folder. It should look like this: -->

在 `src/` 文件夹中创建一个名为 `Routes.php` 的文件。它应该如下所示：

```php
<?php declare(strict_types = 1);

return [
    ['GET', '/hello-world', function () {
        echo 'Hello World';
    }],
    ['GET', '/another-route', function () {
        echo 'This works too';
    }],
];
```

<!-- Now let's rewrite the route dispatcher part to use the `Routes.php` file. -->

现在让我们利用 `Routes.php` 文件重写路由调度器部分。

```php
$routeDefinitionCallback = function (\FastRoute\RouteCollector $r) {
    $routes = include 'Routes.php';
    foreach ($routes as $route) {
        $r->addRoute($route[0], $route[1], $route[2]);
    }
};

$dispatcher = \FastRoute\simpleDispatcher($routeDefinitionCallback);
```

<!-- This is already an improvement, but now all the handler code is in the `Routes.php` file. This is not optimal, so let's fix that in the next part. -->

这已经是一个改进，但是现在所有的处理程序代码都在 `Routes.php` 文件里。这并不是最好做法，所以让我们在下一部分中解决它。

<!-- Don't forget to commit your changes at the end of each chapter. -->

不要忘了在每一章最后提交你的改动。

---

<!-- ### 6. Dispatching to a Class -->

### 6、类的调度

<!-- In this tutorial we won't implement [MVC (Model-View-Controller)](http://martinfowler.com/eaaCatalog/modelViewController.html). MVC can't be implemented properly in PHP anyway, at least not in the way it was originally conceived. If you want to learn more about this, read [A Beginner's Guide To MVC](http://blog.ircmaxell.com/2014/11/a-beginners-guide-to-mvc-for-web.html) and the followup posts. -->

在本教程中我们不会采用“[MVC (Model-View-Controller)](http://martinfowler.com/eaaCatalog/modelViewController.html)”。MVC 在 PHP 中无论如何都无法正确实现，至少不是最初设想的方式。如果你想了解更多相关信息，可阅读“[A Beginner's Guide To MVC](http://blog.ircmaxell.com/2014/11/a-beginners-guide-to-mvc-for-web.html)”（[译文](/archives/a-beginners-guide-to-mvc-for-the-web.html)）以及后续的文章。

<!-- So forget about MVC and instead let's worry about [separation of concerns](http://en.wikipedia.org/wiki/Separation_of_concerns). -->

所以忘掉 MVC，然后让我们来关心“[关注点分离（separation of concerns）](https://zh.wikipedia.org/wiki/%E5%85%B3%E6%B3%A8%E7%82%B9%E5%88%86%E7%A6%BB)”。

<!-- We will need a descriptive name for the classes that handle the requests. For this tutorial I will use `Controllers` because that will be familiar for the people coming from a framework background. You could also name them `Handlers`. -->

我们需要为处理请求的类起一个描述性名称。在这个教程中我将使用 `Controllers`，因为它对有框架背景的人来说更亲切。你也可以将其命名为 `Handlers`。

<!-- Create a new folder inside the `src/` folder with the name `Controllers`.In this folder we will place all our controller classes. In there, create a `Homepage.php` file. -->

在 `src/` 文件夹中创建一个名为 `Controller` 的新文件夹。在这个文件夹中我们将存放所有控制器类。在那里，创建一个名为 `Homepage.php` 文件。

```php
<?php declare(strict_types = 1);

namespace Example\Controllers;

class Homepage
{
    public function show()
    {
        echo 'Hello World';
    }
}
```

<!-- The autoloader will only work if the namespace of a class matches the file path and the file name equals the class name. At the beginning I defined `Example` as the root namespace of the application so this is referring to the `src/` folder. -->

只有在类的命名空间与文件路径相匹配，并且文件名等于类名的情况下，自动加载器才会正常工作。

<!-- Now let's change the hello world route so that it calls your new class method instead of the closure. Change your `Routes.php` to this: -->

现在让我们改进 hello world 路由，以便它调用你新写的类方法而不是闭包。将你的 `Routes.php` 代码改成如下所示：

```php
return [
    ['GET', '/', ['Example\Controllers\Homepage', 'show']],
];
```

<!-- Instead of just a callable you are now passing an array. The first value is the fully namespaced classname, the second one the method name that you want to call. -->

你现在正在传递一个数组，而不只是调用一个函数。第一个值是类名完整的命名空间，第二个值是你想要调用的方法名。

<!-- To make this work, you will also have to do a small refactor to the routing part of the `Bootstrap.php`: -->

想要让其正常运行，你还必须微调一下 `Bootstrap.php` 中的路由部分。

```php
case \FastRoute\Dispatcher::FOUND:
    $className = $routeInfo[1][0];
    $method = $routeInfo[1][1];
    $vars = $routeInfo[2];

    $class = new $className;
    $class->$method($vars);
    break;
```

<!-- So instead of just calling a method you are now instantiating an object and then calling the method on it. -->

如此，现在你实例化了一个对象并在其上调用方法，而不只是仅仅调用一个方法。

<!-- Now if you visit `http://localhost:8000/` everything should work. If not, go back and debug. And of course don't forget to commit your changes. -->

现在，如果你访问 `http://localhost:8000/`，一些都应当正常运行。如果没有，回过头去调试。当然不要忘记提交你的改动。

---

<!-- ### 7. Inversion of Control -->

### 7、控制反转

<!-- In the last part you have set up a controller class and generated output with `echo`. But let's not forget that we have a nice object oriented HTTP abstraction available. But right now it's not accessible inside your class. -->

在上一部分，你创建了一个控制器类，然后使用 `echo` 生成输出。但是不要忘了我们还有个好用的面向对象 HTTP 抽象。但是现在它在你编写的类中还不能使用。

<!-- The sane option is to use [inversion of control](http://en.wikipedia.org/wiki/Inversion_of_control). This means that instead of giving the class the responsiblity of creating the object it needs, you just ask for them. This is done with [dependency injection](http://en.wikipedia.org/wiki/Dependency_injection). -->

使用“[控制反转（inversion of control）](https://zh.wikipedia.org/wiki/%E6%8E%A7%E5%88%B6%E5%8F%8D%E8%BD%AC)”是明智的选择。这意味着，你只需要向类请求所需要的对象，而不是让类负责去创建。这些工作由“依赖注入”完成。

<!-- If this sounds a little complicated right now, don't worry. Just follow the tutorial and once you see how it is implemented, it will make sense. -->

如果现在感觉有点儿复杂，不要担心。只需要跟着教程走，一旦你知道它是如何实现的，就会理解了。

<!-- Change your `Homepage` controller to the following: -->

更改你的 `Homepage.php` 控制器的代码如下：

```php
<?php declare(strict_types = 1);

namespace Example\Controllers;

use Http\Response;

class Homepage
{
    private $response;

    public function __construct(Response $response)
    {
        $this->response = $response;
    }

    public function show()
    {
        $this->response->setContent('Hello World');
    }
}
```

<!-- Note that we are [importing](http://php.net/manual/en/language.namespaces.importing.php) `Http\Response` at the top of the file. This means that whenever you use `Response` inside this file, it will resolve to the fully qualified name. -->

注意我们在文件顶部“[导入（importing）](http://php.net/manual/zh/language.namespaces.importing.php)”了 `Http\Response`。这意味着你无论何时在这个文件中使用 `Response`，它都会将其解析为[完全限定名（fully qualified name）](https://en.wikipedia.org/wiki/Fully_qualified_name)。

<!-- In the constructor we are now explicitly asking for a `Http\Response`. In this case, `Http\Response` is an interface. So any class that implements the interface can be injected. See [type hinting](http://php.net/manual/en/language.oop5.typehinting.php) and [interfaces](http://php.net/manual/en/language.oop5.interfaces.php) for reference. -->

在构造函数中，我们现在明确的请求了 `Http\Response`。在这种情况下，`Http\Response` 是一个接口（interface）。因此任何实现接口的类都会被注入。请查看 [类型提示（type hinting）](http://php.net/manual/zh/language.oop5.typehinting.php) 和 [接口（interfaces）](http://php.net/manual/zh/language.oop5.interfaces.php) 以供参考。

<!-- Now the code will result in an error because we are not actually injecting anything. So let's fix that in the `Bootstrap.php` where we dispatch when a route was found: -->

现在代码会导致出错，因为我们还没有注入任何东西。所以让我们在 `Bootstrap.php` 文件中处理这个问题，我们在发现路由时进行分派：

```php
$class = new $className($response);
$class->$method($vars);
```

<!-- The `Http\HttpResponse` object implements the `Http\Response` interface, so it fulfills the contract and can be used. -->

`Http\HttpResponse` 对象实现了 `Http\Response` 接口，所以它符合约定并可以被使用。

<!-- Now everything should work again. But if you follow this example, all your objects that are instantiated this way will have the same objects injected. This is of course not good, so let's fix that in the next part. -->

现在所有一切应该能再次正常运行了。但是如果你遵循这个例子，所有你按照这种方式实例化的对象将会被注入同样的对象。这当然不好，所以让我们在下一部分来解决这个问题。

---

<!-- ### 8. Dependency Injector -->

### 8、依赖注入器

<!-- A dependency injector resolves the dependencies of your class and makes sure that the correct objects are injected when the class is instantiated. -->

依赖注入器解析你所编写类的依赖关系，并确保当类被实例化时注入正确的对象

<!-- There is only one injector that I can recommend: [Auryn](https://github.com/rdlowrey/Auryn). Sadly all the alternatives that I am aware of are using the [service locator antipattern](http://blog.ploeh.dk/2010/02/03/ServiceLocatorisanAnti-Pattern/) in their documentation and examples. -->

我只能推荐一款注入器：[Auryn](https://github.com/rdlowrey/Auryn)。遗憾的是，所有我所知道的替代品都在他们的文档和示例中使用了“[服务器定位反模式（service locator antipattern）](http://blog.ploeh.dk/2010/02/03/ServiceLocatorisanAnti-Pattern/)”。

<!-- Install the Auryn package and then create a new file called `Dependencies.php` in your `src/` folder. In there add the following content: -->

安装 Auryn 包并在 `src/` 文件夹中创建一个名为 `Dependencies.php` 的文件。然后添加以下内容：

```php
<?php declare(strict_types = 1);

$injector = new \Auryn\Injector;

$injector->alias('Http\Request', 'Http\HttpRequest');
$injector->share('Http\HttpRequest');
$injector->define('Http\HttpRequest', [
    ':get' => $_GET,
    ':post' => $_POST,
    ':cookies' => $_COOKIE,
    ':files' => $_FILES,
    ':server' => $_SERVER,
]);

$injector->alias('Http\Response', 'Http\HttpResponse');
$injector->share('Http\HttpResponse');

return $injector;
```

<!-- Make sure you understand what `alias`, `share` and `define` are doing before you continue. You can read about them in the [Auryn documentation](https://github.com/rdlowrey/Auryn). -->

在继续之前，请确保你已理解 `alias`、`share` 以及 `define` 正在做什么。你可以通过 [Auryn 文档](https://github.com/rdlowrey/Auryn)阅读与之相关的信息。

<!-- You are sharing the HTTP objects because there would not be much point in adding content to one object and then returning another one. So by sharing it you always get the same instance. -->

之所以共享 HTTP 对象，是因为向一个对象添加内容然后再返回另外一个对象没有多大意义。因此，通过共享它，您始终可以获取相同的实例。

<!-- The alias allows you to type hint the interface instead of the class name. This makes it easy to switch the implementation without having to go back and edit all your classes that use the old implementation. -->

别名（alias）允许你使用类型提示接口而不是类名。这使得切换实现非常容易，不必回过头修改所有使用旧实现的类。

<!-- Of course your `Bootstrap.php` will also need to be changed. Before you were setting up `$request` and `$response` with `new` calls. Switch that to the injector now so that we are using the same instance of those objects everywhere. -->

当然你的 `Bootstrap.php` 也需要改动。在你使用 `new` 调用设置 `$request` 和 `$response` 之前。现在将其切换到注入器，以便我们在任何地方使用这些对象的相同实例。

```php
$injector = include 'Dependencies.php';

$request = $injector->make('Http\HttpRequest');
$response = $injector->make('Http\HttpResponse');
```

<!-- The other part that has to be changed is the dispatching of the route. Before you had the following code: -->

其他必须改动的部分是路由的调度。之前你的代码如下所示：

```php
$class = new $className($response);
$class->$method($vars);
```

<!-- Change that to the following: -->

现在将其改成如下所示代码：

```php
$class = $injector->make($className);
$class->$method($vars);
```

<!-- Now all your controller constructor dependencies will be automatically resolved with Auryn. -->

现在所有的控制器构造函数依赖项都将自动被 Auryn 解析。

<!-- Go back to your `Homepage` controller and change it to the following: -->

回到你的 `Homepage.php` 控制器，然后将其更改如下：

```php
<?php declare(strict_types = 1);

namespace Example\Controllers;

use Http\Request;
use Http\Response;

class Homepage
{
    private $request;
    private $response;

    public function __construct(Request $request, Response $response)
    {
        $this->request = $request;
        $this->response = $response;
    }

    public function show()
    {
        $content = '<h1>Hello World</h1>';
        $content .= 'Hello ' . $this->request->getParameter('name', 'stranger');
        $this->response->setContent($content);
    }
}
```

<!-- As you can see now the class has two dependencies. Try to access the page with a GET parameter like this `http://localhost:8000/?name=Arthur%20Dent`. -->

正如你所看到的，现在类有两个依赖。试一试使用带参数的 GET 方法访问这个页面，像这样：`http://localhost:8000/?name=Arthur%20Dent`。

<!-- Congratulations, you have now successfully laid the groundwork for your application. -->

恭喜，你现在成功的为你的应用奠定了基础。

---

<!-- ### 9. Templating -->

### 9、模板

<!-- A template engine is not necessary with PHP because the language itself can take care of that. But it can make things like escaping values easier. They also make it easier to draw a clear line between your application logic and the template files which should only put your variables into the HTML code. -->

对于 PHP 来说模板引擎不是必须的，因为语言本身就可以搞定。但是模板可以让类似值转义这些事情变得更容易。

<!-- A good quick read on this is [ircmaxell on templating](http://blog.ircmaxell.com/2012/12/on-templating.html). Please also read [this](http://chadminick.com/articles/simple-php-template-engine.html) for a different opinion on the topic. Personally I don't have a strong opinion on the topic, so decide yourself which approach works better for you. -->

关于这点可以阅读 ircmaxell 的文章 “[论模板](/archives/on-templating)（[On Templating](http://blog.ircmaxell.com/2012/12/on-templating.html)）” 快速了解。也请读一下[这篇文章](/archives/simple-php-template-engine)（[Simple PHP Template Engine](http://chadminick.com/articles/simple-php-template-engine.html)），关于这个主题的不同观点。我对这一主题没有强烈的观点，所以哪种方法对你来说效果更好，由你自己决定。

<!-- For this tutorial we will use a PHP implementation of [Mustache](https://github.com/bobthecow/mustache.php). So install that package before you continue (`composer require mustache/mustache`). -->

在这篇教程中，我们将使用 [Mustache](https://github.com/bobthecow/mustache.php) 的PHP 实现。所以在继续之前先安装那个包（`composer require mustache/mustache`）。

<!-- Another well known alternative would be [Twig](http://twig.sensiolabs.org/). -->

另一个知名的替代品是 [Twig](http://twig.sensiolabs.org/)。

<!-- Now please go and have a look at the source code of the [engine class](https://github.com/bobthecow/mustache.php/blob/master/src/Mustache/Engine.php). As you can see, the class does not implement an interface. -->

现在去看一看 [Engine](https://github.com/bobthecow/mustache.php/blob/master/src/Mustache/Engine.php) 类的源代码。你可以看到，该类没有实现接口。

<!-- You could just type hint against the concrete class. But the problem with this approach is that you create tight coupling. -->

你可以只针对具体的类使用类型提示。但是这种方式的问题是会导致你创建紧耦合。

<!-- In other words, all your code that uses the engine will be coupled to this mustache package. If you want to change the implementation you have a problem. Maybe you want to switch to Twig, maybe you want to write your own class or you want to add functionality to the engine. You can't do that without going back and changing all your code that is tightly coupled. -->

换句话说，你所用的 Engine 代码会和 Mustache 包耦合在一起。如果你想要改变实现就会遇到问题。可能你想要切换到 Twig，可能你想要编写你自己的类，也可能你想要为 Engine 添加功能。这是不可能的，除非回过头改动所有紧耦合的代码。

<!-- What we want is loose coupling. We will type hint against an interface and not a class/implementation. So if you need another implementation, you just implement that interface in your new class and inject the new class instead. -->

我们想要松耦合。我们将针对接口使用类型提示，而不是类或实现。所以如果你需要另一个实现，你只需要在你的新类中实现那个接口，然后注入新类。

<!-- Instead of editing the code of the package we will use the [adapter pattern](http://en.wikipedia.org/wiki/Adapter_pattern). This sounds a lot more complicated than it is, so just follow along. -->

我们将会使用“[适配器模式](https://zh.wikipedia.org/wiki/%E9%80%82%E9%85%8D%E5%99%A8%E6%A8%A1%E5%BC%8F)”，而不是编辑包的代码。这听起来比实际上复杂得多，所以只需要照做。

<!-- First let's define the interface that we want. Remember the [interface segregation principle](http://en.wikipedia.org/wiki/Interface_segregation_principle). This means that instead of large interfaces with a lot of methods we want to make each interface as small as possible. A class can extend multiple interfaces if necessary. -->

首先让我们定义我们想要的接口。记住“[接口隔离原则](https://zh.wikipedia.org/wiki/%E6%8E%A5%E5%8F%A3%E9%9A%94%E7%A6%BB%E5%8E%9F%E5%88%99)”。这意味着我们希望使每个接口尽可能小，而不是拥有大量方法的大型接口。如果有必要，一个类可以扩展多个接口。

<!-- So what does our template engine actually need to do? For now we really just need a simple `render` method. Create a new folder in your `src/` folder with the name `Template` where you can put all the template related things. -->

那么我们的模版引擎实际上需要做什么呢？现在我们其实只需要一个简单的 `render` 方法。在你的 `src/` 文件夹中创建一个名为 `Template` 的新文件夹，你可以把所有模板相关的文件都放在这里面。

<!-- In there create a new interface `Renderer.php` that looks like this: -->

在其中创建一个新的接口 `Renderer.php`，如下所示：

```php
<?php declare(strict_types = 1);

namespace Example\Template;

interface Renderer
{
    public function render($template, $data = []) : string;
}
```

> 注：函数中的“: string”是 PHP7 新增的特性，被称为“[返回值类型声明（Return type declarations）](https://www.php.net/manual/en/functions.returning-values.php#functions.returning-values.type-declaration)”（类似参数的“[类型声明（type declaration）](https://www.php.net/manual/en/functions.arguments.php#functions.arguments.type-declaration)”）作用是指定函数返回值的类型。弱模式下类型不一致会强制自动转换，强模式下会抛错。

<!-- Now that this is sorted out, let's create the implementation for mustache. In the same folder, create the file `MustacheRenderer.php` with the following content: -->

现在已经解决了这些问题，让我们为 Mustache 创建实现。在同一个文件夹里创建 `MustacheRenderer.php` 文件，内容如下：

```php
<?php declare(strict_types = 1);

namespace Example\Template;

use Mustache_Engine;

class MustacheRenderer implements Renderer
{
    private $engine;

    public function __construct(Mustache_Engine $engine)
    {
        $this->engine = $engine;
    }

    public function render($template, $data = []) : string
    {
        return $this->engine->render($template, $data);
    }
}
```

<!-- As you can see the adapter is really simple. While the original class had a lot of methods, our adapter is really simple and only fulfills the interface. -->

如你所见，适配器非常简单。虽然原始类有很多种方法，我们的适配器却十分简单，只有添加了一个接口。

<!-- Of course we also have to add a definition in our `Dependencies.php` file because otherwise the injector won't know which implementation he has to inject when you hint for the interface. Add this line: -->

当然，我们还必须在我们的 `Dependencies.php` 中添加一个定义，否则当你为接口进行提示时，注入器不知道它必须注入哪个实现。在内容中添加这一行：

`$injector->alias('Example\Template\Renderer', 'Example\Template\MustacheRenderer');`

<!-- Now in your `Homepage` controller, add the new dependency like this: -->

现在在你的 `Homepage` 控制器中添加新的依赖项，如下所示：

```php
<?php declare(strict_types = 1);

namespace Example\Controllers;

use Http\Request;
use Http\Response;
use Example\Template\Renderer;

class Homepage
{
    private $request;
    private $response;
    private $renderer;

    public function __construct(
        Request $request,
        Response $response,
        Renderer $renderer
    ) {
        $this->request = $request;
        $this->response = $response;
        $this->renderer = $renderer;
    }

...
```

<!-- We also have to rewrite the `show` method. Please note that while we are just passing in a simple array, Mustache also gives you the option to pass in a view context object. We will go over this later, for now let's keep it as simple as possible. -->

我们还必须重写 `show` 方法。请注意，虽然我们仅传递了一个简单的数组（array），Mustache 却为你提供了传递视图上下文对象的选项。我们将在稍后讨论这个问题，现在让我们尽量保持简单。

```php
    public function show()
    {
        $data = [
            'name' => $this->request->getParameter('name', 'stranger'),
        ];
        $html = $this->renderer->render('Hello {{name}}', $data);
        $this->response->setContent($html);
    }
```

<!-- Now go check quickly in your browser if everything works. By default Mustache uses a simple string handler. But what we want is template files, so let's go back and change that. -->

现在在你的浏览器中快速查看一下是否一切正常。默认情况下，Mustache 使用了一个简单的字符处理程序。但是我们想要的却是模板文件，因此让我们回头修改一下它。

<!-- To make this change we need to pass an options array to the `Mustache_Engine` constructor. So let's go back to the `Dependencies.php` file and add the following code: -->

做这样的修改，我们需要传递一个 options 数组到 `Mustache_Engine` 构造函数。因此让我们回到 `Dependencies.php` 文件并添加如下代码：

```php
$injector->define('Mustache_Engine', [
    ':options' => [
        'loader' => new Mustache_Loader_FilesystemLoader(dirname(__DIR__) . '/templates', [
            'extension' => '.html',
        ]),
    ],
]);
```

<!-- We are passing an options array because we want to use the `.html` extension instead of the default `.mustache` extension. Why? Other template languages use a similar syntax and if we ever decide to change to something else then we won't have to rename all the template files. -->

我们传递了一个 options 数组，因为我们想要使用的后缀名是 `.html` 而不是默认的后缀名。为什么？因为其它模板语言使用了类似的语法，如果我们决定更换成其它模板语言，那么我们将不必重命名所有的模板文件。

<!-- In your project root folder, create a `templates` folder. In there, create a file `Homepage.html`. The content of the file should look like this: -->

在你的项目根目录创建一个名为 `templates` 的文件夹。在那创建一个名为 `Homepage.html` 的文件。文件内容应该如下所示：

```
<h1>Hello World</h1>
Hello {{ name }}
```

<!-- Now you can go back to your `Homepage` controller and change the render line to `$html = $this->renderer->render('Homepage', $data);` -->

现在你可以回到你的 `Homepage` 控制器，然后更改 render 那一行为 `$html = $this->renderer->render('Homepage', $data);`。

<!-- Navigate to the hello page in your browser to make sure everything works. And as always, don't forget to commit your changes. -->

在你的浏览器中浏览 Hello World 页面确保一切运行正常。和往常一样，不要忘了提交你的改动。

---


<!-- ### 10. Dynamic Pages -->

### 10、动态页面

<!-- So far we only have a static page with not much functionality. Just having a hello world example is not very useful, so let's go beyond that and add some real functionality to our application. -->

到现在为止我们只有一个没有什么功能的静态页面。只有一个 Hello World 页面不是很有用，因此让我们更进一步，添加一些真正的功能到我们的应用里。

<!-- Our first feature will be dynamic pages generated from [markdown](http://en.wikipedia.org/wiki/Markdown) files. -->

我们的第一个功能将是从 [markdown](http://en.wikipedia.org/wiki/Markdown) 文件生成的动态页面。

<!-- Create a `Page` controller with the following content: -->

创建一个 `Page` 控制器，内容如下：

```php
<?php declare(strict_types = 1);

namespace Example\Controllers;

class Page
{
    public function show($params)
    {
        var_dump($params);
    }
}
```
<!-- Once you have done that, add a new route: -->

创建完成后，添加以下路由：

```php
['GET', '/{slug}', ['Example\Controllers\Page', 'show']],
```

<!-- Now try and visit a few urls, for example `http://localhost:8000/test` and `http://localhost:8000/hello`. As you can see, the `Page` controller is called every time and the `$params` array receives the slug of the page. -->

现在尝试访问几个新 URL，如 `http://localhost:8000/test` 和 `http://localhost:8000/hello`。如你所见，每次调用 `Page` 控制器，`$params` 数组就会接收页面的 slug 参数。

<!-- So let's create a few pages to get started. We won't use a database yet, so create a new folder `pages` in the root folder of your project. In there add a few files with the file extensions `.md` and add some text to them. For example `page-one.md` with the content: -->

让我们从创建几个页面开始。我们还不会使用数据库，因此在你项目的根目录创建一个名为 `pages` 的新文件夹。在其中添加几个后缀名为 `.md` 的文件，然后在其中添加一些文本。比如 `page-one.md` 含有如下内容：

```
This is a page.
```

<!-- Now we will have to write some code to read the proper file and display the content. It might seem tempting to just put all that code into the `Page` controller. But remember [Separation of Concerns](http://en.wikipedia.org/wiki/Separation_of_concerns). There is a good chance that we will need to read the pages in other places in the application as well (for example in an admin area). -->

现在我们将必须编写一些代码来读取特定文档并显示其内容。把所有代码都扔进 `Page` 控制器看起来很诱人。但是要记得“[关注点分离（separation of concerns）](https://zh.wikipedia.org/wiki/%E5%85%B3%E6%B3%A8%E7%82%B9%E5%88%86%E7%A6%BB)。这是好时机，很有可能我们也需要在应用程序的其它地方读取这些页面（如管理区域）。

<!-- So let's put that functionality into a separate class. There is a good chance that we might switch from files to a database later, so let's use an interface again to make our page reader decoupled from the actual implementation. -->

因此让我们把该功能放入单个的类。我们今后很可能会从文件切换到数据库，因此让我们再次使用一个接口，使我们的页面阅读器与真正的实现解藕。

<!-- In your 'src' folder, create a new folder `Page`. In there we will put all the page related classes. Add a new file in there called `PageReader.php` with this content: -->

在你的 `src` 文件夹，创建一个名为 `Page` 的新文件夹。在其中我们将存放所有与页面相关的类相。添加一个名为 `PageReader.php` 的新文件，内容如下：

```php
<?php declare(strict_types = 1);

namespace Example\Page;

interface PageReader
{
    public function readBySlug(string $slug) : string;
}
```

<!-- For the implementation, create a `FilePageReader.php` file. The file will looks like this: -->

关于实现，创建一个名为 `FilePageReader.php` 文件。文件看起来如下所示：

```php
<?php declare(strict_types = 1);

namespace Example\Page;

use InvalidArgumentException;

class FilePageReader implements PageReader
{
    private $pageFolder;

    public function __construct(string $pageFolder)
    {
        $this->pageFolder = $pageFolder;
    }

    public function readBySlug(string $slug) : string
    {
        return 'I am a placeholder';
    }
}
```

<!-- As you can see we are requiring the page folder path as a constructor argument. This makes the class flexible and if we decide to move files or write unit tests for the class, we can easily change the location with the constructor argument. -->

如你所见，我们引入了页面文件夹的路径作为构造函数的参数。这使得类变得灵活，如果你决定移动文件或为该类编写单元测试，我们可以通过构造函数参数轻松更改其位置。

<!-- You could also put the page related things into it's own package and reuse it in different applications. Because we are not tightly coupling things, things are very flexible. -->

你也可以把页面相关的文件放进它自己的包中，然后在不同的应用中重用它。因为我们没有对其紧耦合，所以显得非常灵活。

<!-- This will do for now. Let's create a template file for our pages with the name `Page.html` in the `templates` folder. For now just add {%raw%}`{{ content }}`{%endraw%} in there. -->

这样就可以了。让我们为页面在 `templates` 文件夹中创建一个名为 `Page.html` 的模板文件。现在只在里面添加 {%raw%}`{{ content }}`{%endraw%}。

<!-- Add the following to your `Dependencies.php` file so that the application know which implementation to inject for our new interface. We also define the the `pageFolder` there. -->

将如下代码添加到你的 `Dependencies.php` 文件中，以便应用程序知道为我们的新接口注入哪个实现。我们也要在那里定义 `pageFolder`。

```php
$injector->define('Example\Page\FilePageReader', [
    ':pageFolder' => __DIR__ . '/../pages',
]);

$injector->alias('Example\Page\PageReader', 'Example\Page\FilePageReader');
$injector->share('Example\Page\FilePageReader');
```

<!-- Now go back to the `Page` controller and change the `show` method to the following: -->

现在回到 `Page` 控制器，将 `show` 方法修改如下：

```php
public function show($params)
{
    $slug = $params['slug'];
    $data['content'] = $this->pageReader->readBySlug($slug);
    $html = $this->renderer->render('Page', $data);
    $this->response->setContent($html);
}
```

<!-- To make this work, we will need to inject a `Response`, `Renderer` and a `PageReader`. I will leave this to you as an exercise. Remember to `use` all the proper namespaces. Use the `Homepage` controller as a reference. -->

为了使其运行，我们需要注入一个 `Response`、`Renderer` 和 一个 `PageReader`。我将此留给你作为练习。记得使用 `use` 调用所有正确的命名空间。使用 `Homepage` 控制器作为参考。

<!-- Did you get everything to work? -->

你让一切都正常运行了吗？

<!-- If not, this is how the beginning of your controller should look now: -->

如果没有，你的控制器开头应该如下所示：

```php
<?php declare(strict_types = 1);

namespace Example\Controllers;

use Http\Response;
use Example\Template\Renderer;
use Example\Page\PageReader;

class Page
{
    private $response;
    private $renderer;
    private $pageReader;

    public function __construct(
        Response $response,
        Renderer $renderer,
        PageReader $pageReader
    ) {
        $this->response = $response;
        $this->renderer = $renderer;
        $this->pageReader = $pageReader;
    }
...
```

<!-- So far so good, now let's make our `FilePageReader` actually do some work. -->

至此一切顺利，现在让我们的 `FilePageReader` 做一些真正的事。

<!-- We need to be able to communicate that a page was not found. For this we can create a custom exception that we can catch later. In your `src/Page` folder, create a `InvalidPageException.php` file with this content: -->

我们需要能够传达找不到页面。为此我们能够创建一个以后可以捕获的自定义异常。在你的 `src/Page` 文件夹创建一个 `InvalidPageException.php` 文件，内容如下：

```php
<?php declare(strict_types = 1);

namespace Example\Page;

use Exception;

class InvalidPageException extends Exception
{
    public function __construct($slug, $code = 0, Exception $previous = null)
    {
        $message = "No page with the slug `$slug` was found";
        parent::__construct($message, $code, $previous);
    }
}
```

<!-- Then in the `FilePageReader` file add this code at the end of your `readBySlug` method: -->

然后在 `FilePageReader` 文件中 `readBySlug` 方法的末尾添加如下代码：

```php
$path = "$this->pageFolder/$slug.md";

if (!file_exists($path)) {
    throw new InvalidPageException($slug);
}

return file_get_contents($path);
```

<!-- Now if you navigate to a page that does not exist, you should see an `InvalidPageException`. If a file exists, you should see the content. -->

现在如果你浏览一个不存在的页面，你应该看到一个 `InvalidPageException`。如果文件存在，你应该看到内容。

<!-- Of course showing the user an exception for an invalid URL does not make sense. So let's catch the exception and show a 404 error instead. -->

当然向用户显示无效 URL 的异常并不合理。因此让我们捕获这个异常，然后显示一个 404 错误。

<!-- Go to your `Page` controller and refactor the `show` method so that it looks like this: -->

去你的 `Page` 控制器，然后重构 `show` 方法，让其看起来如下所示：

```php
public function show($params)
{
    $slug = $params['slug'];

    try {
        $data['content'] = $this->pageReader->readBySlug($slug);
    } catch (InvalidPageException $e) {
        $this->response->setStatusCode(404);
        return $this->response->setContent('404 - Page not found');
    }

    $html = $this->renderer->render('Page', $data);
    $this->response->setContent($html);
}
```

<!-- Make sure that you use an `use` statement for the `InvalidPageException` at the top of the file. -->

确保你在文件的顶部使用 `use` 语句导入了 `InvalidPageException`。

<!-- Try a few different URLs to check that everything is working as it should. If something is wrong, go back and debug it until it works. -->

尝试访问不同的 URL 来检查是否一切按预期正常运行。如果出错了，回头调试直到正常运行。

<!-- And as always, don't forget to commit your changes. -->

然后和往常一样，不要忘了提交你的改动。

---

<!-- ### 11. Page Menu -->

### 11、页面菜单

<!-- Now we have made a few nice dynamic pages. But nobody can find them. -->

现在我们已经制作了几个不错的动态页面。但是没人能找到它们。

<!-- Let's fix that now. In this chapter we will create a menu with links to all of our pages. -->

现在让我们来解决这个问题。在这一章中我们将要为所有页面创建一个带链接的菜单。

<!-- When we have a menu, we will want to be able to reuse the same code on multiple pages. We could create a separate file and include it every time, but there is a better solution. -->

当我们有了菜单，我们希望能够在多个页面上重用相同的代码。我们可以创建一个独立的文件，然后每次都包含它，但是还有一种更好的解决方案。

<!-- It is more practical to have templates that are able to extend other templates, like a layout for example. Then we can have all the layout related code in a single file and we don't have to include header and footer files in every template. -->

拥有可以扩展其它模板的模板更加实用，比如布局。这样我们能够在单个文件中拥有所有布局相关的代码，而不必在每一个模板中包含页头和页脚文件。

<!-- Our implementation of mustache does not support this. We could write code to work around this, which will take time and could introduce some bugs. Or we could switch to a library that already supports this and is well tested. [Twig](http://twig.sensiolabs.org/) for example. -->

我们使用的 Mustache 实现对此并不支持。我们可以编写代码来解决这个问题，但这样不仅会耗费时间还会引入一些 BUG。或许我们应该切换到已经支持这样做并且经过充分测试过的库，比如 [Twig](http://twig.sensiolabs.org/)。

<!-- Now you might wonder why we didn't start with Twig right away. Because this is a good example to show why using interfaces and writing loosely-coupled code is a good idea. Like in the real world, the requirements suddenly changed and now our code needs to adapt. -->

现在你可能想知道为什么我们不从一开始就使用 Twig。因为这是个很好的示例来说明为什么使用接口以及编写松耦合代码是个好主意。就像在真实世界中，需求突然改变，现在我们的代码需要适应。

<!-- Remember how you created a `MustacheRenderer` in [chapter 9](09-templating.md)? This time, we create a `TwigRenderer` that implements the same interface. -->

还记得在第 9 章你是如何创建 `MustacheRenderer` 的吗？这一次，我们创建一个 `TwigRenderer`，来实现同样的接口。

<!-- But before we start, install the latest version of Twig with composer (`composer require "twig/twig:~1.0"`). -->

不过在开始之前，请使用 Composer 安装最新版本的 Twig（`composer require "twig/twig:~1.0"`）。

<!-- Then create the a `TwigRenderer.php` in your `src/Template` folder that looks like this: -->

然后在你的 `src/Template` 创建一个名为 `TwigRenderer.php` 文件，内容如下：

```php
<?php declare(strict_types = 1);

namespace Example\Template;

use Twig_Environment;

class TwigRenderer implements Renderer
{
    private $renderer;

    public function __construct(Twig_Environment $renderer)
    {
        $this->renderer = $renderer;
    }

    public function render($template, $data = []) : string
    {
        return $this->renderer->render("$template.html", $data);
    }
}
```

<!-- As you can see, on the render function call a `.html` is added. This is because Twig does not add a file ending by default and you would have to specifiy it on every call otherwise. By doing it like this, you can use it in the same way as you used Mustache. -->

如你所见，在 `render` 函数调用中添加了 `.html`。这是因为 Twig 默认情况下不会添加文件后缀，否则你必须在每次调用时指定它。像这样做之后，你能像使用 Mustache 一样使用它。

<!-- Add the following code to your `Dependencies.php` file: -->

添加如下代码到你的 `Dependencies.php` 文件：

```php
$injector->delegate('Twig_Environment', function () use ($injector) {
    $loader = new Twig_Loader_Filesystem(dirname(__DIR__) . '/templates');
    $twig = new Twig_Environment($loader);
    return $twig;
});
```

<!-- Instead of just defining the dependencies, we are using a delegate to give the responsibility to create the class to a function. This will be useful in the future. -->

我们使用 `delegate` 来让函数负责创建类，而不是只定义依赖项。这在将来会很有用。

<!-- Now you can switch the `Renderer` alias from `MustacheRenderer` to `TwigRenderer`. Now by default Twig will be used instead of Mustache. -->

现在你能够把别名 `Renderer` 从 `MustacheRender` 切换到 `TwigRenderer`。现在默认会使用 Twig 而不是 Mustache。

<!-- If you have a look at the site in your browser, everything should work now as before. Now let's get started with the actual menu. -->

如果你在浏览器中查看该网站，现在一切应该像之前一样运行正常。现在让我们开始创建真正的菜单。

<!-- To start we will just send a hardcoded array to the template. Go to you `Homepage` controller and change your `$data` array to this: -->

一开始我们只是发送了一个硬编码的数组到模板。前往你的 `Homepage` 控制器，并如下这样更改你的 `$data` 数组：

```php
$data = [
    'name' => $this->request->getParameter('name', 'stranger'),
    'menuItems' => [['href' => '/', 'text' => 'Homepage']],
];
```

<!-- At the top of your `Homepage.html` file add this code: -->

在你的 `Homepage.html` 文件顶部添加如下代码：

{%raw%}
```php
{% for item in menuItems %}
    <a href="{{ item.href }}">{{ item.text }}</a><br>
{% endfor %}
```
{%endraw%}

<!-- Now if you refresh the homepage in the browser, you should see a link. -->

现在如果你在浏览器中刷新首页，你将会看到一个链接。

<!-- The menu works on the homepage, but we want it on all our pages. We could copy it over to all the template files, but that would be a bad idea. Then if something changes, you would have to go change all the files. -->

菜单在首页生效了，但是我们想让其在所有页面中生效。我们可以将其复制到所有的模板文件中，但那样做是个馊主意。到时候，如果改动了一些东西，你将不得不去改动所有的文件。

<!-- So instead we are going to use a layout that can be used by all the templates. -->

因此我们将会使用一个可供所有模板使用的布局模板。

<!-- Create a `Layout.html` in your `templates` folder with the following content: -->

在你的 `templates` 文件夹中创建一个 `Layout.html` 文件，内容如下：

{%raw%}
```php
{% for item in menuItems %}
    <a href="{{ item['href'] }}">{{ item['text'] }}</a><br>
{% endfor %}
<hr>
{% block content %}
{% endblock %}
```
{%endraw%}

<!-- Then change your `Homepage.html` to this: -->

然后将你的 `Homepage.html` 文件改动如下：

{%raw%}
```php
{% extends "Layout.html" %}
{% block content %}
    <h1>Hello World</h1>
    Hello {{ name }}
{% endblock %}
```
{%endraw%}

<!-- And your `Page.html` to this: -->

以及将你的 `Page.html` 文件改动如下：

{%raw%}
```php
{% extends "Layout.html" %}
{% block content %}
    {{ content }}
{% endblock %}
```
{%endraw%}

<!-- If you refresh your homepage now, you should see the menu. But if you go to a subpage, the menu is not there but the `<hr>` line is. -->

如果如现在刷新主页，你应该看到一个菜单。但是如果你访问子页面，除了 `<hr>` 分割线，却不见菜单。

<!-- The problem is that we are only passing the `menuItems` to the homepage. Doing that over and over again for all pages would be a bit tedious and a lot of work if something changes. So let's fix that in the next step. -->

问题的原因是我们只把 `menuItems` 传给了首页。在所有页面上重复这样做有点单调乏味，如果有所改动将会有增加很多工作。因此让我们下一步来解决这个问题。

<!-- We could create a global variable that is usable by all templates, but that is not a good idea here. We will add different parts of the site in the future like an admin area and we will have a different menu there. -->

我们可以创建一个可供所有模板使用的全局变量，但是在这里不是一个好主意。我们将在未来添加此网站的不同部分，比如管理区，我们将会有不同的菜单。

<!-- So instead we will use a custom renderer for the frontend. First we create an empty interface that extends the existing `Renderer` interface. -->

因此我们将在前端使用一个自定义的 Renderer。首先我们创建一个空的接口，以扩展已存在的 `Renderer` 接口。

```php
<?php declare(strict_types = 1);

namespace Example\Template;

interface FrontendRenderer extends Renderer {}
```

<!-- By extending it we are saying that any class implementing the `FrontendRenderer` interface can be used where a `Renderer` is required. But not the other way around, because the `FrontendRenderer` can have more functionality as long as it still fulfills the `Renderer` interface. -->

通过扩展它，我们说任何实现 `FrontendRenderer` 接口的类都能够在需要 `Renderer` 的地方被使用。而不是相反，因为 `FrontendRenderer` 能够拥有更多功能，只要它仍然匹配 `Renderer` 接口。

<!-- Now of course we also need a class that implements the new interface. -->

现在，我们当然还需要一个实现新接口的类。

```php
<?php declare(strict_types = 1);

namespace Example\Template;

class FrontendTwigRenderer implements FrontendRenderer
{
    private $renderer;

    public function __construct(Renderer $renderer)
    {
        $this->renderer = $renderer;
    }

    public function render($template, $data = []) : string
    {
        $data = array_merge($data, [
            'menuItems' => [['href' => '/', 'text' => 'Homepage']],
        ]);
        return $this->renderer->render($template, $data);
    }
}
```

<!-- As you can see we have a dependency on a `Renderer` in this class. This class is a wrapper for our `Renderer` and adds the `menuItems` to all `$data` arrays. -->

如你所见，我们在这个类中依赖于 `Renderer `。这个类是 `Renderer` 的包装器，并将 `menuItems` 添加到所有的 `$data` 数组中。

<!-- Of course we also need to add another alias to the dependencies file. -->

当然我们还需要向 `Dependencies.php` 文件中添加另外一个别名。

```php
$injector->alias('Example\Template\FrontendRenderer', 'Example\Template\FrontendTwigRenderer');
```

<!-- Now go to your controllers and exchange all references of `Renderer` with `FrontendRenderer`. Make sure you change it in both the `use` statement at the top and in the constructor. -->

现在前往你的控制器，把所有 `Renderer` 的引用改成 `FrontendRenderer`。确保你在顶部的 `use` 语句和构造函数中也做了更改。

<!-- Also delete the following line from the `Homepage` controller: -->

还要从 `Homepage` 控制器删除如下这一行：

```php
'menuItems' => [['href' => '/', 'text' => 'Homepage']],
```

<!-- Once that is done, you should see the menu on both the homepage and your subpages. -->

完成后，你应该在首页和子页面上看到菜单。

<!-- Everything should work now, but it doesn't really make sense that the menu is defined in the `FrontendTwigRenderer`. So let's refactor that and move it into it's own class. -->

现在一切应该正常运行，但是在 `FrontendTwigRenderer` 定义菜单并不合理。因此让我们重构它，将其移动到它自己的类中。

<!-- Right now the menu is defined in the array, but it is very likely that this will change in the future. Maybe you want to define it in the database or maybe you even want to generate it dynamically based on the pages available. We don't have this information and things might change in the future. -->

菜单现在是在数组中定义的，但这很可能会在未来发生变化。可能你想要在数据库中定义，或者，甚至你想要根据可用的页面动态生成它。我们没有这方面的信息，很多事可能会在未来发生变化。

<!-- So let's do the right thing here and start with an interface again. But first, create a new folder in the `src` directory for the menu related things. `Menu` sounds like a reasonable name, doesn't it? -->

因此让我们在这些做正确的事情，仍然从一个接口开始。但是，首先在 `src` 目录中创建一个新文件夹，存放与菜单相关的文件。`Menu` 听起来像个合理的名字，不是吗？

```php
<?php declare(strict_types = 1);

namespace Example\Menu;

interface MenuReader
{
    public function readMenu() : array;
}
```

<!-- And our very simple implementation will look like this: -->

我们的非常简单的实现看起来如下所示：

```php
<?php declare(strict_types = 1);

namespace Example\Menu;

class ArrayMenuReader implements MenuReader
{
    public function readMenu() : array
    {
        return [
            ['href' => '/', 'text' => 'Homepage'],
        ];
    }
}
```

<!-- This is only a temporary solution to keep things moving forward. We are going to revisit this later. -->

这只是一个可以让例子进行下去的临时解决方案。我们稍后还会再次处理它。

<!-- Before we continue, let's edit the dependencies file to make sure that our application knows which implementation to use when the interface is requested. -->

在我们继续之前，让我们编辑依赖文件，以确保我们的应用在请求接口时使用的是哪个实现，

<!-- Add these lines above the `return` statement: -->

在 `return` 语句之上添加如下代码：

```php
$injector->alias('Example\Menu\MenuReader', 'Example\Menu\ArrayMenuReader');
$injector->share('Example\Menu\ArrayMenuReader');
```

<!-- Now you need to change out the hardcoded array in the `FrontendTwigRenderer` class to make it use our new `MenuReader` instead. Give it a try without looking at the solution below. -->

现在你需要更改 `FrontendTwigRenderer` 类中硬编码的数组，以使其使用我们的新 `MenuReader`。在不看下面的解决方案前自己尝试一下。

<!-- Did you finish it or did you get stuck? Or are you just lazy? Doesn't matter, here is a working solution: -->

你完成了还是卡住了？或者你只是偷懒了？没关系，这里有一个可用的解决方案：

```php
<?php declare(strict_types = 1);

namespace Example\Template;

use Example\Menu\MenuReader;

class FrontendTwigRenderer implements FrontendRenderer
{
    private $renderer;
    private $menuReader;

    public function __construct(Renderer $renderer, MenuReader $menuReader)
    {
        $this->renderer = $renderer;
        $this->menuReader = $menuReader;
    }

    public function render($template, $data = []) : string
    {
        $data = array_merge($data, [
            'menuItems' => $this->menuReader->readMenu(),
        ]);
        return $this->renderer->render($template, $data);
    }
}
```

<!-- Everything still working? Awesome. Commit everything and move on to the next chapter. -->

一切仍然正常运行吗？太棒了。提交你所有改动然后继续下一章。

---

<!-- ### 12. Frontend -->

### 12、前端

<!-- I don't know about you, but I don't like to work on a site that looks two decades old. So let's improve the look of our little application. -->

我不知道你，但是我不喜欢为一个看起来是二十年前的网站而工作。所以让我们来改进我们小应用的外观。

<!-- This is not a frontend tutorial, so we'll just use [pure](http://purecss.io/) and call it a day. -->

这不是一个前端教程，所以我们将只使用 [pure](http://purecss.io/) 然后到此为止。

<!-- First we need to change the `Layout.html` template. I don't want to waste your time with HTML and CSS, so I'll just provide the code for you to copy paste. -->

首先我们需要修改 `Layout.html` 模板。我不希望在 HTML 和 CSS 上浪费你的时间，所以我将只提供供你复制粘贴的代码：

{%raw%}
```php
<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>Example</title>
        <link rel="stylesheet" href="http://yui.yahooapis.com/pure/0.6.0/pure-min.css">
        <link rel="stylesheet" href="/css/style.css">
    </head>
    <body>
        <div id="layout">
            <div id="menu">
                <div class="pure-menu">
                    <ul class="pure-menu-list">
                        {% for item in menuItems %}
                            <li class="pure-menu-item"><a href="{{ item['href'] }}" class="pure-menu-link">{{ item['text'] }}</a></li>
                        {% endfor %}
                    </ul>
                </div>
            </div>
            <div id="main">
                <div class="content">
                    {% block content %}
                    {% endblock %}
                </div>
            </div>
        </div>
    </body>
</html>
```
{%endraw%}

<!-- You will also need some custom CSS. This is a file that we want publicly accessible. So where do we put it? Exactly, in the public folder. -->

你将还需要一些自定义 CSS。我们想要这个文件公开访问。所以我们需要把它放在哪里？当然是在 public 文件夹。

<!-- But to keep things a little organized, add a `css` folder in there first and then create a `style.css` with the following content: -->

但是为了保持文件有点组织，现在里面添加一个名为 `css` 的文件夹，然后创建一个 `style.css` 文件，内容如下：

```css
body {
    color: #777;
}

#layout {
    position: relative;
    padding-left: 0;
}

#layout.active #menu {
    left: 150px;
    width: 150px;
}

#layout.active .menu-link {
    left: 150px;
}

.content {
    margin: 0 auto;
    padding: 0 2em;
    max-width: 800px;
    margin-bottom: 50px;
    line-height: 1.6em;
}

.header {
    margin: 0;
    color: #333;
    text-align: center;
    padding: 2.5em 2em 0;
    border-bottom: 1px solid #eee;
}

.header h1 {
    margin: 0.2em 0;
    font-size: 3em;
    font-weight: 300;
}

.header h2 {
    font-weight: 300;
    color: #ccc;
    padding: 0;
    margin-top: 0;
}

#menu {
    margin-left: -150px;
    width: 150px;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 1000;
    background: #191818;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
}

#menu a {
    color: #999;
    border: none;
    padding: 0.6em 0 0.6em 0.6em;
}

#menu .pure-menu,
#menu .pure-menu ul {
    border: none;
    background: transparent;
}

#menu .pure-menu ul,
#menu .pure-menu .menu-item-divided {
    border-top: 1px solid #333;
}

#menu .pure-menu li a:hover,
#menu .pure-menu li a:focus {
    background: #333;
}

#menu .pure-menu-selected,
#menu .pure-menu-heading {
    background: #1f8dd6;
}

#menu .pure-menu-selected a {
    color: #fff;
}

#menu .pure-menu-heading {
    font-size: 110%;
    color: #fff;
    margin: 0;
}

.header,
.content {
    padding-left: 2em;
    padding-right: 2em;
}

#layout {
    padding-left: 150px; /* left col width "#menu" */
    left: 0;
}
#menu {
    left: 150px;
}

.menu-link {
    position: fixed;
    left: 150px;
    display: none;
}

#layout.active .menu-link {
    left: 150px;
}
```

<!-- Now if you have a look at your site again, things should look a little better. Feel free to further improve the look of it yourself later. But let's continue with the tutorial now. -->

现在如果你再看一下网站，看起来应该更好一些了。稍后你可自行随意进一步改进它的外观。现在让我们继续这个教程。

<!-- Every time that you need an asset or a file publicly available, then you can just put it in your `public` folder. You will need this for all kinds of assets like javascript files, css files, images and more. -->

每当你需要公开提供资源或文件时，只要将其放入你的 `public` 文件夹即可。对于所有类似 JavaScript 文件、CSS 文件、图片以及更多类型的资源，你也需要这样做。

<!-- So far so good, but it would be nice if our visitors can see what page they are on. -->

到现在为止一切都还好，但是如果我们的访客能够看到他们所在的页面就更好了。

<!-- Of course we need more than one page in the menu for this. I will just use the `page-one.md` that we created earlier in the tutorial. But feel free to add a few more pages and add them as well. -->

当然我们需要菜单有不止一个页面。在这个教程中，我将只使用先前创建的 `page-one.md`。但是你可随意再添加几个页面。

<!-- Go back to the `ArrayMenuReader` and add your new pages to the array. It should look something like this now: -->

回到 `ArrayMenuReaner` 添加你的新页面到数组。它看看起来应该如下所示：

```php
return [
    ['href' => '/', 'text' => 'Homepage'],
    ['href' => '/page-one', 'text' => 'Page One'],
];
```

---

### To be continued...

### 未完待续……

<!-- Congratulations. You made it this far. -->

恭喜。你走了这么远。

<!-- I hope you were following the tutorial step by step and not just skipping over the chapters :) -->

我希望你能一步一步照着教程做，而不是跳着章节看。

<!-- If you got something out of the tutorial I would appreciate a star. It's the only way for me to see if people are actually reading this :) -->

如果你从教程中学到一些东西，我感激你的星标。对我来说这是了解人们是否真正阅读这些文字的唯一途径。

<!-- Because this tutorial was so well-received, it inspired me to write a book. The book is a much more up to date version of this tutorial and covers a lot more. Click the link below to check it out (there is also a sample chapter available). -->

因为这个教程如此受欢迎，它启发我写了一本书。这本书是这个教程的更新版本，包含更多内容。点击下面这个链接购买（有可阅读的样章）。

[Professional PHP: Building maintainable and secure applications](http://patricklouys.com/professional-php/)

<!-- Thanks for your time, -->

感谢你的关注。

Patrick

---

原文：[Create a PHP application without a framework](https://github.com/PatrickLouys/no-framework-tutorial)
