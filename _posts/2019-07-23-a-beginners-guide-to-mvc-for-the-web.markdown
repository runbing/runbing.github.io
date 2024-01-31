---
layout: article
title: "[翻译] 面向 WEB 的 MVC 初学者入门指南"
date: 2019-07-23 16:03:05 +0800
updated: 2019-08-09 19:44:30 +0800
author: Runbing
tags:
  - mvc
  - php
  - design-pattern
categories:
  - programming
  - translation
excerpt: 本文解释了作为模式的 MVC 和作为概念的“MVC”，两者都只适用于有状态的应用程序，而不是无状态的 WEB 应用。与其纠结 MVC 不如把精力放在抽象概念、关注点分离和架构上。
---

<!-- There are a bunch of guides out there that claim to be a guide to MVC. It’s almost like writing your own framework in that it’s “one of those things” that everyone does. I realized that I never wrote my “beginners guide to MVC”. So I’ve decided to do exactly that. Here’s my “beginners guide to MVC for the web”: -->

有一大堆指南宣称是 MVC 指南。几乎像是编写你自己的框架一样，它是每个人都在做的“其中一件事”。我意识到我从没有写过我的“MVC 初学者指南”。所以我决定这样做。下面是我的“面向 WEB 的初学者入门者指南”：

<!-- ### Lesson 1 -->

### 课程 1

<!-- You don’t need “MVC”. -->

你不需要“MVC”。

<!-- There, I said it. -->

对，这是我说的。

<!-- The best advice I can give beginners (and senior people alike) is that you don’t need to learn “MVC”. -->

我能给初学者（资深人士也一样）的最佳建议是你不需要学习“MVC”。

<!-- In fact, I think it’s bad to learn MVC specifically. The reason is that there are two things that “MVC” means. The pattern, and the concept. Nobody uses the pattern (I’ll talk about it in the next section), and everyone uses a different concept. So really, if you learn “MVC”, it’ll be different from what the person sitting next to you thinks “MVC” is. -->

其实，我认为专门学习 MVC 是不好的。原因是“MVC”意味着两个东西。模式和概念。没有人使用模式（我将在下一节探讨它），而每个人都在使用不同的概念。所以事实是，如果你学习“MVC”，它会和你身边的人所认为的“MVC”不同。

<!-- That’s the first lesson: there is no “one thing” that you can describe as “MVC”. It is a collection of concepts. -->

这是第一个教训：你没有“一种东西”可以诠释“MVC”。它是一个概念的集合。

<!-- Side-note: I’m going to use `"MVC"` to describe the concept, and `MVC` to describe the pattern. It should be pretty clear which I am talking about at any given time (mostly the concept). -->

提示：我将会用（带引号的）“MVC”来形容**概念**，用（不带引号的）MVC 形容**模式**。这样应该比较清楚我到时谈到的是哪个（通常是概念）。

<!-- ### What Is MVC As A Pattern -->

### 什么是 MVC 模式

<!-- MVC is “Model View Controller”. It describes a very specific arrangement of the three: -->

MVC 是 “Model（模型）、View（视图）、Controller（控制器”）。它描述了三者的一种非常具体的约定。

![](/assets/img/2019/07/mvc.png)

<!-- Each part is responsible for the following: -->

每一部分负责以下事项：

<!-- ● Model - Responsible for representing and persisting application data. If you’re building a blog for example, this set of objects would represent individual blog posts, and be able to save them to the database (as well as load them). It also issues events when it changes (via the Observer Pattern). -->

● Model（模型）- 负责表现和持久化应用程序数据。假设以你创建一个博客为例，这组对象将代表每篇博客文章，并能将其存储到数据库（以及加载它们）。他还会在发生改动时释放事件（通过观察者模式（Obderver Pattern）。

<!-- ● View - Responsible for rendering data from the Model to the user. So it pulls the data that it needs from the instance of the model. The other key point is that it then binds as an Observer to that model. So any future updates to it will automatically update the User Interface. -->

● View（视图）- 负责向用户渲染来自 Model 的数据。因此他会从模型实例拉取它所需要的数据。另一个关键点是它随后会作为观察者（Observer）绑定到该模型上。这样它将来的任何更新都会自动更新到用户界面。

<!-- It’s important to note that the View is the thing doing the rendering itself. It is the final output. -->

需要特别注意的是 View 是渲染它自己的东西，它是最终的输出。

<!-- ● Controller - Responsible for intercepting user interaction and converting it to Model and View instructions. So if the user edits the title of a blog post, the controller sees the interaction, and edits the title in the model. -->

● Controller（控制器）- 负责拦截用户交互然后将其转换成 Modle 和 View 指令。因此，如果用户编辑了博客文章的标题，控制器观察到交互，就在模型中编辑标题。

<!-- The pattern is explicitly clear about the relationships of the objects. Controllers update Models, Models tell Views they has been updated, and then the Views pull the new data from the Models and present it. -->

该模式明确地弄清楚了对象的关系。控制器更新模型，模型告知视图它们已经更新了，然后视图从模型拉取新数据并呈现它。

<!-- This sounds easy! -->

这听起来很简单。

<!-- ### What Is “MVC” As A Concept -->

### 什么是 “MVC” 概念

<!-- “MVC” is a concept that centers around separation of concerns. -->

“MVC” 是一个以关注点分离为中心的概念。

<!-- What does that mean? -->

这是什么意思？

<!-- Well, to put it simply, you want to separate parts of your application. Some parts are going to deal with presentation (displaying things to the user). Some parts are going to deal with persistence (storing data in a database). Other parts are going to deal with user interaction (figuring out what to do with the request the user sent). And finally, you have a whole bunch of other things that simply don’t fit into the above (such as sending email, logging, etc). -->

呃，简而言之，你需要分离应用程序的各个部分。有些部分处理呈现（向用显示一些东西）。有些部分处理持久化（向数据库存储数据）。其它部分处理用户交互（弄清楚如何处理用户发送的请求）。最后，你还有一大堆根本无法归类其中的其它东西（诸如发送 Email、日志记录等）

<!-- That sounds awfully similar to the description of the pattern, doesn’t it? -->

这听起来非常类似于模式的描述，不是吗？

<!-- That’s part of the problem, they are quite different. -->

这只是问题的一部分，它们完全不同。

<!-- MVC as a pattern describes the specific interactions between each individual layer. Most of which aren’t useful for internet usages. -->

MVC 作为模式描述了每个单独层之间的特定交互。其中大部分不适用于互联网。

<!-- One example in server-side usage, is that the View cannot actually render anything. Since it’s on the server, all it can do is output instructions (HTML, or some other intermediary) which the client will then render. This is an extremely important difference because it means that the View cannot be stateful of its representation. Therefore, if the View wants to change something it has already rendered, it cannot. And as such, the entire premise of MVC falls flat. -->

拿在服务器端使用举个例子，View 无法实际渲染任何东西。因为它在服务器上，所以它所能做的只是输出指令（HTML 或其它中间状态的指令），然后客户端渲染这些指令。这是一个极其重要的区别，因为这意味着 View 不可能有状态地呈现。因此，如果 View 想要更改它已经渲染好的内容，它做不到。并且因此，整个 MVC 的假设不成立。

<!-- This means that the Observer functionality, where the View watches the Model, is completely impractical for web requests. That’s because the HTTP, and the internet as a whole is stateless. -->

这意味着 View 观察 Model 的 Observer 功能对于 Web 请求是完全不切实际。这是因为 HTTP 和整个互联网是无状态的。

<!-- ### It’s All About State -->

### 一切都与状态有关

<!-- MVC is a stateful pattern. It is designed to simplify the management of state across the lifetime of the program. By having events emitted and consumed between the layers, the program can be greatly simplified. -->

MVC 是一个有状态的模式。它旨在简化程序生命周期内的状态管理。通过在层之间发出和获取事件，程序可以大大简化。

<!-- This is incredibly useful for desktop applications. -->

对于桌面程序来说这极为有用。

<!-- For web servers though, it’s extremely expensive. Because it means we need to either keep every users state alive on the server between requests (a lot of memory wasted, especially for visitors that only make 1 request) or we need to rebuild the state on every request (a lot of CPU wasted reconstructing the state). -->

而对于 Web 服务器，它极其昂贵。因为这意味着我们需要要么保持服务器上每个请求中的用户都处于活动状态（浪费了大量的内存，尤其是对于只发出一个请求的访客），要么为每个请求重建状态（浪费了大量 CPU 重建状态）。

<!-- So instead, every implementation of server-side “MVC” that I’ve ever seen removes the state from the equation. They have made “MVC” stateless. So by definition, they can’t be using the MVC pattern. -->

因此，我曾见过的服务端“MVC”的每个实现都从等式中移除了状态。他们使“MVC”成为无状态的。因此根据定义，他们不能使用 MVC 模式。

<!-- ### So what are they using? -->

### 那么他们使用什么？

<!-- Every framework that uses “MVC” that you look at, when you look at how it actually works, will be different. -->

你所看到的每个使用“MVC”的框架，当你研究它是如何实际工作的，会发现都是不同的。

<!-- Every implementation will have different details around exactly what goes where, and how it all relates together. -->

每一种实现都有着不同的具体如何运作的细节，以及它们是如何相互关联的。

<!-- For example, some will be “controller push”, where the controller fetches data from the model and pushes it into the view. Some will be “view pull”, where the view gets the model, and fetches the data from it. Some will be “controller push, view pull”, where the controller pushes the model into the view, and the view pulls the data it needs. And that’s just talking about how data gets into the view. There are other massive differences as well. Just google “thin model vs thin controller” and see how much people disagree on it. -->

比如，有些会是“控制器推送数据”，控制器从模型取出数据并将其推送到视图。有些会是“视图拉取数据”，视图拿到模型并从中取出数据。有些会是“控制器推送数据，视图拉取数据”，控制器将模型推送到视图，然后视图从中取出它所需要的数据。而这只是讨论数据是如何进入视图的。还有其它大量的差异。只需要 Google 一下“thin model vs thin controller”然后看看多少人对此有不同意见。

<!-- And this is why I say “don’t bother learning MVC”. There’s no “one thing” to learn. And there are far more useful things to spend your time learning… -->

这就是为何我说“不要费心学习 MVC”。没有“一种东西”值得学习。还有更多有用的东西值得你花时间学习……

<!-- ### The Underlying Lesson -->

### 深层教训

<!-- There is a very useful lesson that MVC brings: Separation Of Concerns. Meaning that you should separate different responsibilities into different sections of your application. -->

MVC 带来有一个非常有益的教训：关注点分离（Separation Of Concerns）。意思是你应该把不同的任务拆分成程序的不同部分。

<!-- This is a tenant that comes up in OOP over and over again. We talk about it with SOLID’s Single Responsibility Principle. Actually, all of the SOLID principles are directly related to separating concerns from one another (all 5 principles are really just different angles of the same concept). -->

这事一次次在面向对象中提出来。我们用 SOLID 的单一功能原理来探讨它。实际上，所有 SOLID 原理都与将关注点分开直接相关（所有五个原则实际上只是同一个概念的不同角度）。

<!-- Separation of Concerns is a necessary step in dealing with Abstraction. -->

关注点分离是处理抽象（Abstraction）的必要步骤。

<!-- Instead of latching on to MVC, latch on to abstraction. Latch on to separation of concerns. Latch on to architecture. -->

与其揪住 MVC 不放，不如热情接受抽象概念、关注点分离和架构。

<!-- There are far better ways to architect and abstract user interaction for server-based applications than MVC. -->

与 MVC 相比，有更好的方法为基于服务器的应用程序构建和抽象化用户交互。

<!-- But more on that in a later post… -->

此外，稍后会有更多与此相关的文章

<!-- ### Followups: -->

### 后续文章：

<!-- [Alternatives To MVC](https://blog.ircmaxell.com/2014/11/alternatives-to-mvc.html) -->

[MVC 的替代方案](/archives/alternatives-to-mvc.html)

---

翻译自原文：[A Beginner's Guide To MVC For The Web](https://blog.ircmaxell.com/2014/11/a-beginners-guide-to-mvc-for-web.html)
