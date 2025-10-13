---
layout: article
title: "[翻译] 论模板"
date: 2019-07-30 18:23:41 +0800
updated: 2019-08-09 19:44:30 +0800
author: Runbing
tags:
  - php-template
  - php
  - translation
categories:
  - programming
excerpt: 本文主要是模板引擎 Mustache 带来的启示：如果你在模板中做任何事情，只要不是一个简单的 for 或 if，那它就不属于模板。
---

<!-- I’ve been playing around with tempting engines a lot lately. For a recent project, I needed the ability to re-use the same template set in both JS and PHP (coupled with the History API, providing seamless dynamic behavior, yet still having raw content pages). Realistically today, there’s only one choice for that sort of requirement: [Mustache](http://mustache.github.com/). I’ve learned a lot while playing with Mustache, and it’s really changed my entire viewpoint on presentation layer construction. -->

我最近折腾了很多模板引擎。为了最近的项目，我需要能够在 JS 和 PHP 中复用同一套模板（与历史 API 相结合、提供无缝动态特性、但仍然具有原始内容页面）。直到今天，只有一种选择符合这种要求：[Mustache](http://mustache.github.com/)。折腾 Mustache 期间我学到了很多，它完全颠覆了我在表现结构层的观点。

<!-- ## The Past -->

## 从前

<!-- If you would have talked to me two years ago, I would have told you that I felt that templating engines are overkill in PHP, and that you should just use raw PHP instead. My rationale was that the templating engine (such as [Smarty](http://www.smarty.net/)) gives you SO little that it’s hard to justify both the performance degradation and the different syntax. At that point, templating engines didn’t even really escape variables for you (you had to append a weird filter to each variable). After all, what benefit did using the template engine give you other than syntax? -->

如果两年前你和我交流，我应该会告诉你我觉得在 PHP 中使用模板引擎有点夸张，你应该只是用原生的 PHP 就够了。我的理由是模板引擎（如 [Smarty](http://www.smarty.net/)） 给你如此少的功能，很难证明降低性能和改变语法是合理的。那时，模板引擎甚至不能真正为你转义变量（你必须为每一个变量附加一个怪异的过滤器）。归根结底，使用模板引擎除了语法之外还有什么好处呢？

<!-- Then came [Twig](http://twig.sensiolabs.org/). I saw the auto-escaping feature and was instantly sold. Finally, a solid reason to use templating engines over raw PHP. While I didn’t quite 100% leave raw PHP templates, I started recommending that people use Twig. It had nice syntax and nice code. And best of all, it was simple! -->

然后是 [Twig](http://twig.sensiolabs.org/)。我看到了自动转义功能，就立即接受了它。终于，有了充足的理由使用模板引擎而不是原生 PHP。虽然我没有 100% 放弃原生 PHP 模板功能，但是我开始推荐人们使用 Twig。它有着友好的语法和精美的语法。最重要的是，它还很简单！

<!-- But then, over the recent months, I started to notice that what was once a very simple templating engine has grown out. Now, it supports all sorts of features. It supports hooking into the parser to define your own DSL ([Domain Specific Languages](https://en.wikipedia.org/wiki/Domain-specific_language)). It supports [multiple inheritance](https://en.wikipedia.org/wiki/Multiple_inheritance). Now, maybe it supported all of this before hand and I just didn’t see it. But it feels like even Twig is too heavy and cumbersome… -->

但是然后，过了几个月，我开始注意到曾经非常简单的模板引擎已经壮大了。现在，它提供了各种功能。它支持挂钩到解析器定义你自己的 DSL（[领域特定语言](https://zh.wikipedia.org/wiki/%E9%A2%86%E5%9F%9F%E7%89%B9%E5%AE%9A%E8%AF%AD%E8%A8%80)）。它支持[多重继承](https://zh.wikipedia.org/wiki/%E5%A4%9A%E9%87%8D%E7%BB%A7%E6%89%BF)。现在，或许它已经事先支持了所有这一切，只是我还没有见到。但是即使是 Twig 也感觉太臃肿和笨重……

<!-- Another thing to consider is that I never unit tested the presentation layer of my applications. I have always found it to be a PITA, accounting for layout changes, etc. So I would implement what amounted to behavioral tests using Selenium (or other tools). But I never was happy with them. They were always the most fragile layers in the test suite. And they never really got me anything except for a small bump in test coverage. -->

另外要考虑的事情是，我从未对应用程序的表现层进行过单元测试。我一直认为它是解释布局变化等无聊繁琐的事儿。因此我会使用 Selenium（或其它工具）实行相当于行为测试的内容。但是我从未对此感到满意。他们在测试套件中一直是最脆弱的一层。除了测试覆盖范围的一小部分，它们从未让我真正得到任何东西。

<!-- ## Enter Mustache -->

## 加入 Mustache

<!-- I had played around with Mustache before on side projects, but never used it for anything serious. Then very recently, I pulled it in to work on a new application. My initial impression was that it was a pain in the neck to use. After all, the ONLY logic that you have to work with is a foreach loop and an if-but-not-really-an-if structure (in fact, they are the same operator)… Due to this limitation, the data that you feed into the template needs to be structured in a very specific way. Seems quite limiting… -->

我以前在业余项目中折腾过 Mustache，但是从没有在正式的项目用用过它。但最近，我在一个新的应用程序中使用了它。我的最初印象是用它会很头疼。毕竟，你只能使用的仅有逻辑是一个 foreach 循环和一个似是而非的 if 结构（实际上，他们是同一个运算符）……由于有此限制，你向模版填充的数据需要用特定的方法结构化。似乎很局限……

<!-- I came to an interesting realization though. Since the template itself has no logic, it becomes nothing more than a transform. And if it’s just a transform, there’s nothing TO test in it. Instead, I put all of that logic that would have gone into the template back into a view object. And guess what? That view object is actually quite easy to unit test! My coverage increased, but better yet, the quality of the tests themselves improved drastically! -->

然而我产生了一个有趣的认识。因为模板自身没有逻辑，它只不过是一种转变。如果它仅仅是一种转变，那就没任何东西可以测试了。相反，我把所有进入模板的逻辑放回视图对象（view object）。你猜怎么着？视图对象真的非常容易进行单元测试！我的覆盖率增加了，而更好的是，测试本身的质量也有了极大的改善。

<!-- ## Not A Tool, An Approach -->

## 方法而非工具

<!-- There’s an important point here: the tool isn’t what helped me. It only showed me the path. The thing that got me the benefit was the realization that the template is just a data transform. Now Mustache enforces that constraint, but there’s nothing to say that you can’t do it with any other tool. -->

这里有一个重点：工具对我没有帮助。它只为我指明了方向。这件事给我带来的益处是让我意识到模板只是一种数据转换形式。现在 Mustache 强制执行了这种约束，但是你无法通过其它任何工具做到这一点，这没什么可说的。

<!-- The approach here is simple: separate a view into an object and a template. The object runs the logic needed (pulling data from models, formatting it, and any other presentational logic) and then passes that data into a template. The template simply acts as a data transform, taking an array of one format, and producing output in a different one. That’s it. -->

这里的方法很简单：把视图分成一个对象和一个模板。对象运行所需要的逻辑（从模型中拉取数据，格式化它，以及任何其它表示逻辑）然后将数据传给模板。模板简化数据转换的操作，采用一种格式的数组，然后生成不同的输出，仅此而已。

<!-- ## Wrapping Up -->

## 总结

<!-- The take-away here is pretty simple: if you’re doing anything in a template that’s not a simple for or an if, then it doesn’t belong in a template. You’re calling functions? You’ll lose the benefits of abstracting the presentation. You’re not testing the presentation layer at all? Shame on you. You’re not escaping the output? Bad developer, no donut. -->

这里的结论相当简单：如果你在模板中做任何事情，只要不是一个简单的 for 或 if，那它就不属于模板。你在调用函数吗？你会失去抽象表示的好处。你根本对表现层进行测试？你真不害臊。你还没有转义输出？糟糕的开发者，没有甜甜圈。

---

翻译自原文：[On Templating](https://blog.ircmaxell.com/2012/12/on-templating.html)
