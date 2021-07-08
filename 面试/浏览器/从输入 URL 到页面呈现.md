
#### 简单概括

1. 构建请求
2. 查看强缓存
3. DNS解析
4. 发送 HTTP 请求
5. 服务器响应
6. 解析页面

#### 构建请求

发起请求，HTTP/1.1 get


#### 查看强缓存

如有强缓存则直接读取。

#### DNS 解析过程

浏览器输入 github.com 后解析域名后得到的 IP 地址进行连接。

不指定端口的话，默认采用对应的 IP 的 80 端口。

主要解析过程：
查询 www.baidu.com
- 访问客户端 DNS 缓存：浏览器缓存 -> 系统缓存（host） -> 路由器缓存
- 访问 ISP DNS 服务器（ISP，互联网服务提供商，如联通电信），如果本地服务器有，则直接返回；如果没有，让本地 DNS 服务器去咨询查找。
- 本地去咨询 DNS 根服务器，DNS 根服务器发现是 .com 区域 管理的
- 本地去咨询 baidu.com 主域名服务器，baidu.com 域服务器查找到对应的 IP 地址，返回给本地。
- 本地服务器通知用户，baidu.com 对应的 IP 地址，把解析的结果缓存下来，下次处理直接走缓存，不需要经过 DNS解析。

#### 发送 HTTP 请求

- 建立连接：3 次握手。
- 传输数据
- 断开连接：4 次挥手。

HTTP 请求报文由 3 部分组成：请求行、请求报文 和 请求正文。

- 请求行：常用方法：GET、POST、PUT、DELETE、OPTIONS、HEAD。
- 请求报头：允许客户端向服务器传递请求的附加信息和客户端自身的信息。常见信息：Cache-Control、If-Modified-Since、If-None-Match
- 请求正文：通过 POST、PUT 等方法时时的BODY里面的数据。

#### 服务器响应

HTTP协议版本、状态码和状态描述组成。

- 状态码：
常见状态码：
1xx 指示信息-表示请求已接收；
2xx 请求成功-表示请求成功接收并解析；200（成功）、
3xx 重定向-表示要完成请求需要更进一步操作；304（请求内容有缓存，不需要更新）
4xx 客户端错误-请求有语法错误或者请求无法实现；404（网页或者文件找不到）、
5xx：服务端错误-服务端未能实现合法的请求。常见状态码：500（服务器-后端处理错误）。

- 响应报头：常见的响应报头字段 Cache-Control Content-Type Set-Cookie 等。
- 响应报文：服务器返回给浏览器的文本信息（ HTML、CSS、JS、图片等）

请求头或响应头中包含Connection:**Keep-Alive**，表示建立了持久连接，TCP连接会一直保持，之后请求统一站点的资源会复用这个连接，否则断开TCP连接, 请求-响应流程结束。

#### 解析页面

主要过程：

1. 解析 HTML，生成 DOM 树
2. 解析 CSS，生成 CSS 规则树（CSS Rule Tree）
3. 生成布局树
4. 渲染

> 16年前会生成Render Tree，也就是渲染树,chrome优化后，已经没有生成Render Tree的过程了。布局树的信息已经非常完善，完全拥有Render Tree的功能。

#### 渲染

渲染主要分为这几个步骤
- 建立图层树(Layer Tree)
- 生成绘制列表
- 生成图块并栅格化
- 发送位图给显卡，显示器显示内容

渲染过程中会引起重绘和回流，这是个面试经常会问到的问题。

- 回流

以下的操作会触发回流:

1. DOM 元素的几何属性变化，常见的几何属性有width、height、padding、margin、left、top、border 等等，会引起元素位置变化，重新布局。

2. 使 DOM 节点发生增减或者移动。

3. 读写 offset族、scroll族和client族属性的时候，浏览器为了获取这些值，需要进行回流操作。

4. 调用 window.getComputedStyle 方法。

5. 浏览器改变窗口 触发resize

回流会重新渲染 DOM 树，重新生成布局树，会把渲染流程全部走一遍，所以对资源消耗非常大。所以处理dom先关问题时，可以把多次更改dom属性的操作合并在一起进行操作，减少回流次数，减轻系统开销。

- 重绘

没有导致 DOM 几何属性的变化，不需要更新布局信息。

以下的操作会触发重绘:设置background、color、visibility、background-image等


**总结：重绘不一定导致回流，但回流一定发生了重绘。**

- 优化方式：

避免频繁使用 style，尽量采用修改class
使用createDocumentFragment 对dom进行操作后推入文档
对 resize、scroll 等进行防抖/节流处理。
使用will-change: tranform ，提升动画元素的图层，减少重绘影响元素数量。



## 参考文献

* [x] [回流和重绘(JSLiang)](https://github.com/LiangJunrong/document-library/blob/master/%E7%B3%BB%E5%88%97-%E9%9D%A2%E8%AF%95%E8%B5%84%E6%96%99/%E6%B5%8F%E8%A7%88%E5%99%A8/%E9%87%8D%E6%8E%92%E5%92%8C%E9%87%8D%E7%BB%98.md)

* [x] [从输入 URL 到页面呈现(JSLiang)](https://github.com/LiangJunrong/document-library/blob/master/%E7%B3%BB%E5%88%97-%E9%9D%A2%E8%AF%95%E8%B5%84%E6%96%99/%E6%B5%8F%E8%A7%88%E5%99%A8/%E4%BB%8E%E8%BE%93%E5%85%A5%20URL%20%E5%88%B0%E9%A1%B5%E9%9D%A2%E5%91%88%E7%8E%B0.md)

* [x] [(1.6w字)浏览器灵魂之问，请问你能接得住几个？(神三元)](https://juejin.cn/post/6844904021308735502)