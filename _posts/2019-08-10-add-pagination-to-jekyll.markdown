---
layout: article
title: "为 Jekyll 博客文章列表添加分页功能"
date: 2019-08-10 02:08:31 +0800
updated: 2019-08-12 14:32:10 +0800
author: Runbing
tags:
  - jekyll
categories:
  - technology
excerpt: 随着博客文章列表变长，需要增添一个分页功能，但是在按照官方的说明尝试为 Jekyll 添加分页时，却发现并没有预期那样顺利，所以在尝试成功后，在此记录一下详细的实现步骤和注意事项。
---

随着博客文章列表变长，需要增添一个分页功能，但是在按照官方的说明尝试为 Jekyll 添加分页时，却发现并没有预期那样顺利，所以在尝试成功后，在此记录一下详细的实现步骤和注意事项。

关于“[分页](https://jekyllrb.com/docs/pagination/)（Pagination）”的启用方法，Jekyll 官方文档是这样描述的：

> Jekyll 提供了一个分页插件，这样你就可以为分页列表自动生成所需的相应文件和文件夹。
>
> 对于 Jekyll 3，需要在你的 `Gemfile` 和 `_config.yml` 中分别加入 `jekyll-paginate`。而对于 Jekyll 2，这是标准配置（不需要额外操作）。
>
> 为博客文章列表启用分页，需要在配置文件 `_config.yml` 中添加一个参数 `paginate: 5`，用来指定每一页应该显示多少篇文章。参数的值应是你想要在生成的站点中的每一页所展现文章的最大数量。
>
> 你还可以指定存放分页文件的目标路径，如 `paginate_path: "/blog/page:num/"`，这表示会读取 `/blog/index.html`，并将其作为分页器在 Liquid 模板中的每个分页页面传送，然后将输出存放在目录 `blog/page:num` 中，其中 `:num` 是分页的页码，从 `2` 开始。
>
> 假设站点有 12 篇文章，并且指定了分页参数 `paginate: 5`，那么 Jekyll 会将前 5 篇文章存到 `blog/index.html`，之后的 5 篇文章存到 `blog/page2/index.html`，最后 2 篇文章存到 `blog/page3/index.html`。

但是这样的描述并不是太详尽，导致第一次操作时遇到了一些问题，下面重新梳理一下实现过程。

## 一、分页插件的工作原理

Jekyll 是静态站点生成器，所以不论是列表、文章还是页面，其实最终都是以 HTML 文件的形式存在，分页页面当然也不例外。Jekyll 的分页功能是由分页插件 `jekyll-paginate` 实现的，当安装并配置好该插件后，就可以在读取文章列表时准备好分页数据，Jekyll 就可以利用这些数据通过带分页器的模板生成分页页面，并将这些分页页面存放到指定位置，这样就可以通过页面上页码链接切换不同分页了。

## 二、为站点配置分页插件

我使用的是 Jekyll 3，按照官方的说明，默认是没有附带分页插件的，所以需要先在 Gem 依赖配置文件 `Gemfile` 和 Jekyll 配置文件 `_config.yml` 中分别加入 `jekyll-paginate` 以引入分页插件。

为方便测试，还需要运行 `bundle install` 为本地测试环境安装 `jekyll-paginate` 插件。这种方式是通过 `Gemfile` 文件来安装的。当然也可以直接运行如下命令来安装该插件：

```bash
gem install jekyll-paginate
```

接下来要在 Jekyll 配置文件 `_config.yml` 中添加如下两项配置：

```bash
paginate: 12
paginate_path: "/page/:num/"
```

其中参数 `paginate` 的作用是启用分页功能的同时指定每一页需要显示多少篇文章。`paginate_path` 的作用是指定读取分页模板和存放生成的分页页面文件的位置（分页的 URL 也会按此结构形式显示）。

参数 `paginate_path` 是可选的。如果没有添加它，Jekyll 会在站点根目录读取分页模板，并把生成的分页页面文件存放在目录 `/page:num/`中（`:num` 是页码数字）。以本博客为例，分页的 URL 会像这样显示 `https://runbing.me/page2/`，生成的分页页面文件会像这样存放 `/page2/index.html`。

而如果像上面那样配置，分页的 URL 则会像这样显示 `https://runbing.me/page/2/`，生成的分页页面文件会像这样存放 `/page/2/index.html`。如果你的博客在子目录中，比如 `blog`，可以像官方文档所描述的那样，把参数 `pagination_path` 的值设置为 `/blog/page:num/`。这样，Jekyll 就会从子目录 `blog` 中读取分页模板，并把分页页面文件存放在子目录中，如 `/blog/page2/index.html`。

不过想要分页正常工作，还需要特别注意 Jekyll 官方文档的一个提示信息：

> 分页在 Jekyll 站点的 Markdown 文件中不可用。分页只有在文件名为 `index.html` 的 HTML 文件中被调用才起作用。`index.html` 也可以放在由参数 `paginate_path` 指定的子目录中，并在该目录中生成分页。

也就是说只能在名为 `index.html` 的 HTML 文件中编写带分页器的模板，才能成功生成分页页面，而 Markdown 文件是不被支持的。Jekyll 默认会读取根目录的 `index.html` 作为分页页面的模板文件，如果使用参数 `paginate_path` 指定了子文件夹，则需要把模板文件 `index.html` 存放到这里面。

Jeykyll 首页文件是个名为 `index.md` 的 Markdown 文件，所以需要将其更改成 `index.html`。

## 三、为模板添加分页代码

配置完成后，还需要一个分页页面模板。分页模板通常不需要重新创建，只需要修改已有的文章列表模板（对于博客通常就是首页模板），修改文章列表的循环数组，并在其中增添“分页器”即可（所谓分页器，是指显示在文章列表下方、用来在不同分页间切换的页码链接），这样 Jekyll 就可以用它生成文章列表页面的同时附加上分页器。在开始之前，可以先熟悉一下分页插件都提供了哪些可用的分页数据：

<table style="font-size:small;">
    <thead>
        <tr>
            <th>参数</th>
            <th>解释</th>
        </tr>
        <tr>
            <td><code>paginator.page</code></td>
            <td>当前页码</td>
        </tr>
        <tr>
            <td><code>paginator.per_page</code></td>
            <td>每页文章数量</td>
        </tr>
        <tr>
            <td><code>paginator.posts</code></td>
            <td>当前页可用文章</td>
        </tr>
        <tr>
            <td><code>paginator.total_posts</code></td>
            <td>文章总数</td>
        </tr>
        <tr>
            <td><code>paginator.total_pages</code></td>
            <td>总页数</td>
        </tr>
        <tr>
            <td><code>paginator.previous_page</code></td>
            <td>上一页页码，如果没有则是 nil</td>
        </tr>
        <tr>
            <td><code>paginator.previous_page_path</code></td>
            <td>上一页路径，如果没有则是 nil</td>
        </tr>
        <tr>
            <td><code>paginator.next_page</code></td>
            <td>下一页页码，如果没有则是 nil</td>
        </tr>
        <tr>
            <td><code>paginator.next_page_path</code></td>
            <td>下一页路径，如果没有则是 nil</td>
        </tr>
    </thead>
</table>

我使用的是 Jekyll 的默认模板 `minima`，默认情况下它调用的是 Gem 包中的模板资源，为了修改文章列表模板，需要把 Gem 包中的模板文件拷贝到站点的根目录。通过以下命令打开 `minima` 的 Gem 包：

```bash
open $(bundle show minima)
```

然后将其中的 `_layouts` 文件夹拷贝到站点根目录。这里面包含一个名为 `home.html` 的模板文件，站点根目录的 `index.html` 就是调用它展现文章列表的，修改它就可以覆盖默认的文章列表模板。

以下是 `home.html` 原有的代码，可以看到只是一个简单的文章列表循环输出：

{% raw %}
```html
---
layout: default
---

<div class="home">
  {%- if page.title -%}
    <h1 class="page-heading">{{ page.title }}</h1>
  {%- endif -%}

  {{ content }}

  {%- if site.posts.size > 0 -%}
    <h2 class="post-list-heading">{{ page.list_title | default: "Posts" }}</h2>
    <ul class="post-list">
      {%- for post in site.posts -%}
      <li>
        {%- assign date_format = site.minima.date_format | default: "%b %-d, %Y" -%}
        <span class="post-meta">{{ post.date | date: date_format }}</span>
        <h3>
          <a class="post-link" href="{{ post.url | relative_url }}">
            {{ post.title | escape }}
          </a>
        </h3>
        {%- if site.show_excerpts -%}
          {{ post.excerpt }}
        {%- endif -%}
      </li>
      {%- endfor -%}
    </ul>

    <p class="rss-subscribe">subscribe <a href="{{ "/feed.xml" | relative_url }}">via RSS</a></p>
  {%- endif -%}

</div>
```
{% endraw %}

这块代码需要改动两处。一处是把循环输出文章的数组 `site.posts` 改成 `paginator.posts`，意思是输出每个分页的文章列表而不是全站的。另一处是增加分页器相关代码，这里直接使用了 Jekyll 官方文档提供的代码，也就是 `<div class="pagination">...</div>` 这块代码。改好后如下所示：

{% raw %}
```html
---
layout: default
---

<div class="home">
  {%- if page.title -%}
    <h1 class="page-heading">{{ page.title }}</h1>
  {%- endif -%}

  {{ content }}

  {%- if site.posts.size > 0 -%}
    <h2 class="post-list-heading">{{ page.list_title | default: "Posts" }}</h2>
    <ul class="post-list">
      {% for post in paginator.posts %}
      <li>
        {%- assign date_format = site.minima.date_format | default: "%b %-d, %Y" -%}
        <span class="post-meta">{{ post.date | date: date_format }}</span>
        <h3>
          <a class="post-link" href="{{ post.url | relative_url }}">
            {{ post.title | escape }}
          </a>
        </h3>
        {%- if site.show_excerpts -%}
          {{ post.excerpt }}
        {%- endif -%}
      </li>
      {%- endfor -%}
    </ul>

    {% if paginator.total_pages > 1 %}
    <div class="pagination">
      {% if paginator.previous_page %}
        <a href="{{ paginator.previous_page_path | relative_url }}">&laquo; Prev</a>
      {% else %}
        <span>&laquo; Prev</span>
      {% endif %}
      <small>｜</small>

      {% for page in (1..paginator.total_pages) %}
        {% if page == paginator.page %}
          {{ page }}
        {% elsif page == 1 %}
          <a href="{{ paginator.previous_page_path | relative_url }}">{{ page }}</a>
        {% else %}
          <a href="{{ site.paginate_path | relative_url | replace: ':num', page }}">{{ page }}</a>
        {% endif %}
        <small>｜</small>
      {% endfor %}

      {% if paginator.next_page %}
        <a href="{{ paginator.next_page_path | relative_url }}">Next &raquo;</a>
      {% else %}
        <span>Next &raquo;</span>
      {% endif %}
    </div>
    {% endif %}

    <p class="rss-subscribe" style="text-align:right;">subscribe <a href="{{ "/feed.xml" | relative_url }}">via RSS</a></p>
  {%- endif -%}

</div>
```
{% endraw %}

这样 Jekyll 就可以利用分页数据通过此模板上生成分页页面，并为每个分页生成合适的页码器。

为 Jekyll 添加分页功能，简单说就两步，一是配置分页插件 `jekyll-pagination`，二是正确地添加分页模板。另外需要特别留意，要确保分页模板是名为 `index.html` 的 HTML 文件。

---

参考资料：

* [Pagination](https://jekyllrb.com/docs/pagination/)
* [How to use Jekyll-paginate without index.html?](https://stackoverflow.com/questions/46182805/how-to-use-jekyll-paginate-without-index-html)

