---
layout: article
title: "[翻译] PHP中的依赖注入"
date: 2020-07-06 13:41:20 +0800
updated: 2020-07-06 13:41:20 +0800
author: Runbing
tags:
  - php
categories:
  - programming
  - translation
excerpt: 你必须始终从你的代码中移除硬编码依赖项，并取而代之使用“依赖注入”注入它们，从而获益。然后使用某些依赖注入容器自动地管理所有这些注入的依赖项。
---

<!-- This is what Wikipedia has to say about Dependency Injection: -->

这是 Wikipedia 关于“依赖注入（[Dependency Injection](https://en.wikipedia.org/wiki/Dependency_injection)）”的说明：

<!-- > In software engineering, dependency injection is a software design pattern that implements inversion of control for software libraries. Caller delegates to an external framework the control flow of discovering and importing a service or software module specified or "injected" by the caller. -->

> 在软件工程中，依赖注入是一种软件设计模式，用以实现软件库的控制反转。调用者将发现和导入由调用者指定或“注入”的服务或软件模块的控制流委托给外部框架。

<!-- In simple terms, Dependency Injection is a design pattern that helps avoid hard-coded dependencies for some piece of code or software. -->

简单说，“依赖注入”是一种设计模式，用以避免某些代码或软件的硬编码依赖。

<!-- The dependencies can be changed at run time as well as compile time. We can use Dependency Injection to write modular, testable and maintainable code: -->

依赖项可以在运行和编译时被更换。我们可以使用“依赖注入”编写模块化的、可测试的以及可维护的代码。

<!-- * Modular: The Dependency Injection helps create completely self-sufficient classes or modules
* Testable: It helps write testable code easily eg unit tests for example
* Maintainable: Since each class becomes modular, it becomes easier to manage it -->

* 模块化：“依赖注入”有助于创建完全自足的类或模块
* 可测试的：它有助于轻松地编写可测试代码，比如单元测试
* 可维护的：由于每个类都是模块化的，因此管理起来就变得更加容易。

<!-- ## The Problem -->

## 问题

<!-- We have dependencies almost always in our code. Consider the following procedural example which is pretty common: -->

我们的代码中几乎总是有依赖项。考虑如下所示颇为常见的程序示例：

~~~php
function getUsers() {
     global $database;
     return $database->getAll('users');
}
~~~

<!-- Here the function getUsers has dependency on the $database variable (tight coupling). It has some of these problems: -->

这里的函数 `getUsers` 依赖于变量 `$database`（紧耦合）。它具有如下这些问题：

<!-- * The function getUsers needs a working connection to some database . Whether there is successful connection to database or not is the fate of getUsers function
* The $database comes from outer scope so chances are it might be overwritten by some other library or code in the same scope in which case function may fail -->

* 函数 `getUsers` 需要某个数据库的有效连接。无论是否成功连接到数据库，都是 `getUsers` 函数的命运。
* `$database` 来自外部作用域，因此它可能会被同一作用域中的其它库或代码覆盖，在这种情况下函数可能会出错。

<!-- Of course you could have used the try-catch constructs but it still doesn't solve the second problem. -->

当然你可以使用 try-catch 结构，但是它仍无法解决第二个问题。

<!-- Let's consider another example for a class: -->

让我们考虑一个类的另外一个例子：

```php
class User
{
    private $database = null;

    public function __construct() {
        $this->database = new database('host', 'user', 'pass', 'dbname');
    }

    public function getUsers() {
        return $this->database->getAll('users');
    }
}

$user = new User();
$user->getUsers();
```

<!-- This code again has these problems: -->

这段代码又一次出现以下问题：

<!-- * The class User has implicit dependency on the specific database. All dependencies should always be explicit not implicit. This defeats Dependency inversion principle
* If we wanted to change database credentials, we need to edit the User class which is not good; every class should be completely modular or black box. If we need to operate further on it, we should actually use its public properties and methods instead of editing it again and again. This defeats Open/closed principle
* Let's assume right now class is using MySQL as database. What if we wanted to use some other type of database ? You will have to modify it.
* The User class does not necessarily need to know about database connection, it should be confined to its own functionality only. So writing database connection code in User class doesn't make it modular. This defeats the Single responsibility principle. Think of this analogy: A cat knows how to meow and a dog knows how to woof; you cannot mix them or expect dog to say meow. Just like real world, each object of a class should be responsible for its own specific task.
* It would become harder to write unit tests for the User class because we are instantiating the database class inside its constructor so it would be impossible to write unit tests for the User class without also testing the database class. -->

* `User` 类对特定的数据库具有隐含依赖。所有依赖项应始终是显式的而非隐式的。这违背了“依赖反转原则（[Dependency inversion principle](https://en.wikipedia.org/wiki/Dependency_inversion_principle)）”。
* 如果我们想要更换数据库凭证，我们需要编辑 `User` 类，这不是好的做法；每个类应该是完全模块化的或黑盒化。如果我们需要对其进一步操作，我们应该只使用它的公开属性和方法，而不是一次又一次的编辑它。这违背了“开闭原则（[Open–closed principle](https://en.wikipedia.org/wiki/Open%E2%80%93closed_principle)）”。
* 让我们假设当前的类使用 MySQL 作为数据库，要是我们想要使用某些其它类型的数据库怎么样？你将不得不去修改它。
* `User` 类不是必须需要了解数据库连接，它应该只被限制在它自己的功能中。因此将数据库连接写入 `User` 类无法使其模块化。这违背了“单一职责原则（[Single responsibility principle](https://en.wikipedia.org/wiki/Single-responsibility_principle)）”。想想这个比喻：一只猫知道如何喵喵叫，一只狗知道如何汪汪叫；你不能把两者混在一起，或者指望狗能喵喵叫。就像真实世界，每个类的对象应该只对它自己的特定任务负责。
* 为 `User` 类编写单元测试将变得更加困难，因为我们正在实例化其构造函数中数据库类的，因此在不测试数据库类的情况下，不可能为 `User` 类编写单元测试。

<!-- ## Enter Dependency Injection! -->

## 加入依赖注入

<!-- Let's see how we can easily take care of above issues by using Dependency Injection. The Dependency Injection is nothing but injecting a dependency explicitly. Let's re-write above class: -->

让我们来看看如何使用“依赖注入”轻松处理上述问题。“依赖注入”只不过注入了一个显式的依赖。让我们重写上面的类：

```php
class User
{
    private $database = null;

    public function __construct(Database $database) {
        $this->database = $database;
    }

    public function getUsers() {
        return $this->database->getAll('users');
    }
}

$database = new Database('host', 'user', 'pass', 'dbname');
$user = new User($database);
$user->getUsers();
```

<!-- And there you have much better code, thanks to Dependency Injection principle. Notice that instead of hard-coding database dependency: -->

感谢“依赖注入原则”，现在你有了更好的代码。请注意，不是硬编码的数据库依赖：

```php
$this->database = new database('host', 'user', 'pass', 'dbname');
```

<!-- We are now injecting it into the constructor, that's it: -->

我们现在将其注入到了构造函数，仅仅如此：

```php
public function __construct(Database $database)
```

<!-- Notice also how we are passing database instance now: -->

还要注意我们现在是如何传递数据库实例的：

```php
$database = new Database('host', 'user', 'pass', 'dbname');
$user = new User($database);
$user->getUsers();
```

<!-- It follows Hollywood Principle, which states: "Don’t call us, we’ll call you." -->

它遵循了“好莱坞原则（[Hollywood Principle](http://en.wikipedia.org/wiki/Hollywood_Principle)）”，其中规定：“不要打电话给我们，我们会打电话给你。”

> 译者注：控制反转（[inversion of control](https://en.wikipedia.org/wiki/Inversion_of_control)，IoC）有时被戏称为“好莱坞原则：不要打电话给我们，我们会打电话给你。”

<!-- Let's see if this explicit dependency injection now solves problems we mentioned above. -->

让我们看看这种显式的依赖注入现在是否能解决我们上面提到的问题。

<!-- > The class User has implicit dependency on the specific database . All dependencies should always be explicit not implicit. This defeats Dependency inversion principle -->

> `User` 类对特定的数据库具有隐含依赖。所有依赖项应始终是显式的而非隐式的。这违背了“依赖反转原则（Dependency inversion principle）”。

<!-- We have already made database dependency explicit by requiring it into the constructor of the User class: -->

我们已经通过要求将数据库放入 `User` 类的构造函数中使其变成显式依赖。

```php
public function __construct(Database $database)
```

<!-- Here we are taking advantage of type hinting by specifying type of object we are expecting which is Database although it wasn't necessary but it is always a good idea to type hint when you can. -->

在这里，我们正利用特定对象类型的类型提示，即我们所期望的 `Database`，尽管它不是必须的，但当你能这样做的时候，使用类型提示总是一个好主意。

<!-- > If we wanted to change database credentials, we need to edit the User class which is not good; every class should be completely modular or black box. If we need to operate further on it, we should actually use its public properties and methods instead of editing it again and again. This defeats Open/closed principle -->

> 如果我们想要更换数据库凭证，我们需要编辑 `User` 类，这不是好的做法；每个类应该是完全模块化的或黑盒化。如果我们需要对其进一步操作，我们应该只使用它的公开属性和方法，而不是一次又一次的编辑它。这违背了“开闭原则（Open–closed principle）”。

<!-- The User class now does not need to worry about how database is connected. All it expects is Database instance. We no more need to edit User class for it's dependency, we have just provided it with what it needed. -->

`User` 类现在不需要关心数据库是这样连接的。它期望的只是 `Database` 实例。我们不必再为了依赖而编辑 `User` 类，我们只是提供了它所需要的内容。

<!-- > Let's assume right now class is using MySQL as database. What if we wanted to use some other type of database ? You will have to modify it. -->

> 让我们假设当前的类使用 MySQL 作为数据库，要是我们想要使用某些其它类型的数据库怎么样？你将不得不去修改它。

<!-- Again, the User class doesn't need to know which type of database is used. For the Database, we could now create different adapters for different types of database and pass to User class. For example, we could create an interface that would enforce common methods for all different types of database classes that must be implement by them. For our example, we pretend that interface would enforce to have a getUser() method requirement in different types of database classes. -->

同样的，`User` 类不需要知道使用的是哪种数据库类型。对于 `Database`，我们现在能够为不同类型的数据库创建不同适配器，并将其传递给 `User` 类。例如，我们能够创建一个接口，它能够强制让不同类型的数据库类必须实现共同方法。对于我们的示例，我们假设接口将强制不同类型的数据库类含有 `getUser()` 方法的规定。

<!-- > The User class does not necessarily need to know about database connection, it should be confined to its own functionality only. So writing database connection code in User class doesn't make it modular. This defeats the Single responsibility principle. -->

> `User` 类不是必须需要了解数据库连接，它应该只被限制在它自己的功能中。因此将数据库连接写入 `User` 类无法使其模块化。这违背了“单一职责原则（Single responsibility principle）”。想想这个比喻：一只猫知道如何喵喵叫，一只狗知道如何汪汪叫；你不能把两者混在一起，或者指望狗能喵喵叫。就像真实世界，每个类的对象应该只对它自己的特定任务负责。

<!-- Of course User class now doesn't know how database was connected. It just needs a valid connected Database instance. -->

当然 `User` 类现在不知道数据库是怎样连接的。它只需要一个有效的已连接的 `Database` 实例。

<!-- > It would become harder to write unit tests for the User class because we are instantiating the database class inside its constructor so it would be impossible to write unit tests for the User class without also testing the database class. -->

> 为 `User` 类编写单元测试将变得更加困难，因为我们正在实例化其构造函数中数据库类的，因此在不测试数据库类的情况下，不可能为 `User` 类编写单元测试。

<!-- If you have wrote unit tests, you know now it will be a breeze to write tests for the User class using something like Mockery or similar to create mock object for the Database. -->

如果你编写过单元测试，你知道现在使用像 Mockery 或类似的东西为 `Database` 创建模拟对象来为 `User` 类编写测试将是轻而易举的事。

<!-- ## Different Ways of Injecting Dependencies -->

## “依赖注入”的不同方式

<!-- Now that we have seen how useful Dependency Injection is, let's see different ways of injecting dependencies. There are three ways you can inject dependencies: -->

现在我们已经明白“依赖注入”是多么有用了，让我们看看注入依赖项的不同方式。你可以通过三种方式注入依赖项。

<!-- * Constructor Injection
* Setter Injection
* Interface Injection -->

* 构造函数注入（Constructor Injection）
* 设置器注入（Setter Injection）
* 接口注入（Interface Injection）

<!-- ### Constructor Injection -->

### 构造函数注入

<!-- We have already seen example of Constructor Injection in above example. Constructor injection is useful when: -->

我们已经从上面的例子中看到“构造函数注入”的示例。“构造函数注入”在以下情况下很有用：

<!-- * A dependency is required and class can't work without it. By using constructor injection. we make sure all its required dependencies are passed.
* Since constructor is called only at the time of instantiating a class, we can make sure that its dependencies cant be changed during the life time of the object. -->

* 依赖是必须的，没有它类就无法工作。我们通过使用构造函数注入，确保传入了所有必须的依赖项。
* 由于构造函数只有在实例化类时才会被调用，因此我们可以确保对象的依赖项在其生命周期内不会被更改。

<!-- Constructor injection suffer from one problem though: -->

尽管构造函数注入会遇到一个问题：

<!-- * Since constructor has dependencies, it becomes rather difficult to extend/override it in child classes. -->

* 由于构造函数含有依赖项，在子类中扩展和重写它变得有点难。

<!-- ### Setter Injection -->

### 设置器注入

> 译者注：这里的“设置器”是指 Setter 方法，一般与 Getter（获取器）方法配对使用。详见 [Mutator method](https://en.wikipedia.org/wiki/Mutator_method)。

<!-- Unlike Constructor injection which makes it required to have its dependencies passed, setter injection can be used to have optional dependencies. Let's pretend that our User class doesn't require Database instance but uses optionally for certain tasks. In this case, you would use a setter method to inject the Database into the User class something like: -->

与“构造函数注入”必须传入依赖项不同，设置器注入可用于接受可选依赖项。假设我们的 `User` 类不需要 `Database` 实例，而是在某些任务中选择性使用它。在这种情况下，你将会使用设置器方法向 `User` 类注入 `Database`，如下所示：

```php
class User
{
    private $database = null;

    public function setDatabase(Database $database) {
        $this->database = $database;
    }

    public function getUsers() {
        return $this->database->getAll('users');
    }
}

$database = new Database('host', 'user', 'pass', 'dbname');
$user = new User();
$user->setDatabase($database);
$user->getUsers();
```

<!-- As you can see, here we have used setDatabase() setter function to inject Database dependency into the User class. If we needed some other dependency, we could have created one more setter method and injected in the similar fashion. -->

如你所见，这里我们使用了设置器函数 `setDatabase()` 向 `User` 类注入 `Database` 依赖。如果我们需要其他某些依赖，可以创建更多设置器方法并以同样的方式注入。

<!-- So Setter Injection is useful when: -->

因此，在如下情况下设置器注入很有用：

<!-- * A class needs optional dependencies so it can set itself up with default values or add additional functionality it needs. -->

* 一个类需要可选的依赖项，从而它能用默认值进行设置或添加它所需的其它功能。

<!-- > Notice that you could also inject dependency via public property for a class. So instead of using setter function $user->setDatabase($database);, you could also do $user->database = new Database(...); -->

> 注意，你也可以用公有属性为类注入依赖。因此可以用 `$user->database = new Database(...)` 替代设置器函数 `$user->setDatabase($database)`。

<!-- ## Interface Injection -->

## 接口注入

<!-- In this type of injection, an interface enforces the dependencies for any classes that implement it, for example: -->

在这种注入类型中，接口为实现它的任何类强制指定依赖关系，如下所示：


```php
interface someInterface {
    function getUsers(Database $database);
}
```

<!-- Now any class that needs to implement someInterface must provide Database dependency in their getUsers() methods. -->

现在任何需要实现 `someInterface` 的类必须在其 `getUsers()` 方法中提供 `Database` 依赖。

<!-- ## The Problem Again -->

## 同样的问题

<!-- So for we have seen very contrived example of injecting dependency into a simple class but in real world applications, a class might have many dependencies. It isn't all that easy to manage all those dependencies because you need to KNOW which dependencies are required by a certain class and HOW they need to be instantiated. Let's take example of setter injection: -->

对于我们所看到的示例是特意设计的，该示例将依赖注入到了一个简单的类，但是在真实世界的应用程序中，一个类可能拥有很多依赖项。管理所有依赖项并不是件容易的事，因为你需要**知道**某个类都需要哪些依赖项，以及*如何*实例化它们。让我们举个设置器注入的例子：

```php
class User
{
    private $database = null;

    public function setDatabase(Database $database) {
        $this->database = $database;
    }

    public function getUsers() {
        return $this->database->getAll('users');
    }
}
```

<!-- Since dependencies in this case are optional, we could have mistakenly written this code to get users: -->

由于该示例中的依赖项是可选的，因此我们可能会错误地编写以下代码来获取用户：

```php
$user = new User();
$user->getUsers();
```

<!-- Since we didn't know getUsers() method is actually dependent on Database class, this would have given error. You could have found that out only by going to code of User class and then realizing there is setDatabase() method that must be called before using the getUsers() method. Or let's assume further that before using database, we needed to set some type of configuration for the User class like: -->

由于我们不知道 `getUsers()` 方法实际上依赖于 `Database` 类，因此会出现错误。你可能已经发现，只有进入 `User` 类的代码才能意识到 `setDatabase()` 方法 的存在，它必须在使用 `getUsers()` 方法前调用 。

```php
$user = new User();
$user->setConfig($configArray);
```

<!-- Then again we needed to remember specific order of method calls: -->

同样我们需要牢记方法调用的特定顺序。

```php
$user = new User();
$user->setConfig($configArray);
$user->setDatabase($database);
```

<!-- So you must remember order of method calls, you can't use database if you don't setup configuration first, so you can't do: -->

因此你必须记得方法调用的顺序，如果你不先设置配置就无法使用数据库，所以你无法这样做：

```php
$user = new User();
$user->setDatabase($database);
$user->setConfig($configArray);
```

<!-- This is example for setter injection but even with constructor injection if there are many dependencies, it becomes harder to manage all of those manually and you could easily and mistakenly create more than one instances of dependencies throughout your code which would result in high memory usage. -->

这是一个设置器注入的例子，但是即便使用构造函数注入，如果有很多的依赖项，手动管理它们会变得更加困难，并且你可能会轻易和错误地在你整个代码中到创建多个依赖项实例，这将会导致高内存使用率。

<!-- You might wonder dependency injection sounded like good thing to have but these problems are not worth it. Well that's not true because there is solution to all of these problems discussed next :) -->

你可能想知道依赖注入听起来像是个好东西，但不值得用在这些问题上。这是不对的，因为接下来将要讨论所有这些问题的解决方案 :)

<!-- ## Solution - Dependency Injection Container -->

## 解决方案 - 依赖注入容器

<!-- Of course it would be difficult to manage dependencies manually; this is why you need a Dependency Injection Container. A Dependency Injection Container is something that handles dependencies for your class(es) automatically. If you have worked with Laravel or Symfony, you know that their components have dependencies on on other classes. How do they manage all of those dependencies ? Yes they use some sort of Dependency Injection Container. -->

当然，手动管理依赖项会很困难，这就是为什么你需要“依赖注入容器”的原因。“依赖注入容器”的作用是自动为你的类处理依赖项。如果你使用过 Laravel 或 Symfony，你知道它们的组件依赖于其它类。它们是如何管理所有这些依赖项的？对，它们使用了某些类似依赖注入容器的东西。

<!-- There are quite some dependency injection containers out there for PHP that can be used for this purpose or you can also write your own. Each container might have bit of different syntax but they perform the same thing under the hood. -->

[这里](http://www.sitepoint.com/php-dependency-injection-container-performance-benchmarks/)有很多适用于 PHP 的依赖注入容器可供选用，你也可以自己编写。每个容器可能有些许语法上的差异，但是它们本质上做了同样的事。

<!-- So in conclusion, you must always remove hard-coded dependencies from your code and inject them using Dependency Injection instead for its benefits and then have all the injected dependencies managed automatically for you by using some dependency injection container. -->

言而总之，你必须始终从你的代码中移除硬编码依赖项，并取而代之使用“依赖注入”注入它们，从而获益。然后使用某些依赖注入容器自动地管理所有这些注入的依赖项。

---

翻译自原文：[Dependency Injection in PHP](https://codeinphp.github.io/post/dependency-injection-in-php/)
