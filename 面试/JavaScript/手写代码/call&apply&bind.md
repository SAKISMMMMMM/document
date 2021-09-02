### call

```js
Function.prototype.myCall = function (ctx, ...arg) {
  let context = null;
  if (ctx === null || ctx === undefined) {
    context = window; // 指定为 null 和 undefined 的 this 值会自动指向全局对象(浏览器中为window)
  } else {
    context = Object(context); // 值为原始值（数字，字符串，布尔值）的 this 会指向该原始值的实例对象
  }

  const fn = Symbol();
  context[fn] = this;

  const result = context[fn](...arg);
  delete context[fn];

  return result;
};
```

### apply

```js
Function.prototype.myApply = function (ctx, arg = []) {
  let context = null;
  if (ctx === null || ctx === undefined) {
    context = window; // 指定为 null 和 undefined 的 this 值会自动指向全局对象(浏览器中为window)
  } else {
    context = Object(ctx); // 值为原始值（数字，字符串，布尔值）的 this 会指向该原始值的实例对象
  }

  const fn = Symbol("fn");

  context[fn] = this;
  const result = context[fn](...arg);
  delete context[fn];

  return result;
};
```

### bind

```js
Function.prototype.myBind = function (ctx, ...arg) {
  const context = ctx || window;
  const fn = Symbol();

  context[fn] = this;
  const bindFunction = function (...otherArg) {
    const argList = [...arg, ...otherArg];

    const isNew = this instanceof bindFunction;

    let result = null;
    if (isNew) {
      result = context[fn].call(this, ...argList);
    } else {
      result = context[fn](...argList);
    }
    return result;
  };

  if (this.property) {
    bindFunction.property = Object.create(this.property);
  }

  return bindFunction;
};
```
