### new

```js
function myNew(fn, ...arg) {
  const obj = Object.create(fn.prototype);

  const result = fn.apply(fn, arg);

  return typeof result === "object" ? result : result;
}
```

### instanceOf

```js
function myInstanceOf(left, right) {
  if (typeof left !== "object" || right === null) {
    return false;
  }

  let proto = Object.getPrototypeOf(left);

  const prototype = right.prototype;

  while (true) {
    if (proto === null) {
      return false;
    }

    if (proto === prototype) {
      return true;
    }

    // 进一步迭代
    proto = Object.getPrototypeOf(proto);
  }
}
```
