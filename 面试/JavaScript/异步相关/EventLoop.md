最近阅读了 [从一道让我失眠的 Promise 面试题开始，深入分析 Promise 实现细节](https://juejin.cn/post/6945319439772434469),发现虽然基本理解了JS相关任务队列的执行顺序，但还是有许多细节存在疏漏，所以打算整理一波自己的理解，加深下对任务队列、宏、微任务的理解。

##### 先用图片理解一波

借鉴下阮一峰关于Event Loop的图片:
![主线程和任务队列示意图](https://www.ruanyifeng.com/blogimg/asset/2014/bg2014100801.jpg "主线程和任务队列示意图")

还有 Philip Roberts 演讲[Help, I’m stuck in an event-loop.](https://vimeo.com/96425312)  内的图片
![Philip Roberts：Help, I’m stuck in an event-loop](https://www.ruanyifeng.com/blogimg/asset/2014/bg2014100802.png)

从图片上简单理解，就是执行完主线程内的事件后回去检查任务队列里的任务，如果任务队列存在任务，则按顺序进入主线程执行，如此类推。


##### 再来列举下宏、微事件的分类：

|  宏任务 | 浏览器  | Node |
| ------------ | ------------ | ------------ |
|  I/O | [x]  | [x] |
|   setTimeout| [x] | [x] |
| setInterval   |[x] | [x]| 
|  setImmediate |   | [x] |
|  requestAnimationFrame | [x]  | [x] |

- requestAnimationFrame在MDN的定义为下次页面重绘前所执行的操作，且该操作晚于微任务执行。个人当做宏任务处理

|  微任务 | 浏览器  | Node |
| ------------ | ------------ | ------------ |
|  Promise| [x]  | [x] |
|  process.nextTick| [x] | [x] |
| MutationObserver   |[x] | [x]|

##### 接下来结合下代码，理解一波

先来一个简单的，理解一下常态下的执行顺序

```js
setTimeout(()=>{
  console.log('timer1')
},1000)

setTimeout(()=>{
  console.log('timer0')
},0)

new Promise(r=>{
  console.log('promise')
  r()
}).then(()=>{
  console.log('promise then')
})
```

分析一波执行顺序
- 先是整个Script作为一个宏任务执行，遇到了两个定时器，将它交给定时器线程,然后遇到Promise微任务，执行输出`promise` 然后把then回调放到微任务队列。至此第一个宏任务执行完毕。随后检查微任务队列，输出`promise then`; 微任务队列清空。

- 延迟为0 的定时器在至少4ms后推入主线程执行。输出`timer0` **W3C在HTML标准中规定，规定要求setTimeout中低于4ms的时间间隔算为4ms。**

- 延迟为1秒的定时器在1秒后推入主线程执行。输出`timer1`

**简单理解就是：（宏任务执行--->清空微任务队列）---->（下一个宏任务执行--->清空微任务队列）**

结合请求理解 

```js
console.log('script start')

new Promise(r=>{
  console.time('request Time')
  axios.get('https://movie.querydata.org/api').then(res=>r(res))
  console.log('request')
}).then(res=>{
  console.timeEnd('request Time')
  console.log('request result', res);
}).then(
  res=>console.log('1.1')
).then(
  res=>console.log('1.2')
).then(
  res=>console.log('1.3')
)

setTimeout(()=>{
  console.log('timer0s')
},0)

setTimeout(()=>{
  console.log('timer1s')
},1000)

setTimeout(()=>{
  console.log('timer2s')
},2000)

setTimeout(()=>{
  console.log('timer3s')
},3000)

new Promise(r=>{
  console.log('local promise')
  r()
}).then(()=>{
  console.log('local promise then')
})

console.log('script end')
```
**假设接口请求成功耗时是223ms**

输出结果
```
script start
request
local promise
script end
local promise then
timer0s
request Time: 223.85595703125 ms
request result
1.1
1.2
1.3
timer1s
timer2s
timer3s
```
分析一波执行顺序
- 先输出``script start``,然后执行Promise里面的,然后发起请求，把请求交给HTTP请求线程，然后往下执行，输出``request``,然后遇到4个定时器，交给定时器线程处理,接着执行Promise内的``local promise``,把then回调函数放到微任务队列，接着执行``script end``，宏任务同步代码执行完毕，检查并清空微任务队列输出``local promise then``

- 延迟为0 的定时器在至少4ms后推入主线程执行。输出`timer0`

- 接口在223ms后返回数据，推回主线程执行，输出``request Time: 223.85595703125 ms``和``request result ``,然后把then相关Promise微任务推入微任务队列并执行输出``1.1``,``1.2``,``1.3``

- 延迟为1秒的定时器在1秒后推入主线程执行。输出`timer1`

- 延迟为2秒的定时器在2秒后推入主线程执行。输出`timer2`

- 延迟为3秒的定时器在3秒后推入主线程执行。输出`timer3`

### 小结

作为常见面试题，个人感觉 Event Loop 还是必须要掌握的，其涉及的知识点非常多，特别是Promise的执行逻辑，而理解Promise的最好方法莫过于直接学习A+ 规范的Promise的实现方式。相信从原理上理解Promise后一些相关问题理解起来会更得心应手。



## 参考文献

* [x] [JavaScript 运行机制详解：再谈Event Loop(阮一峰)](https://www.ruanyifeng.com/blog/2014/10/event-loop.html)

* [x] [从一道让我失眠的 Promise 面试题开始，深入分析 Promise 实现细节(ITEM)](https://juejin.cn/post/6945319439772434469)

* [x] [JS中同步异步编程以及对宏任务、微任务的理解(是蹄蹄吖)](https://www.ruanyifeng.com/blog/2014/10/event-loop.html)

* [x] [异步系列 - Event Loop(jsliang)](https://github.com/LiangJunrong/document-library/blob/master/%E7%B3%BB%E5%88%97-%E9%9D%A2%E8%AF%95%E8%B5%84%E6%96%99/JavaScript/%E5%BC%82%E6%AD%A5%E7%B3%BB%E5%88%97/Event%20Loop.md)

* [x] [从 ECMA 规范掌握 Promise 涉及的微任务(MoonBall)](https://juejin.cn/post/6950093219153575972)