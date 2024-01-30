---
layout: article
title: "[翻译] Auryn 使用指南"
date: 2019-09-01 12:00:00 +0800
updated: 2019-11-18 16:33:23 +0800
author: Runbing
tags:
  - auryn
  - dic
  - php
categories:
  - programming
  - translation
excerpt: Auryn 是一款递归依赖注入器。使用 Auryn 引导和连接 S.O.L.I.D 和面向对象的 PHP 应用程序。
---

<!-- auryn is a recursive dependency injector. Use auryn to bootstrap and wire together
S.O.L.I.D., object-oriented PHP applications. -->

Auryn 是一款递归依赖注入器。使用 Auryn 引导和连接 S.O.L.I.D 和面向对象的 PHP 应用程序。

<!-- ## How It Works -->

## 如何工作

<!-- Among other things, auryn recursively instantiates class dependencies based on the parameter
type-hints specified in class constructor signatures. This requires the use of Reflection. You may
have heard that "reflection is slow". Let's clear something up: *anything* can be "slow" if you're
doing it wrong. Reflection is an order of magnitude faster than disk access and several orders of
magnitude faster than retrieving information (for example) from a remote database. Additionally,
each reflection offers the opportunity to cache the results if you're worried about speed. auryn
caches any reflections it generates to minimize the potential performance impact. -->

此外，Auryn 基于在类的构造函数签名中指定参数类型提示递归实例化类的依赖关系。这需要使用反射（[Reflection](https://en.wikipedia.org/wiki/Reflection_(computer_programming))）。你可能听说过“反射很慢”。让我们来澄清一些事情：如果你做错了，*任何东西*都可能“慢”。反射比访问磁盘快一个数量级，比从远程数据库检索信息（比如说）快几个数量级。另外，如果你担心速度的话，每个反射都提供了条件来缓存结果。Auryn 会缓存任何它生成的反射，来最大限度的减少潜在的性能影响。

<!-- > auryn **is NOT** a Service Locator. DO NOT turn it into one by passing the injector into your
> application classes. Service Locator is an anti-pattern; it hides class dependencies, makes code
> more difficult to maintain and makes a liar of your API! You should *only* use an injector for
> wiring together the disparate parts of your application during your bootstrap phase. -->

> Auryn **不是**服务定位器（[Service Locator](https://en.wikipedia.org/wiki/Service_locator_pattern)）。不要通过向你的应用类中传入注入器将其变成它。服务定位器是一种反面模式（[Anti-pattern](https://en.wikipedia.org/wiki/Anti-pattern)）；它隐藏了类依赖项，使得代码难以维护，并且使得你的 API 具有欺骗性！在引导阶段，你应该*只*使用一个 注入器将应用程序的不同组成部分连接在一起 。

<!-- ## The Guide -->

## 指南

<!-- **Basic Usage** -->

[**基本用法**](#基本用法)

<!-- * [Basic Instantiation](#basic-instantiation)
* [Injection Definitions](#injection-definitions)
* [Type-Hint Aliasing](#type-hint-aliasing)
* [Non-Class Parameters](#non-class-parameters)
* [Global Parameter Definitions](#global-parameter-definitions) -->

* [简单实例化](#简单实例化)
* [注入定义](#注入定义)
* [类型提示别名](#类型提示别名)
* [非类名参数](#非类名参数)
* [全局参数定义](#全局参数定义)

<!-- **Advanced Usage** -->

[**进阶用法**](#进阶用法)

<!-- * [Instance Sharing](#instance-sharing)
* [Instantiation Delegates](#instantiation-delegates)
* [Prepares and Setter Injection](#prepares-and-setter-injection)
* [Injecting for Execution](#injecting-for-execution)
* [Dependency Resolution](#dependency-resolution) -->

* [实例共享](#实例共享)
* [实例化委托](#实例化委托)
* [预备与设值注入](#预备与设值注入)
* [执行注入](#执行注入)
* [依赖解析](#依赖解析)

<!-- **Example Use Cases** -->

[**用例示例**](#用例示例)

<!-- * [Avoiding Evil Singletons](#avoiding-evil-singletons)
* [Application Bootstrapping](#app-bootstrapping) -->

* [避免讨厌的单例](#避免讨厌的单例)
* [引导应用程序](#引导应用程序)


<!-- ## Requirements and Installation -->

## 必备条件和安装

<!-- - auryn requires PHP 5.3 or higher. -->

- Auryn 需要 PHP 5.3 或更高版本。

<!-- ### Installation -->

### 安装

<!-- #### Github -->

#### Github

<!-- You can clone the latest auryn iteration at anytime from the github repository: -->

你可以在任何时候从 Github 库克隆最新版本的 Auryn。

```bash
$ git clone git://github.com/rdlowrey/auryn.git
```

<!-- #### Composer -->

#### Composer

<!-- You may also use composer to include auryn as a dependency in your projects `composer.json`. The relevant package is `rdlowrey/auryn`. -->

你还可以使用 Composer 将 Auryn 作为依赖包含在你项目的 `composer.json` 文件中。相关的包是 `rdlowrey/auryn`。

<!-- Alternatively require the package using composer cli: -->

也可以使用 Composer 命令行工具获取包：

```bash
composer require rdlowrey/auryn
```

<!-- #### Manual Download -->

#### 手动下载

<!-- Archived tagged release versions are also available for manual download on the project
[tags page](https://github.com/rdlowrey/auryn/tags) -->

也可以在 [Tags 页面](https://github.com/rdlowrey/auryn/tags)手动下载归档的标记发布版本。

<!-- ## Basic Usage -->

## 基本用法

<!-- To start using the injector, simply create a new instance of the `Auryn\Injector` ("the Injector")
class: -->

要开始使用注入器，只需简单地创建一个新的 `Auryn\Injector`（以下简称 Injector）实例类：

```php
<?php
$injector = new Auryn\Injector;
```

<!-- ### Basic Instantiation -->

### 简单实例化

<!-- If a class doesn't specify any dependencies in its constructor signature there's little point in
using the Injector to generate it. However, for the sake of completeness consider that you can do
the following with equivalent results: -->

如果一个类没有在它的构造函数签名中指定任何依赖项，则使用 Injector 生成它没有任何意义。然而，为了完整起见，你可以执行以下操作以获得相同的结果：

```php
<?php
$injector = new Auryn\Injector;
$obj1 = new SomeNamespace\MyClass;
$obj2 = $injector->make('SomeNamespace\MyClass');

var_dump($obj2 instanceof SomeNamespace\MyClass); // true
```

<!-- #### Concrete Type-hinted Dependencies -->

#### 具体的类型提示依赖项

<!-- If a class only asks for concrete dependencies you can use the Injector to inject them without
specifying any injection definitions. For example, in the following scenario you can use the
Injector to automatically provision `MyClass` with the required `SomeDependency` and `AnotherDependency`
class instances: -->

如果一个类只请求具体的依赖项，你可以使用 Injector 注入它们，而不指定任何注入定义。比如，在以下场景中，你可以使用 Injector 自动为 `MyClass` 提供所需 `SomeDependency` 和 `AnotherDenpendency` 类的实例。

```php
<?php
class SomeDependency {}

class AnotherDependency {}

class MyClass {
    public $dep1;
    public $dep2;
    public function __construct(SomeDependency $dep1, AnotherDependency $dep2) {
        $this->dep1 = $dep1;
        $this->dep2 = $dep2;
    }
}

$injector = new Auryn\Injector;
$myObj = $injector->make('MyClass');

var_dump($myObj->dep1 instanceof SomeDependency); // true
var_dump($myObj->dep2 instanceof AnotherDependency); // true
```

<!-- #### Recursive Dependency Instantiation -->

#### 递归依赖实例化

<!-- One of the Injector's key attributes is that it recursively traverses class dependency trees to
instantiate objects. This is just a fancy way of saying, "if you instantiate object A which asks for
object B, the Injector will instantiate any of object B's dependencies so that B can be instantiated
and provided to A". This is perhaps best understood with a simple example. Consider the following
classes in which a `Car` asks for `Engine` and the `Engine` class has concrete dependencies of its
own: -->

Injector 的关键属性之一是以递归的方式遍历类的依赖关系树来实例化对象。这确实是一种奇怪的说法，“如果你实例化一个请求对象 B 的对象 A，Injector 会实例化任何对象 B 的依赖项，以便 B 会被实例化并提供给 A”。可能通过一个简单的例子可能最好的理解这一点。考虑如下这些类，其中 `Car` 请求 `Engine`，并且 `Engine` 类含有他自己的具体依赖项：

```php
<?php
class Car {
    private $engine;
    public function __construct(Engine $engine) {
        $this->engine = $engine;
    }
}

class Engine {
    private $sparkPlug;
    private $piston;
    public function __construct(SparkPlug $sparkPlug, Piston $piston) {
        $this->sparkPlug = $sparkPlug;
        $this->piston = $piston;
    }
}

$injector = new Auryn\Injector;
$car = $injector->make('Car');
var_dump($car instanceof Car); // true
```

<!-- ## Injection Definitions -->

## 注入定义

<!-- You may have noticed that the previous examples all demonstrated instantiation of classes with
explicit, type-hinted, concrete constructor parameters. Obviously, many of your classes won't fit
this mold. Some classes will type-hint interfaces and abstract classes. Some will specify scalar
parameters which offer no possibility of type-hinting in PHP. Still other parameters will be arrays,
etc. In such cases we need to assist the Injector by telling it exactly what we want to inject. -->

你可能已经注意到，之前的那些例子都展示了类的实例化，这些类带有显式的、类型提示的、具体的构造函数参数。显然，你的很多类不适合这种模式。有些类会类型提示接口和抽象类。有些会指定标量参数（[Scalar](https://en.wikipedia.org/wiki/Scalar_(mathematics))，[PHP 有四种标量类型](https://www.php.net/manual/en/language.types.intro.php)），这些参数在 PHP 中不提供类型提示。还有其它一些可能是数组的参数等。在这些情况下，我们需要协助 Injector，告诉它我们希望注入的确切内容。

<!-- #### Defining Class Names for Constructor Parameters -->

#### 定义构造函数参数的类名

<!-- Let's look at how to provision a class with non-concrete type-hints in its constructor signature.
Consider the following code in which a `Car` needs an `Engine` and `Engine` is an interface: -->

让我们看一下如何为一个类在其构造函数签名中提供一个非具体的类型提示。考虑如下代码，`Car` 需要 `Engine`，而 `Engine` 是一个接口。

```php
<?php
interface Engine {}

class V8 implements Engine {}

class Car {
    private $engine;
    public function __construct(Engine $engine) {
        $this->engine = $engine;
    }
}
```

<!-- To instantiate a `Car` in this case, we simply need to define an injection definition for the class
ahead of time: -->

在这种情况下为了实例化 `Car`，我们只需要提前为类定义一个注入定义。

```php
<?php
$injector = new Auryn\Injector;
$injector->define('Car', ['engine' => 'V8']);
$car = $injector->make('Car');

var_dump($car instanceof Car); // true
```

<!-- The most important points to notice here are: -->

需要注意的重要几点如下：

<!-- 1. A custom definition is an `array` whose keys match constructor parameter names
2. The values in the definition array represent the class names to inject for the specified
   parameter key -->

1. 自定义的定义是一个 `array`，其键名与构造函数的参数名相匹配。
2. 定义数组中的值表示为指定的参数键进行注入的类名。

<!-- Because the `Car` constructor parameter we needed to define was named `$engine`, our definition
specified an `engine` key whose value was the name of the class (`V8`) that we want to inject. -->

因为我们所需要定义的 `Car` 构造函数参数名为 `$engine`，我们的定义指定了一个名为键名 `engine` ，其值是我们想要注入的类名（`V8`）。

<!-- Custom injection definitions are only necessary on a per-parameter basis. For example, in the
following class we only need to define the injectable class for `$arg2` because `$arg1` specifies a
concrete class type-hint: -->

自定义的注入定义是否是必须的，取决于每个参数。比如，在下面这个类中，由于 `$arg1` 指定了一个具体类的类型提示，所以我们只需要为 `$arg2` 定义可注入的类。

```php
<?php
class MyClass {
    private $arg1;
    private $arg2;
    public function __construct(SomeConcreteClass $arg1, SomeInterface $arg2) {
        $this->arg1 = $arg1;
        $this->arg2 = $arg2;
    }
}

$injector = new Auryn\Injector;
$injector->define('MyClass', ['arg2' => 'SomeImplementationClass']);

$myObj = $injector->make('MyClass');
```

<!-- > **NOTE:** Injecting instances where an abstract class is type-hinted works in exactly the same way
as the above examples for interface type-hints. -->

> **注意：** 在类型提示的抽象类中注入实例，与上面例子为接口类型提示注入实例的方式完全相同。

<!-- #### Using Existing Instances in Injection Definitions -->

#### 在注入定义中使用已存在的实例

<!-- Injection definitions may also specify a pre-existing instance of the requisite class instead of the
string class name: -->

注入定义还可以指定一个必需类的预先存在的实例，而不是字符串类名：

```php
<?php
interface SomeInterface {}

class SomeImplementation implements SomeInterface {}

class MyClass {
    private $dependency;
    public function __construct(SomeInterface $dependency) {
        $this->dependency = $dependency;
    }
}

$injector = new Auryn\Injector;
$dependencyInstance = new SomeImplementation;
$injector->define('MyClass', [':dependency' => $dependencyInstance]);

$myObj = $injector->make('MyClass');

var_dump($myObj instanceof MyClass); // true
```

<!-- > **NOTE:** Since this `define()` call is passing raw values (as evidenced by the colon `:` usage),
you can achieve the same result by omitting the array key(s) and relying on parameter order rather
than name. Like so: `$injector->define('MyClass', [$dependencyInstance]);` -->

> **注意：** 由于这个 `difine()` 调用正在传入原始值（通过冒号 `:` 的使用作为依据），因此你能够通过省略数组键并依赖参数顺序（而非名称）得到同样的结果。像是这样：`$injector->define('MyClass', [$dependencyInstance]);`。

<!-- #### Specifying Injection Definitions On the Fly -->

#### 动态指定注入定义

<!-- You may also specify injection definitions at call-time with `Auryn\Injector::make`. Consider: -->

你也可以在实时调用时用 `Auryn\Injector::make` 指定注入定义，考虑以下情况：

```php

<?php
interface SomeInterface {}

class SomeImplementationClass implements SomeInterface {}

class MyClass {
    private $dependency;
    public function __construct(SomeInterface $dependency) {
        $this->dependency = $dependency;
    }
}

$injector = new Auryn\Injector;
$myObj = $injector->make('MyClass', ['dependency' => 'SomeImplementationClass']);

var_dump($myObj instanceof MyClass); // true
```

<!-- The above code shows how even though we haven't called  the Injector's `define` method, the
call-time specification allows us to instantiate `MyClass`. -->

以上代码展示了即便我们没有调用 Injector 的 `define` 方法，实时调用的规范也允许我们实例化 `MyClass`。

<!-- > **NOTE:** on-the-fly instantiation definitions will override a pre-defined definition for the
specified class, but only in the context of that particular call to `Auryn\Injector::make`. -->

> **注意：** 动态实例化定义会覆盖为指定类预先赋予的定义，但是仅限于对 `Auryn\Injector::make` 的特定调用的上下文中。

<!-- ## Type-Hint Aliasing -->

## 类型提示别名

<!-- Programming to interfaces is one of the most useful concepts in object-oriented design (OOD), and
well-designed code should type-hint interfaces whenever possible. But does this mean we have to
assign injection definitions for every class in our application to reap the benefits of abstracted
dependencies? Thankfully the answer to this question is, "NO."  The Injector accommodates this goal
by accepting "aliases". Consider: -->

在面向对象设计（[Object-oriented desian, OOD](https://en.wikipedia.org/wiki/Object-oriented_design)）中针对接口编程是非常有用的概念之一。设计良好的代码应该尽可能类型提示接口。但是这是否意味着我们必须在应用中为每一个类分配注入定义，以获取抽象依赖项的好处？好在这个问题的答案是“否”。Injector 通过接受“别名”来达成目标。考虑如下代码：

<!-- ```php
<?php
interface Engine {}
class V8 implements Engine {}
class Car {
    private $engine;
    public function __construct(Engine $engine) {
        $this->engine = $engine;
    }
}

$injector = new Auryn\Injector;

// Tell the Injector class to inject an instance of V8 any time
// it encounters an Engine type-hint
$injector->alias('Engine', 'V8');

$car = $injector->make('Car');
var_dump($car instanceof Car); // bool(true)
``` -->

```php
<?php
interface Engine {}
class V8 implements Engine {}
class Car {
    private $engine;
    public function __construct(Engine $engine) {
        $this->engine = $engine;
    }
}

$injector = new Auryn\Injector;

// 告诉 Injector 类随时注入 V8 的实例
// 它遇到 Engine 类型提示
$injector->alias('Engine', 'V8');

$car = $injector->make('Car');
var_dump($car instanceof Car); // bool(true)
```

<!-- In this example we've demonstrated how to specify an alias class for any occurrence of a particular
interface or abstract class type-hint. Once an implementation is assigned, the Injector will use it
to provision any parameter with a matching type-hint. -->

在这个例子中，我们演示了如何为任一存在的特定接口或抽象类的类型提示指定一个别名类。一旦分配了实现，Injector 就会用它来为任意参数提供匹配的类型提示。

<!-- > **IMPORTANT:** If an injection definition is defined for a parameter covered by an implementation
assignment, the definition takes precedence over the implementation. -->

> **重要：** 如果为实现分配所涵盖的参数定义了注入定义，则该定义优先于实现。

<!-- ## Non-Class Parameters -->

## 非类名参数

<!-- All of the previous examples have demonstrated how the Injector class instantiates parameters based
on type-hints, class name definitions and existing instances. But what happens if we want to inject
a scalar or other non-object variable into a class? First, let's establish the following behavioral
rule: -->

之前的所有示例都用来演示 Injector 类是如何实例化基于类型提示的参数、类名定义以及已存在的实例。但是如果我们希望把标量或其它非对象变量注入到类中会发生什么？首先，让我们创建如下行为规则：

<!-- > **IMPORTANT:** The Injector assumes all named-parameter definitions are class names by default. -->

> **重要：** 默认情况下 Injector 假定所有的命名参数定义都是类名。

<!-- If you want the Injector to treat a named-parameter definition as a "raw" value and not a class name,
you must prefix the parameter name in your definition with a colon character `:`. For example,
consider the following code in which we tell the Injector to share a `PDO` database connection
instance and define its scalar constructor parameters: -->

如果你希望 Injector 以“原始”值而不是类名的方式处理命名参数定义，你必须在你的定义中给参数名添加冒号 `:` 作为前缀。比如，考虑如下代码，我们告诉 Injector 共享了一个 `PDO` 数据库连接实例，并且定义它的标量构造函数参数：

```php
<?php
$injector = new Auryn\Injector;
$injector->share('PDO');
$injector->define('PDO', [
    ':dsn' => 'mysql:dbname=testdb;host=127.0.0.1',
    ':username' => 'dbuser',
    ':passwd' => 'dbpass'
]);

$db = $injector->make('PDO');
```

<!-- The colon character preceding the parameter names tells the Injector that the associated values ARE
NOT class names. If the colons had been omitted above, auryn would attempt to instantiate classes of
the names specified in the string and an exception would result. Also, note that we could just as
easily specified arrays or integers or any other data type in the above definitions. As long as the
parameter name is prefixed with a `:`, auryn will inject the value directly without attempting to
instantiate it. -->

冒号在参数名前面告诉 Injector 关联的值**不是**类名。如果上面的代码漏掉了这个冒号，Auryn 将会尝试实例化字符串中指代名称的类，并出现意外结果。此外注意，我们可以轻松在以上定义中指定数组、整数或任何其它数据类型。只要参数名以 `:` 为前缀，Auryn 将会直接注入该值而不是尝试实例化它。

<!-- > **NOTE:** As mentioned previously, since this `define()` call is passing raw values, you may opt to
assign the values by parameter order rather than name. Since PDO's first three parameters are `$dsn`,
`$username`, and `$password`, in that order, you could accomplish the same result by leaving out the
array keys, like so:
`$injector->define('PDO', ['mysql:dbname=testdb;host=127.0.0.1', 'dbuser', 'dbpass']);` -->

> **注意：** 正如之前所提到的，由于这个 `define()` 调用传入的是原始值，你可以选择按照参数顺序而不是名称来分配值。由于 PDO 头三个参数是 `$dsn`、`$username` 和 `$password`，按照这个顺序，你可以不通过数组键实现同样的结果，像这样：`$injector->define('PDO', ['mysql:dbname=testdb;host=127.0.0.1', 'dbuser', 'dbpass']);`

<!-- ## Global Parameter Definitions -->

## 全局参数定义

<!-- Sometimes applications may reuse the same value everywhere. However, it can be a hassle to manually
specify definitions for this sort of thing everywhere it might be used in the app. auryn mitigates
this problem by exposing the `Injector::defineParam()` method. Consider the following example ... -->

有时候应用程序可能会在任何地方重用相同的值。然而，在应用中手动在所有可能用到的地方指定定义是个麻烦事。Auryn 提供 `Injector::defineParam()` 方法缓解这个问题。考虑如下示例……

```php
<?php
$myUniversalValue = 42;

class MyClass {
    public $myValue;
    public function __construct($myValue) {
        $this->myValue = $myValue;
    }
}

$injector = new Auryn\Injector;
$injector->defineParam('myValue', $myUniversalValue);
$obj = $injector->make('MyClass');
var_dump($obj->myValue === 42); // bool(true)
```

<!-- Because we specified a global definition for `myValue`, all parameters that are not in some other
way defined (as below) that match the specified parameter name are auto-filled with the global value.
If a parameter matches any of the following criteria the global value is not used: -->

因为我们给 `myValue` 指定了一个全局定义，所有没被其它方式定义的参数（如下所示），并且与指定参数名相匹配，就会被这个全局值自动填充。如果参数符合如下任何标准，则全局值将不会被使用：

<!-- - A typehint
- A predefined injection definition
- A custom call time definition -->

- 类型提示
- 预定义的注入定义
- 自定义的调用时定义

<!-- ## Advanced Usage -->

## 进阶用法

<!-- ### Instance Sharing -->

### 实例共享

<!-- One of the more ubiquitous plagues in modern OOP is the Singleton anti-pattern. Coders looking to
limit classes to a single instance often fall into the trap of using `static` Singleton
implementations for things like configuration classes and database connections. While it's often
necessary to prevent multiple instances of a class, the Singleton method spells death to testability
and should generally be avoided. `Auryn\Injector` makes sharing class instances across contexts a
triviality while allowing maximum testability and API transparency. -->

在现代 OOP 中普遍存在的困扰之一是单例（[Singleton](https://en.wikipedia.org/wiki/Singleton_pattern)）反面模式。程序员希望将类限制为单个实例，经常会陷入使用 `static` 单例实现（如配置类和数据库连接）的陷阱。虽然经常必须防止类的多个实例，但是单例方法会有损可测试性，因此一般应该避免。`Auryn\Injector` 使得在上下文中共享类实例成为小事一桩，同时可以最大化可测试性和 API 的透明度。

<!-- Let's consider how a typical problem facing object-oriented web applications is easily solved by
wiring together your application using auryn. Here, we want to inject a single database connection
instance across multiple layers of an application. We have a controller class that asks for a
DataMapper that requires a `PDO` database connection instance: -->

让我们考虑如何通过用 Auryn 将应用连接在一起，来轻松解决一个面向对象 WEB 应用面临的典型问题。这里，我们希望在多个应用层中注入一个单个数据库连接实例。我们有一个控制器类，它请求一个需要 `PDO` 数据库连接实例的 `DataMapper`。

```php
<?php
class DataMapper {
    private $pdo;
    public function __construct(PDO $pdo) {
        $this->pdo = $pdo;
    }
}

class MyController {
    private $mapper;
    public function __construct(DataMapper $mapper) {
        $this->mapper = $mapper;
    }
}

$db = new PDO('mysql:host=localhost;dbname=mydb', 'user', 'pass');

$injector = new Auryn\Injector;
$injector->share($db);

$myController = $injector->make('MyController');
```

<!-- In the above code, the `DataMapper` instance will be provisioned with the same `PDO` database
connection instance we originally shared. This example is contrived and overly simple, but the
implication should be clear: -->

在以上代码中，为 `DataMapper` 实例提供了我们原来共享的同一 `PDO` 数据库连接实例。这个例子是特意设计的，并且过于简单，但是含意应该是清晰的：

<!-- > By sharing an instance of a class, `Auryn\Injector` will always use that instance when
> provisioning classes that type-hint the shared class. -->

> 通过共享类的实例，当为类提供类型提示共享类时，`Auryn\Injector` 会始终使用该实例。

<!-- ### A Simpler Example -->

### 一个简单的例子

<!-- Let's look at a simple proof of concept: -->

让我们看一个简单的概念验证：

```php
<?php
class Person {
    public $name = 'John Snow';
}

$injector = new Auryn\Injector;
$injector->share('Person');

$person = $injector->make('Person');
var_dump($person->name); // John Snow

$person->name = 'Arya Stark';

$anotherPerson = $injector->make('Person');
var_dump($anotherPerson->name); // Arya Stark
var_dump($person === $anotherPerson); // bool(true) because it's the same instance!
```

<!-- Defining an object as shared will store the provisioned instance in the Injector's shared cache and
all future requests to the provider for an injected instance of that class will return the
originally created object. Note that in the above code, we shared the class name (`Person`)
instead of an actual instance. Sharing works with either a class name or an instance of a class.
The difference is that when you specify a class name, the Injector
will cache the shared instance the first time it is asked to create it. -->

将一个对象定义为共享，会把所提供的实例存储在 Injector 的共享缓存中，将来所有向提供者请求这个类的注入实例，都将返回原来所创建的对象。注意在以上代码中，我们所共享的是类名（`Persion`），而不是真正的实例。共享既可作用于类名也可作用于类的实例。不同之处在于当你指定类名时，Injector 会在第一次请求创建共享实例时将其进行缓存。

<!-- > **NOTE:** Once the Injector caches a shared instance, call-time definitions passed to
`Auryn\Injector::make` will have no effect. Once shared, an instance will always be returned for
instantiations of its type until the object is un-shared or refreshed: -->

> **注意：** 一旦 Injector 缓存了共享实例，传递到 `Auryn\Injector::make` 的实时调用定义将会无效。一旦共享，实例将始终返回其类型的实例化，直到取消共享或刷新对象为止。

<!-- ## Instantiation Delegates -->

## 实例化委托

<!-- Often factory classes/methods are used to prepare an object for use after instantiation. auryn
allows you to integrate factories and builders directly into the injection process by specifying
callable instantiation delegates on a per-class basis. Let's look at a very basic example to
demonstrate the concept of injection delegates: -->

通常，工厂类或方法被用于准备实例化后使用的对象。Auryn 允许你通过在每个类的基础上指定可调用的实例化委托，将工厂和构建器直接集成到注入过程中。让我们看一个非常简单的示例来演示注入委托的原理：

```php
<?php
class MyComplexClass {
    public $verification = false;
    public function doSomethingAfterInstantiation() {
        $this->verification = true;
    }
}

$complexClassFactory = function() {
    $obj = new MyComplexClass;
    $obj->doSomethingAfterInstantiation();

    return $obj;
};

$injector = new Auryn\Injector;
$injector->delegate('MyComplexClass', $complexClassFactory);

$obj = $injector->make('MyComplexClass');
var_dump($obj->verification); // bool(true)
```

<!-- In the above code we delegate instantiation of the `MyComplexClass` class to a closure,
`$complexClassFactory`. Once this delegation is made, the Injector will return the results of the
specified closure when asked to instantiate `MyComplexClass`. -->

在上面的代码中我们把 `MyComplexClass` 的实例 委托给了闭包 `$complexClassFactory`。委托一旦创建，Injector 将会在请求实例化 `MyComplexClass` 时返回指定闭包的结果。

<!-- ### Available Delegate Types -->

### 可用的委托类型

<!-- Any valid PHP callable may be registered as a class instantiation delegate using
`Auryn\Injector::delegate`. Additionally you may specify the name of a delegate class that
specifies an `__invoke` method and it will be automatically provisioned and have its `__invoke`
method called at delegation time. Instance methods from uninstantiated classes may also be specified
using the `['NonStaticClassName', 'factoryMethod']` construction. For example: -->

可以用 `Auryn\Injector::delegate` 将任何有效的 [PHP Callable](https://www.php.net/manual/en/language.types.callable.php) 注册成类实例化委托。另外你还能指定委托类的名字，该委托类指定一个 `__invoke` 方法，它会自动配置，在委托时调用其 `__invoke` 方法。未实例化的类的实例方法也可以使用 `['NonStaticClassName', 'factoryMethod']` 结构来指定。举个例子：

<!-- ```php
<?php
class SomeClassWithDelegatedInstantiation {
    public $value = 0;
}
class SomeFactoryDependency {}
class MyFactory {
    private $dependency;
    function __construct(SomeFactoryDependency $dep) {
        $this->dependency = $dep;
    }
    function __invoke() {
        $obj = new SomeClassWithDelegatedInstantiation;
        $obj->value = 1;
        return $obj;
    }
    function factoryMethod() {
        $obj = new SomeClassWithDelegatedInstantiation;
        $obj->value = 2;
        return $obj;
    }
}

// Works because MyFactory specifies a magic __invoke method
$injector->delegate('SomeClassWithDelegatedInstantiation', 'MyFactory');
$obj = $injector->make('SomeClassWithDelegatedInstantiation');
var_dump($obj->value); // int(1)

// This also works
$injector->delegate('SomeClassWithDelegatedInstantiation', 'MyFactory::factoryMethod');
$obj = $injector->make('SomeClassWithDelegatedInstantiation');
$obj = $injector->make('SomeClassWithDelegatedInstantiation');
var_dump($obj->value); // int(2)
``` -->

```php
<?php
class SomeClassWithDelegatedInstantiation {
    public $value = 0;
}
class SomeFactoryDependency {}
class MyFactory {
    private $dependency;
    function __construct(SomeFactoryDependency $dep) {
        $this->dependency = $dep;
    }
    function __invoke() {
        $obj = new SomeClassWithDelegatedInstantiation;
        $obj->value = 1;
        return $obj;
    }
    function factoryMethod() {
        $obj = new SomeClassWithDelegatedInstantiation;
        $obj->value = 2;
        return $obj;
    }
}

// 能正常工作，因为 MyFactory 指定了一个魔术方法 __invoke
$injector->delegate('SomeClassWithDelegatedInstantiation', 'MyFactory');
$obj = $injector->make('SomeClassWithDelegatedInstantiation');
var_dump($obj->value); // int(1)

// 这样同样能正常工作
$injector->delegate('SomeClassWithDelegatedInstantiation', 'MyFactory::factoryMethod');
$obj = $injector->make('SomeClassWithDelegatedInstantiation');
var_dump($obj->value); // int(2)
```

<!-- ### Prepares and Setter Injection -->

### 预备与设值注入

<!-- Constructor injection is almost always preferable to setter injection. However, some APIs require
additional post-instantiation mutations. auryn accommodates these use cases with its
`Injector::prepare()` method. Users may register any class or interface name for post-instantiation
modification. Consider: -->

构造函数注入几乎总是比设值注入（Setter Injection）更可取，然而，有些 API 需要额外的实例化后转变。Auryn 利用 `Injector::prepare()` 方法为这些用例提供了便利。用户可以注册任何类或接口名称以进行实例化后修改。考虑以下情况：

```php
<?php

class MyClass {
    public $myProperty = 0;
}

$injector->prepare('MyClass', function($myObj, $injector) {
    $myObj->myProperty = 42;
});

$myObj = $injector->make('MyClass');
var_dump($myObj->myProperty); // int(42)
```

<!-- While the above example is contrived, the usefulness should be clear. -->

尽管上面的例子是有意设计的，但好处显而易见。

<!-- ### Injecting for Execution -->

### 执行注入

<!-- In addition to provisioning class instances using constructors, auryn can also recursively instantiate
the parameters of any [valid PHP callable](http://php.net/manual/en/language.types.callable.php).
The following examples all work: -->

除了使用构造函数配置类实例之外，Auryn 还能递归实例化任何有效的 [PHP callable](http://php.net/manual/en/language.types.callable.php) 参数。以下示例都可以正常运行：

```php
<?php
$injector = new Auryn\Injector;
$injector->execute(function(){});
$injector->execute([$objectInstance, 'methodName']);
$injector->execute('globalFunctionName');
$injector->execute('MyStaticClass::myStaticMethod');
$injector->execute(['MyStaticClass', 'myStaticMethod']);
$injector->execute(['MyChildStaticClass', 'parent::myStaticMethod']);
$injector->execute('ClassThatHasMagicInvoke');
$injector->execute($instanceOfClassThatHasMagicInvoke);
$injector->execute('MyClass::myInstanceMethod');
```

<!-- Additionally, you can pass in the name of a class for a non-static method and the injector will
automatically provision an instance of the class (subject to any definitions or shared instances
already stored by the injector) before provisioning and invoking the specified method: -->

另外，你可以为非静态方法传入类名，在提供和调用指定方法前，注入器将会自动提供该类的实例（受已被注入器存储的任何定义或共享实例的约束）：

<!-- ```php
<?php
class Dependency {}
class AnotherDependency {}
class Example {
    function __construct(Dependency $dep){}
    function myMethod(AnotherDependency $arg1, $arg2) {
        return $arg2;
    }
}

$injector = new Auryn\Injector;

// outputs: int(42)
var_dump($injector->execute('Example::myMethod', $args = [':arg2' => 42]));
``` -->

```php
<?php
class Dependency {}
class AnotherDependency {}
class Example {
    function __construct(Dependency $dep){}
    function myMethod(AnotherDependency $arg1, $arg2) {
        return $arg2;
    }
}

$injector = new Auryn\Injector;

// 输出：int(42)
var_dump($injector->execute('Example::myMethod', $args = [':arg2' => 42]));
```

<!-- ### Dependency Resolution -->

### 依赖解析

<!-- `Auryn\Injector` resolves dependencies in the following order: -->

`Auryn\Injector` 按照如下顺序解析依赖：

<!-- 1. If a shared instance exists for the class in question, the shared instance will always be returned
2. If a delegate callable is assigned for a class, its return result will always be used
3. If a call-time definition is passed to `Auryn\Injector::make`, that definition will be used
4. If a pre-defined definition exists, it will be used
5. If a dependency is type-hinted, the Injector will recursively instantiate it subject to any implementations or definitions
6. If no type-hint exists and the parameter has a default value, the default value is injected
7. If a global parameter value is defined that value is used
8. Throw an exception because you did something stupid -->

1. 如果存在一个相关类的共享实例，则总是返回该共享实例。
2. 如果将一个 callable 委托分配给了类，则总会使用它们返回结果。
3. 如果一个实时调用定义被传给 `Auryn\Injector::make`，将使用该定义
4. 如果一个预定义的定义存在，将使用它
5. 如果一个依赖是类型提示，注入器将更具任何实现或定义递归实例它
6. 如果不存在类型提示并且该参数具有默认值，则注入默认值
7. 如果定义了一个全局参数值，则使用该值
8. 因为你做的一些蠢事而引发的异常

<!-- ## Example Use Cases -->

## 用例示例

<!-- Dependency Injection Containers (DIC) are generally misunderstood in the PHP community. One of the
primary culprits is the misuse of such containers in the mainstream application frameworks. Often,
these frameworks warp their DICs into Service Locator anti-patterns. This is a shame because a
good DIC should be the exact opposite of a Service Locator. -->

在 PHP 社区依赖注入容器（DIC）通常被误解。罪魁祸首之一是主流应用框架对这类容器的滥用。经常的，这些框架将它们的 DIC 扭曲为服务定位器（[Service Locator](https://en.wikipedia.org/wiki/Service_locator_pattern)）反面模式。这很可惜，因为一个良好的 DIC 与服务定位器完全相反。

<!-- ### auryn Is NOT A Service Locator! -->

### Auryn 不是一个服务定位器！

<!-- There's a galaxy of differences between using a DIC to wire together your application versus
passing the DIC as a dependency to your objects (Service Locator). Service Locator (SL) is an
anti-pattern -- it hides class dependencies, makes code difficult to maintain and makes a liar of
your API. -->

使用 DIC 连结你的应用相对于将 DIC 作为对象的依赖项传递（服务器定位器）有诸多不同。服务定位器（SL）是一个反面模式，它隐藏了类的依赖关系，使得代码难以维护，并且会欺骗你的 API。

<!-- When you pass a SL into your constructors it makes it difficult to determine what the class dependencies
really are. A `House` object depends on `Door` and `Window` objects. A `House` object DOES NOT depend
on an instance of `ServiceLocator` regardless of whether the `ServiceLocator` can provide `Door` and
`Window` objects. -->

当你向构造函数传递了 SL，会导致很难确定类的真实依赖项是什么。`House` 对象依赖 `Door` 和 `Window` 对象。`House` 对象不会依赖 `ServiceLocator` 实例，不论 `ServiceLocatior` 能否提供 `Door` 和 `Window` 对象。

<!-- In real life you wouldn't build a house by transporting the entire hardware store (hopefully) to
the construction site so you can access any parts you need. Instead, the foreman (`__construct()`)
asks for the specific parts that will be needed (`Door` and `Window`) and goes about procuring them.
Your objects should function in the same way; they should ask only for the specific dependencies
required to do their jobs. Giving the `House` access to the entire hardware store is at best poor
OOP style and at worst a maintainability nightmare. The takeaway here is this: -->

在现实生活中你不会（希望）把整个五金店运到工地上来盖房，因此你可以根据需要获取任何部件。同样的，工头（`__construct()`）询问将要用到的特定部件（`Door` 和 `window`）然后进行采购。你的对象应该以同样的方式起作用；它们应该只请求完成他们的工作所需要的特定依赖项。赋予 `House` 访问整个五金店的权限，最好的情况是糟糕的 OPP 风格，最差的情况就是可维护性的噩梦。这里的要点是：

<!-- > **IMPORTANT:** do not use auryn like a Service Locator! -->

> **重要：** 不要像服务定位器那样使用 Auryn

<!-- ### Avoiding Evil Singletons -->

### 避免讨厌的单例

<!-- A common difficulty in web applications is limiting the number of database connection instances.
It's wasteful and slow to open up new connections each time we need to talk to a database.
Unfortunately, using singletons to limit these instances makes code brittle and hard to test. Let's
see how we can use auryn to inject the same `PDO` instance across the entire scope of our application. -->

Web 应用的一个常见麻烦是限制数据库连接实例的数量。每次我们需要与数据库对话时都打开一个新的链接既慢又浪费。很不幸，使用 Singleton 来限制这些实例使得代码既脆弱又难以测试。让我们看看如何使用 Auryn 在整个应用范围内注入相同的 `PDO` 实例。

<!-- Say we have a service class that requires two separate data mappers to persist information to a database: -->

假如我们有一个服务类，它需要两个独立的数据映射器才能将信息持久化到数据库。

<!-- ```php
<?php

class HouseMapper {
    private $pdo;
    public function __construct(PDO $pdo) {
        $this->pdo = $pdo;
    }
    public function find($houseId) {
        $query = 'SELECT * FROM houses WHERE houseId = :houseId';

        $stmt = $this->pdo->prepare($query);
        $stmt->bindValue(':houseId', $houseId);

        $stmt->setFetchMode(PDO::FETCH_CLASS, 'Model\\Entities\\House');
        $stmt->execute();
        $house = $stmt->fetch(PDO::FETCH_CLASS);

        if (false === $house) {
            throw new RecordNotFoundException(
                'No houses exist for the specified ID'
            );
        }

        return $house;
    }

    // more data mapper methods here ...
}

class PersonMapper {
    private $pdo;
    public function __construct(PDO $pdo) {
        $this->pdo = $pdo;
    }
    // data mapper methods here
}

class SomeService {
    private $houseMapper;
    private $personMapper;
    public function __construct(HouseMapper $hm, PersonMapper $pm) {
        $this->houseMapper = $hm;
        $this->personMapper = $pm;
    }
    public function doSomething() {
        // do something with the mappers
    }
}
``` -->

```php
<?php

class HouseMapper {
    private $pdo;
    public function __construct(PDO $pdo) {
        $this->pdo = $pdo;
    }
    public function find($houseId) {
        $query = 'SELECT * FROM houses WHERE houseId = :houseId';

        $stmt = $this->pdo->prepare($query);
        $stmt->bindValue(':houseId', $houseId);

        $stmt->setFetchMode(PDO::FETCH_CLASS, 'Model\\Entities\\House');
        $stmt->execute();
        $house = $stmt->fetch(PDO::FETCH_CLASS);

        if (false === $house) {
            throw new RecordNotFoundException(
                'No houses exist for the specified ID'
            );
        }

        return $house;
    }
    // 这里是更多数据映射器方法
}

class PersonMapper {
    private $pdo;
    public function __construct(PDO $pdo) {
        $this->pdo = $pdo;
    }
    // 这里是数据映射器方法
}

class SomeService {
    private $houseMapper;
    private $personMapper;
    public function __construct(HouseMapper $hm, PersonMapper $pm) {
        $this->houseMapper = $hm;
        $this->personMapper = $pm;
    }
    public function doSomething() {
        // 用映射器做些什么
    }
}
```

<!-- In our wiring/bootstrap code, we simply instantiate the `PDO` instance once and share it in the
context of the `Injector`: -->

在我们的连接代码中，我们只实例化了一次 `PDO` 实例，并且将其在 `Injector` 的上下文中共享：

```php
<?php
$pdo = new PDO('sqlite:some_sqlite_file.db');
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$injector = new Auryn\Injector;

$injector->share($pdo);
$mapper = $injector->make('SomeService');
```

<!-- In the above code, the DIC instantiates our service class. More importantly, the data mapper classes
it generates to do so are injected *with the same database connection instance we originally shared*. -->

在以上代码中，DIC 实例化了我们的服务类。更重要的是，为此而生成的数据映射器类将注入*我们起初共享的同一个数据库连接实例*。

<!-- Of course, we don't have to manually instantiate our `PDO` instance. We could just as easily seed
the container with a definition for how to create the `PDO` object and let it handle things for us: -->

当然，我们不必手动实例化我们的 `PDO` 实例。我们只需要轻松地向容器植入一个定义，它负责如何创建 `PDO` 对象，并为我们处理事情：

```php
<?php
$injector->define('PDO', [
    ':dsn' => 'sqlite:some_sqlite_file.db'
]);
$injector->share('PDO');
$service = $injector->make('SomeService');
```

<!-- In the above code, the injector will pass the string definition as the `$dsn` argument in the
`PDO::__construct` method and generate the shared PDO instance automatically only if one of the
classes it instantiates requires a `PDO` instance! -->

在以上代码中，注入器将传送字符串定义作为在 `PDO::__construct` 方法中的 `$dsn` 参数，然后只在实例化类之一需要 `PDO` 实例的情况下，才自动生成共享的 `PDO` 实例！

<!-- ### App-Bootstrapping -->

### 引导应用程序

<!-- DICs should be used to wire together the disparate objects of your application into a cohesive
functional unit (generally at the bootstrap or front-controller stage of the application). One such
usage provides an elegant solution for one of the thorny problems in object-oriented (OO) web
applications: how to instantiate classes in a routed environment where the dependencies are not
known ahead of time. -->

DIC 应该用来把你应用程序中不同的对象连接在一起，形成有结合力的功能单元（一般在应用程序启动或前控制器阶段）。这样一种用法为面相对象（OO）Web 应用程序中的棘手问题之一提供了一种优雅的解决方案：如何在事先依赖关系未知的路由环境中实例化类。

<!-- Consider the following front controller code whose job is to: -->

考虑如下前控制器代码的任务：

<!-- 1. Load a list of application routes and pass them to the router
2. Generate a model of the client's HTTP request
3. Route the request instance given the application's route list
4. Instantiate the routed controller and invoke a method appropriate to the HTTP request -->

1. 加载应用程序路由列表，并将它们传递给路由器
2. 生成客户端的 HTTP 请求模型
3. 将请求实例路由到给定的应用程序路由列表
4. 实例化路由的控制器并调用一个适用于 HTTP 请求的方法

<!-- ```php
<?php

define('CONTROLLER_ROUTES', '/hard/path/to/routes.xml');

$routeLoader = new RouteLoader();
$routes = $routeLoader->loadFromXml(CONTROLLER_ROUTES);
$router = new Router($routes);

$requestDetector = new RequestDetector();
$request = $requestDetector->detectFromSuperglobal($_SERVER);

$requestUri = $request->getUri();
$requestMethod = strtolower($request->getMethod());

$injector = new Auryn\Injector;
$injector->share($request);

try {
    if (!$controllerClass = $router->route($requestUri, $requestMethod)) {
        throw new NoRouteMatchException();
    }

    $controller = $injector->make($controllerClass);
    $callableController = array($controller, $requestMethod);

    if (!is_callable($callableController)) {
        throw new MethodNotAllowedException();
    } else {
        $callableController();
    }

} catch (NoRouteMatchException $e) {
    // send 404 response
} catch (MethodNotAllowedException $e) {
    // send 405 response
} catch (Exception $e) {
    // send 500 response
}
``` -->

```php
<?php

define('CONTROLLER_ROUTES', '/hard/path/to/routes.xml');

$routeLoader = new RouteLoader();
$routes = $routeLoader->loadFromXml(CONTROLLER_ROUTES);
$router = new Router($routes);

$requestDetector = new RequestDetector();
$request = $requestDetector->detectFromSuperglobal($_SERVER);

$requestUri = $request->getUri();
$requestMethod = strtolower($request->getMethod());

$injector = new Auryn\Injector;
$injector->share($request);

try {
    if (!$controllerClass = $router->route($requestUri, $requestMethod)) {
        throw new NoRouteMatchException();
    }

    $controller = $injector->make($controllerClass);
    $callableController = array($controller, $requestMethod);

    if (!is_callable($callableController)) {
        throw new MethodNotAllowedException();
    } else {
        $callableController();
    }

} catch (NoRouteMatchException $e) {
    // 发送 404 响应
} catch (MethodNotAllowedException $e) {
    // 发送 405 响应
} catch (Exception $e) {
    // 发送 500 响应
}
```

<!-- And elsewhere we have various controller classes, each of which ask for their own individual
dependencies: -->

在其它地方，我们都有各式各样的控制器类，每个类请求各自独立的依赖项：

<!-- ```php
<?php

class WidgetController {
    private $request;
    private $mapper;
    public function __construct(Request $request, WidgetDataMapper $mapper) {
        $this->request = $request;
        $this->mapper = $mapper;
    }
    public function get() {
        // do something for HTTP GET requests
    }
    public function post() {
        // do something for HTTP POST requests
    }
}
``` -->

```php
<?php

class WidgetController {
    private $request;
    private $mapper;
    public function __construct(Request $request, WidgetDataMapper $mapper) {
        $this->request = $request;
        $this->mapper = $mapper;
    }
    public function get() {
        // 为 HTTP GET 请求执行的操作
    }
    public function post() {
        // 为 HTTP POST 请求执行的操作
    }
}
```

<!-- In the above example the auryn DIC allows us to write fully testable, fully OO controllers that ask
for their dependencies. Because the DIC recursively instantiates the dependencies of objects it
creates we have no need to pass around a Service Locator. Additionally, this example shows how we can
eliminate evil Singletons using the sharing capabilities of the auryn DIC. In the front controller
code, we share the request object so that any classes instantiated by the `Auryn\Injector` that ask
for a `Request` will receive the same instance. This feature not only helps eliminate Singletons,
but also the need for hard-to-test `static` properties. -->

在以上示例中，Auryn DIC 允许我们编写完全可测试的、完全面向对象的控制器，以请求他们的依赖项。因为 DIC 递归实例化它所创建对象的依赖关系，因此我们不需要到处传递服务定位器（Srvice Locator）。另外，这个示例展示了我们如何使用 Auryn DIC 的共享功能消灭讨厌的单例现象。在前控制器代码中，我们共享了请求对象，因此用 `Auryn\Injector` 实例化的任何类，在请求 `Request` 时都会接收相同的实例。这个特性不仅有助于消除单例现象，也不再需要难以测试的 `static` 属性。

---

原文：[https://github.com/rdlowrey/auryn](https://github.com/rdlowrey/auryn)
