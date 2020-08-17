# source-reader

一个方便源码阅读的命令行工具（目前仅限于js）。可以生成项目文件结构，文件外部模块依赖和文件内部模块依赖。

# 安装

``` bash
npm install -g source-reader
```

# 主要功能

## 生成项目文件结构tree

使用方法很简单

``` bash
source-reader tree
```

或者简写

``` bash
sr tree
```

即可达到以下效果：

<img src="https://raw.githubusercontent.com/brizer/graph-bed/master/img/20191016153134.png"/>

支持参数配置，底层使用[tree-cli](https://github.com/MrRaindrop/tree-cli)，故而直接查阅其文档即可。默认情况下过滤了node_modules,test文件夹，且递归层级为10。

更多例子：
过滤bin和test文件夹：

``` bash
source-reader tree --ignore bin,test
```

## 查看外部模块依赖outer

目前只支持在线查看npm包的依赖。欢迎一起参与建设。

使用方法很简单，查看当前模块（package.json所在目录）的依赖：

``` bash
source-reader outer
```

或者简写:

``` bash
sr o
```

更多例子：

查看指定库的依赖，例如`koa-views`：

``` bash
source-reader outer koa-views
```

<img src="https://raw.githubusercontent.com/brizer/graph-bed/master/img/20191022144310.png"/>


## 查看内部模块依赖inner

底层基于[madge](https://github.com/pahen/madge)，可以生成内部文件模块依赖关系。支持json、dot、svg格式。（如果需要使用svg和dot，需要首先安装[grahpviz](http://www.graphviz.org/)）。


使用方法：

参数为入口文件。

``` bash
source-reader inner index.js
```

或者简写：

``` bash
sr i index.js
```

更多例子：

生成svg图片

``` bash
source-reader inner index.js --svg ./index.svg
```

输出dot格式内容

``` bash
source-reader inner index.js --dot
```

<img src="https://raw.githubusercontent.com/brizer/graph-bed/master/img/20191022162516.png"/>

## 直接生成源码阅读文档all

使用all命令，传入入口文件，直接生成项目源码阅读文档。

``` bash
source-reader all bin/mrgx.js
```

或者简写

``` bash
sr all bin/mrgx.js
```

会在项目根目录下生成inner.svg和READ_SOURCE.md文件。

自动生成文件结构、外部模块依赖、内部模块依赖。

文件内容如下：

```

# 源码分析

## 文件结构

/Users/liufang/openSource/brizer/multi-repo-git

├── CHANGELOG.md
├── bin
|  └── mrgx.js
├── lib
|  ├── cmd
|  |  └── index.js
|  ├── commander
|  |  └── index.js
|  ├── config

directory: * file: * symboliclink: *

ignored: directory (*)

## 外部模块依赖

请在： http://npm.broofa.com?q=mrgx 查看

## 内部模块依赖

![img](./inner.svg)
  
```

## 查看使用者（按点赞数排行）

``` sh
sr used axios --page 3
```

如果需要大量使用（无token情况下github会403），请确保环境变量GITHUB_TOKEN已设置为你自己的，我会通过process.env.GITHUB_TOKEN来取。

## 查看发布npm包后的文件结构

``` sh
sr-prepublish
```

# 更新日志

[Change Log](./CHANGELOG.md)