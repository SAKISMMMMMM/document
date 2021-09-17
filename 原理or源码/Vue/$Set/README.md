| 目录                                                                                 |
| ------------------------------------------------------------------------------------ |
| [一 目录](#chapter-one)                                                              |
| <a name="catalog-chapter-one" id="catalog-chapter-one"></a>[参考文献](#chapter-last) |

## 为什么要用$set

因为 Vue 2.x 是采用 defineProperty 来进行数据劫持的,如果需要对数据进行双向绑定,则要在 data 里初始化数据,但是现实业务中,总有一些数据会出现不能初始化的情况,这时候需要劫持数据进行双向绑定,则需要使用 Vue.set or $set

#### 使用方法

```js
this.$set(targetObject, "propertyName", "propertyVal");
// or
Vue.set(targetArray, 0, "propertyVal");
```

## 源码分析

其实 Vue.set 和 $set 都是引用一个方法,但是一个是挂在到 Vue 构造函数里,一个是挂在到原型上

```js
import { set } from "./observer/index";

// Vue.set
Vue.set = set;
// $set
Vue.prototype.$set = set;
```

来看看源码

```typescript
/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
export function set (target: Array<any> | Object, key: any, val: any): any {
  if (process.env.NODE_ENV !== 'production' &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(`Cannot set reactive property on undefined, null, or primitive value: ${(target: any)}`)
  }
  // 如果target是数组
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    // index和当前长度取大的那个
    target.length = Math.max(target.length, key)
    // 插入value值
    target.splice(key, 1, val)
    return val
  }
  // 如果key值存在,而且不是原生属性
  if (key in target && !(key in Object.prototype)) {
    // 直接更新值
    target[key] = val
    return val
  }
  // 获取__ob__
  const ob = (target: any).__ob__
  // 如果传入的是根元素则报错
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    )
    return val
  }
  // 如果不存在监听函数,则直接设置值
  if (!ob) {
    target[key] = val
    return val
  }
  // 劫持数据双向绑定
  defineReactive(ob.value, key, val)
  // 通知视图更新
  ob.dep.notify()
  return val
}
```
