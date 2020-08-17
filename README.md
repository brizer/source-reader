# source-reader

[中文文档](./README_ZH.md)

A command line tool for reading source code more easier.(Only for js now.) 

Project file structure, external module dependencies, and internal file module dependencies can be generated.

# installation

``` bash
npm install -g source-reader
```


# Function

## Generate project file structure

Is very simple to use:

``` bash
source-reader tree
```

Or shorthand:

``` bash
sr tree
```


The following effects can be achieved:

<img src="https://raw.githubusercontent.com/brizer/graph-bed/master/img/20191016153134.png"/>

Support parameter configuration, the bottom layer uses [tree-cli] (https://github.com/MrRaindrop/tree-cli), so you can directly view its documentation. The `node_modules, test` folder is filtered by default, and the recursion level is `10`.

More examples:

filter the `bin and test` folders:

``` bash
source-reader tree --ignore bin,test
```

## Show the external module dependency

Only supports viewing the dependencies of the npm package online now. Welcome to work together.

It is very simple, look at the dependencies of the current module (the directory where package.json is located):

``` bash
source-reader outer
```

Or shorthand:

``` bash
sr o
```

More examples:

View the dependencies of the specified library, such as `koa-views`

``` bash
source-reader outer koa-views
```

<img src="https://raw.githubusercontent.com/brizer/graph-bed/master/img/20191022144310.png"/>

## Show the internal module dependency

The underlying layer is based on [madge] (https://github.com/pahen/madge) and can generate internal file module dependencies. Support json, dot, svg format. (If you need to use svg and dot, you need to install [grahpviz] (http://www.graphviz.org/) first).


Instructions:

The parameter is the entry file.

``` bash
source-reader inner index.js
```

Or shorthand:

``` bash
Sr i index.js
```

More examples:

Generate svg image

``` bash
source-reader inner index.js --svg ./index.svg
```

Output dot format content

``` bash
source-reader inner index.js --dot
```

<img src="https://raw.githubusercontent.com/brizer/graph-bed/master/img/20191022162516.png"/>


## generate source code document directly

Use the all command to generate the code source  document.

``` bash
source-reader all bin/mrgx.js
```

Or shorthand:

``` bash
sr all bin/mrgx.js
```

The `inner.svg` and `READ_SOURCE.md` files will be generated in the root directory of project.

Automatically generate file structure, external module dependencies, and internal module dependencies.



The content of file:

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

## Usage (order by star)

``` sh
sr used axios --page 3
```

If you need a lot of use (github will 403 if there is no token), please make sure that the environment variable `GITHUB_TOKEN` has been set to your own, I will get it through `process.env.GITHUB_TOKEN`.

## Show files after publish in npm

``` sh
sr-prepublish
```


# Changelog

[Change Log](./CHANGELOG.md)