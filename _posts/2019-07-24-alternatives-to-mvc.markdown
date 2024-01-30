---
layout: article
title: "[翻译] MVC 的替代方案"
date: 2019-07-24 21:16:35 +0800
updated: 2019-08-09 19:44:30 +0800
author: Runbing
tags:
  - mvc
  - php
  - design-pattern
categories:
  - programming
  - translation
excerpt: 本文探讨了 MVC 同类们的差别，解释概念的同时，比较了它们之间的异同。总的说来这些所谓模式都是同一种概念的不同解释，并没有真正解决本应该解决的问题。
---

<!-- Last week, I wrote A Beginner’s Guide To MVC For The Web. In it, I described some of the problems with both the MVC pattern and the conceptual “MVC” that frameworks use. But what I didn’t do is describe better ways. I didn’t describe any of the alternatives. So let’s do that. Let’s talk about some of the alternatives to MVC… -->

上周，我写了一篇文章“[面向 Web 的 MVC 初学者指南](/archives/a-beginners-guide-to-mvc-for-the-web.html)”。其中，我叙述了框架使用 MVC 模式和“MVC”概念的一些问题。但是我没有给出更好的方法。我没有给出任何替代方案。因此让我们继续，谈谈 MVC 的一些替代方案……

<!-- ### Problems With MVC -->

### MVC 的问题

<!-- Let’s restate the fundamental problems we talked about that exist with MVC: -->

让我们复述一下我们探讨过的 MVC 存在的根本问题：

<!-- ● MVC Is Stateful -->

● MVC 是有状态的

<!-- It only makes sense if the View, as well as the View-Model binding is stateful (so the Model can update the View when it changes) -->

只有 View 和 View-Modle 的绑定是有状态的才有意义（这样 Model 才能在有变化时更新 View）。

<!-- ● MVC Has No Single Interpretation -->

● MVC 没有唯一的解释

<!-- Every framework uses their own nuanced version. -->

每一个框架都使用它们自己的有细微差别的版本。

<!-- ● How Does Logging Fit In? -->

● 日志如何归类

<!-- Where does application code that’s not clearly data-centric belong in the application? -->

那些不确定是否以数据为中心的应用程序代码应该从属应用程序的哪一部分？

### Siblings To MVC

### MVC 的同类

<!-- There are a whole bunch of siblings to MVC that take slight divergences and have narrow differences. Let’s briefly talk about a few of them: -->

MVC 有很多同类，它们略有分歧差异很小。让我们来简单谈谈其中的一些：

<!-- #### HMVC - [Hierarchical Model-View-Controller](http://en.wikipedia.org/wiki/Hierarchical_model%E2%80%93view%E2%80%93controller) -->

#### HMVC - [分层-模型-视图-控制器](https://zh.wikipedia.org/wiki/HMVC)

<!-- This is quite similar to the MVC pattern, except that you can nest the triads together. So you can have one MVC structure for a page, one for navigation and a separate one for the content on the page. So the “top level” dispatches requests down to navigation and content MVC triads. -->

这种模式非常类似于 MVC 模式，除了你可以把多个三元组嵌套在一起。这样你可以为页面应用一个 MVC 结构，为导航应用一个，再为页面上的内容应用一个。如此“顶层”会把请求分配到导航和内容的 MVC 三元组。

<!-- This makes structuring complex pages easier, since it allows you to create reusable widgets. But it brings all of the problems that MVC has, and solves none of them (it just adds complexity on top). -->

这使得构建复杂页面更容易，因为它允许你创建可复用的小部件。但是它带来了 MVC 所具备的所有问题，并且没有解决它们（它只是增加了顶层的复杂程度）。

<!-- So HMVC doesn’t really solve our problems… -->

因此 HMVC 没有真正解决我们的问题……

<!-- #### MVVM - [Model-View-ViewModel](http://en.wikipedia.org/wiki/Model_View_ViewModel) -->

#### MVVM - [模型-视图-视图模型](https://zh.wikipedia.org/wiki/MVVM)

<!-- The difference between MVC and MVVM is a lot more subtle. The basic premise is that in normal MVC, it’s bad that the View is doing two jobs: presentation and presentation data logic. Meaning that there’s a difference between actual rendering, and dealing with the data that will be rendered. So MVVM splits the MVC View in half. The presentation (rendering) happens in the View. But the data component lives in the ViewModel. -->

MVC 和 MVVM 之间的差异更加微妙。该模式的基本前提是，在标准的 MVC 中，View 同时做两件工作是不好的：呈现和表现数据逻辑。这意味着真正的渲染和渲染数据的处理之间是有差别的。因此 MVVM 把 MVC 的 View 分成了两部分。呈现（渲染）在 View 中进行。但是数据部分放进了 ViewModel。

<!-- The ViewModel can interact with the rest of the program, and the View is bound to the ViewModel. This means that there’s more of a separation between presentation and the application code that lives in the Model. -->

ViewModel 可以和程序的其余部分交互，而 View 被绑定到 ViewModel。这意味着呈现与 Model 中的应用程序代码之间进一步分离。

<!-- The controller isn’t mentioned, but it’s still in there somewhere. -->

控制器虽然没有被提到，但它仍然存在某个地方。

<!-- Again, this solves some types of problems with MVC, but doesn’t address any of our issues. -->

同样，此模式解决了 MVC 某些类型的问题，但是没有解决我们的任何问题。

<!-- #### MVP - [Model View Presenter](http://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93presenter) -->

#### MVP - [模型 视图 主持人](https://zh.wikipedia.org/wiki/Model-view-presenter)

<!-- MVP is a bit different from MVC in implementation. Instead of having the Controller intercept user interaction and the View render data, MVP structures itself a bit differently. The View is responsible for passive presentation. Meaning that it doesn’t bind to the Model, it just renders the data that it’s given. But it also receives user interaction events (like the MVC controller). Basically, the View is the only thing that’s exposed to the user. -->

MVP 在实现上与 MVC 略有不同。与用 Controller 拦截用户交互和用 View 渲染数据不同，MVP 结构本身就有点儿不一样。View 负责被动呈现。这意味着它没有绑定到 Model，它只会渲染被给予的数据。不过它也接收用户交互事件（类似 MVC 的控制器）。总的来说，唯一暴露给用户的只有 View。

<!-- The Presenter sits behind the View, and handles all of the functionality. When the View receives user interaction, it forwards it back to the Presenter. The Presenter then updates the Model, pulls data, and pushes data back into the View. -->

Presenter 位于 View 之后，控制所有的功能。当 View 收到用户交互后，它会将其转发给 Presenter。Presenter 会更新模型、拉取数据并把数据推送到 View 中。

<!-- Like HMVC, it solves some of the problems with MVC. But also like HMVC, it doesn’t address any of the issues. -->

就像 HMVC，它解决了 MVC 的一些问题。但是也像 HMVC 一样，它没有解决任何问题。

<!-- #### MVA - [Model View Adapter](http://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93adapter) -->

#### MVA - [模型视图适配器](http://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93adapter)

<!-- MVA replaces the Controller from MVC with an “Adapter”. Don’t be confused, this is not a Gang-Of-Four [Adapter](http://sourcemaking.com/design_patterns/adapter), but more of a [Mediator](http://sourcemaking.com/design_patterns/mediator). -->

MVA 把 MVC 中的 Controller 替换成了“Adapter”。不要混淆，这不是 [“四人帮”设计模式](https://zh.wikipedia.org/wiki/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%EF%BC%9A%E5%8F%AF%E5%A4%8D%E7%94%A8%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1%E8%BD%AF%E4%BB%B6%E7%9A%84%E5%9F%BA%E7%A1%80)（[Gang-Of-Four](http://wiki.c2.com/?GangOfFour)）中的 [适配器模式](https://zh.wikipedia.org/wiki/%E9%80%82%E9%85%8D%E5%99%A8%E6%A8%A1%E5%BC%8F)（[Adapter](http://sourcemaking.com/design_patterns/adapter)），而更倾向于[中介者模式](https://zh.wikipedia.org/wiki/%E4%B8%AD%E4%BB%8B%E8%80%85%E6%A8%A1%E5%BC%8F)（[Mediator](http://sourcemaking.com/design_patterns/mediator)）。

<!-- This means that the Model and the View never really talk to each other. Instead, they talk through the “Adapter” (which is really just an event-driven Controller). -->

这意味着 Model 和 View 彼此间从未真通信。相反，它们通过“Adapter”通信（实际上就是一个事件驱动型 Controller）。

<!-- The reason this is advantageous is that the View no longer needs to know about the Model. So you can achieve better separation and hence decoupling. -->

这样做的好处是 View 不再需要了解 Model。因此你可以实现更好的分离和解耦。

<!-- It also mean that the connection between the View and the Model can be stateless! Yay! Finally! -->

这也意味着 View 和 Model 之间的连接能够是无状态的！哇！终于搞定了！

<!-- Except not. While the connection between the View and the Model can be stateless, the instances themselves still need to be stateful. The only stateless component is the connection between them. -->

然而并非如此。尽管 View 和 Model 之间可以是无状态的，但是实例本身仍然需要是有状态的。无状态部分只是它们之间的连接。

<!-- So we’re still stuck with the same fundamental problems as MVC… -->

因此我们仍然卡在 MVC 同一根本问题上……

<!-- #### PAC - [Presentation Abstraction Control](http://en.wikipedia.org/wiki/Presentation%E2%80%93abstraction%E2%80%93control) -->

#### PAC - [表示 抽象 控制](http://en.wikipedia.org/wiki/Presentation%E2%80%93abstraction%E2%80%93control)

<!-- I’m not going to give much here, as PAC is really just like HMVC applied to MVA. It’s basically HMVA. With all the same problems. -->

我不打算在这里说太多，因为 PAC 实际上就像应用到 MVA 的 HMVC。基本上它就是 HMVA。带有所有相同的问题。

<!-- #### RMR - [Resource-Method-Representation](http://www.peej.co.uk/articles/rmr-architecture.html) -->

#### RMR - [资源 方法 呈现](http://www.peej.co.uk/articles/rmr-architecture.html)

<!-- In RMR architecture, you structure your application based on HTTP methods on resources which are then represented back to the user. So MVC Models become Resources (they map 1:1 to REST resources). The Controller becomes a “Method” object, and the View becomes the Representation. -->

在 RMR 架构中，你可以基于资源上的 HTTP 方法构建你的应用程序，然后呈现给用户。因此 MVC 的那些 Model 成了资源（它们会 1:1 映射到 REST 资源）。Controller 成了“Method”对象，View 成了 Representation。

<!-- This updates the MVC architecture for the HTTP web. It allows us to structure applications more like the requests that come in. And since we’re structuring the application more as actions-on-resources, we can simplify the interactions significantly. -->

这更新了 HTTP 网络的 MVC 架构。它允许我们构建更符合有请求参与的应用程序。并且，因为我们把应用程序更多地构建成资源上的操作，因此我们可以明显地简化交互。

<!-- This still doesn’t actually solve the stateful problem. Since Methods are actions on Resources, the Resources must be re-created for each request. Meaning that the entire triad system needs to be reconstructed for each request. Yay. -->

这仍然没有真正解决有状态的问题。由于方法是对资源的操作，因此必须为每一个请求重新创建资源。这意味着需要为每一个请求重建整个三元组系统。哇。

<!-- Not to mention that it doesn’t solve the other two issues at all. -->

更何况它根本没有解决其它两个问题。

<!-- Not to mention that it couples itself to HTTP so tightly that to try to map it to a CLI or GUI interface would be quite difficult. -->

更不用说它将自己和 HTTP 耦合得如此紧密，以至于想要把它映射到 CLI 或 GUI 接口都会非常困难。

<!-- #### ADR - [Action-Domain-Responder](http://pmjones.github.io/adr/) -->

#### ADR - [操作 领域 响应器](https://en.wikipedia.org/wiki/Action%E2%80%93domain%E2%80%93responder)

<!-- ADR is so close to RMR, that it’s really the same pattern with a few details tweaked. Action==Method, Resource==Domain and Representation==Responder. The only significant difference that I’ve seen is the amount of knowledge that the Responder (a Representation in RMR) has about the Domain (Resource). -->

ADR 和 RMR 非常相近，它实际上就是调整了几处细节的同一模式。Action==Method，Resource==Domain 以及 Representation==Responder。我所看到的唯一明显差别是 Responder（RMR 中的呈现）对 Domain（资源）的了解程度。

<!-- It still has issues like “where does logging fit”, and having to rebuild state on each request. And it shares RMRs coupling to HTTP that it becomes difficult to make a non-HTTP interface. -->

它仍然存在像“日志应该放到哪儿”和必须在每个请求上重建状态的问题。并且它像 RMR 一样耦合到了 HTTP，因此很难创建非 HTTP 接口。

<!-- ### What Is The Commonality? -->

### 共性是什么？

<!-- There are a few points to notice about all of the patterns that I mentioned before. Let’s go through them one-by-one. -->

关于我之前所提到的所有模式，有几点需要注意。让我们一个个来看。

<!-- #### ● All Are Triads -->

#### ● 都是三元组

<!-- Each one of the patterns that I talked about above is a triad. Meaning that there are three components to it. -->

我上面谈到的每一种模式都是一个三元组。这意味着它们都有三个组成部分。

<!-- It’s kind-of funny that > 90% of the predominant application patterns out there have 3 components. Really makes you wonder why… -->

有趣的是大于 90% 的主流应用模式都有 3 个组成部分。确实会让你好奇为何会这样……

<!-- I wonder if it’s because every one of the patterns is simply a different interpretation of the same underlying concept. The same way that SOLID really is just one concept that presents itself differently depending on how you look at it, perhaps MVC is one of those patterns. Everyone looks at it in a different way, and some realize that it’s different so they name it something else. But it’s the same underlying concept. -->

我想，是不是因为每一种模式都是同一个基本概念的不同解释。与 SOLID 实际上只是一种概念一样，它所表现的不同，取决于你如何看待它。或许 MVC 就是那些模式中的一种。每个人都用不同的方式看待它，有些人意识到它的不同，就把它命名成别的什么名字。但是它们都同一基本概念。

<!-- #### ● All The Triads Have The Same Conceptual Purpose -->

#### ● 所有的三元组拥有同样的概念

<!-- Each and every pattern has similar concepts: -->

每个模式都有相似的思路：

<!-- * Something To Do Rendering
* Something To Do Interacting
* Something To Represent Data / Business Rules -->

* 部分去处理渲染
* 部分去处理交互
* 部分去表现数据/业务规则

<!-- The difference between the patterns is how the relationships work and which component can talk to which other component. -->

模式间的差异是，相互之间是如何工作的，以及哪一部分与哪一部分通信。

<!-- Again, I ask, where does logging fit in? Where does charging a Credit-Card fit in? Where does the rest of the application fit? -->

同样，我要问，日志放在哪儿？信用卡充值应该放在哪儿？应用程序的额外部分应该放在哪儿？

<!-- Also, why are these three special? Is rendering always a single responsibility? Or are there times where it has multiple responsibilities that should be split up? -->

另外，为什么这三个部分是特别的？渲染总是单一任务吗？或者当它有多重任务时才应该分开？

<!-- ### All Pretend To Be Application Architectures -->

### 都假装成应用程序架构

<!-- And this is the point. The underlying problem with all of them. There’s more to an application than just interaction and presentation. In fact, many would say that interaction and presentation are the smallest parts of the application (at least for non-trivial apps). -->

这就是重点。所有这些问题的根本问题。应用程序不只是有交互和呈现，还有更多内容。实际上，很多人会说交互和呈现是应用程序最小的部分（至少对大型程序来说）。

<!-- So why are we focusing on the interaction step? -->

那么为什么我们要集中在交互阶段呢？

<!-- Why are we focusing on the smallest and simplest part of our application, and shoving everything else either into a catch-all bucket of a Model, or outside of the pattern? -->

为什么我们关注我们程序的最小和最简单的部分，把其它所有东西都堆放进 Model 的杂物桶或模式之外？

<!-- And that’s the biggest reason all of these “patterns”, “architectures” and “concepts” are a bad joke. They solve the easy problem, and throw the hard problem over the fence. -->

这就是所有这些“模式”、“架构”和“原理”成为冷笑话的最大原因。它们解决了简单的问题，却不讲道理地丢出了困难的问题。

<!-- ### So how do we solve the hard problem? -->

### 那么我们如何解决难题？

<!-- The first step to solving it, is recognizing that it exists. -->

解决问题的第一步是，承认问题的存在。

<!-- We can’t have a discussion about something if we keep pretending that the problem isn’t there. -->

如果我们继续假装问题不存在，那我们就无法对某些事情进行讨论。

<!-- Some people have seen these problems, and they have invented things like [AOP - Aspect-Oriented-Programming](http://en.wikipedia.org/wiki/Aspect-oriented_programming) as a solution. -->

有些人已经看到了问题，然后他们发明了类似 [AOP（Aspect-Oriented-Programming）](https://zh.wikipedia.org/wiki/%E9%9D%A2%E5%90%91%E5%88%87%E9%9D%A2%E7%9A%84%E7%A8%8B%E5%BA%8F%E8%AE%BE%E8%AE%A1)的东西来作为解决方案。

<!-- But I don’t think that’s the right way to handle it. If it’s not clear where something fits in your application, that’s a sign that your application architecture is flawed. Not that you need to introduce some magic in to get it to work. -->

但是我不认为这是解决问题的正确方式。如果在你的应用程序中不清楚某些东西该放到哪儿，那就表明你的应用程序架构存在缺陷。而并不是说你需要因添加一些魔法来让它正常运行。

<!-- So let’s admit that none of these are application architectures… And let’s admit that there is a problem we need to solve. -->

因此，让我们承认这些都不是应用程序架构……然后让我们承认我们有一个需要解决的问题。

<!-- As far as the solution there… -->

至于解决方案……

<!-- Well, more on that next time. -->

好吧，下次再谈。

---

翻译自原文：[Alternatives To MVC](https://blog.ircmaxell.com/2014/11/alternatives-to-mvc.html)
