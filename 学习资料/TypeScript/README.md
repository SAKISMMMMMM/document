### TypeScript 是什么？

TypeScript 是由微软开发的自由和开源的编程语言,是 javaScript 的一个超集,简单可以说是一个强类型的 JS 写法,在编译期间就可以发现和纠正编码错误,提高编码协同性和提高代码规范程度,提高开发效率。

### TypeScript 基础类型

##### Boolean

```typescript
const isBoolean: boolean = false;
```

##### Number

```typescript
const isNumber: number = 1;
```

##### String

```typescript
const isString: string = "1";
```

##### Symbol

```typescript
const sym = Symbol();

const obj = {
  [sym]: "symbol",
};
```

##### Array

```typescript
const list: number[] = [1, 2, 3];
// or

const list2: Array<number> = [1, 2, 3]; // 泛型写法

// or

interface Item {
  id: number;
  name: string;
}

interface ResponseData {
  total: number;
  pageNum: number;
  list: Array<Item>; // or Item[]
}

// 元组 固定个数和类型
type TupleType = [string, number, boolean];
const people = ["hr", 18, true];
```

##### Enum 枚举

```typescript
enum PeopleType {
  man, // 默认值为0
  woman = "可以自定义值",
}
let human: PeopleType = PeopleType.man; // human 0;

// 也可以反推映射
const human1 = PeopleType[0]; // man
const human2 = PeopleType["man"]; // 0
```

##### Any

在 TypeScript 中,任何类型都可以被归为 any 类型,建议非迫不得已的情况下尽量不要使用 any,不然 TypeScript 就变成了 AnyScript 了

```typescript
let anyType: any = 1; // OK
anyType = "1"; // OK
anyType = true; // OK

// 而且也允许我们进行任何操作,不需要经过检查
anyType.foo.bar; // OK
anyType.trim(); // OK
anyType(); // OK
```

##### Unknown

any 和 Unknown 是 TypeScript 的两种顶级类型,所有类型都可以赋值给 unknown

```typescript
let isUnknown: unknown;
isUnknown = true; // ok
isUnknown = 1; // ok
isUnknown = "2"; // ok
isUnknown = []; // ok

// 虽然任何变量都可以赋值给unknown类型,但是当类型为unknown的变量不能随意赋值给其他类型的变量

let isAny: any = isUnknown; // ok
let isBoolean: boolean = isUnknown; // Error
let isString: string = isUnknown; // Error
let isNumber: number = isUnknown; // Error
```

unknown 类型只能赋值给 any 和 unknown 类型本身的变量,换句话来说,就是只能赋值给任意变量的容器才能保存 unknown 类型的值

而且在对 unknown 操作的时候,一些操作不会在被认为是类型正确的,如果说 any 类型会允许任何默认设置,那 unknown 就是禁止任何设置。

```typescript
let isUnknown: unknown;

isUnknown.trim(); // Error
isUnknown(); // Error
new isUnknown(); // Error
```

##### interFace 接口

```typescript
interface UserInfo {
  id: number;
  name: string;
}

const userData: UserInfo = await axios.get("baseUrl/getUser");
```

##### 函数

```typescript
// 最普通
type anyFunction = () => any;

// 函数表达式
const fn: (a: number) => number = function (x: number): number {
  return a;
};

const fn = (x: number): number => {
  return x + 1;
};

// 函数声明
function fn(a: number): number {
  return a;
}

// 默认值
interface userInfo {
  userName: string;
  userAge: number;
}
type userList = userInfo[];

const users: userList = [];
// ?可以定义非必传值，但是设置了默认值的话就不需要定义非必传值
// 定义
function getUser(userIndex?: string): userInfo {
  return users[userIndex];
}
// 默认值
function getUser(userIndex: string = "1"): userInfo {
  return users[userIndex];
}

// promise

interface DataType {
  id: number;
  name: string;
  age: number;
}

const getData = async (id: number): Promise<DataType> => {
  // 针对 async 修饰的函数,返回的值必然是Promise类型，所以如果需要设置其返回值的类型,需要使用Promise泛型,泛型参数即为 该函数中返回的Promise的resolve函数调用时候,传入的值的类型
  return await ajax.get("/api/getData", { id });
};
// 比如
const getData = async (id: number): Promise<DataType> => {
  return new Promise((resolve: (res: DataType) => void) => {
    resolve({
      id,
      name: "小王",
      age: 18,
    });
  });
};
// 比如
const getData = async (id: number): Promise<DataType> => {
  // 虽然我们在函数中直接return 一个对象， 但是因为async 修饰， 所以该函数的返回值 依然是promise类型
  return {
    id,
    name: "小王",
    age: 18,
  };
};
```

##### 交叉类型

```typescript
interface A {
  userName: string;
  userId: number;
  userAge:string
}
interface B {
  userName: string;
  userCode: number;
  userAge:number
}

const c: A & B; // c的类型为 userName:string userId:number userCode:number userAge:never
// 为什么userAge为never? 因为不存在string & number 又为数字又为字符串的值
//返回never只有一种情况,就是函数在返回过程中,有概率抛出报错
// 例如

function getUserId(num:number):number|never {
  if(num>20){
    thorw newError('没有编号大于20的人')
  }
  return num
}

// 当含有函数时
interface C {
  fn: (init: string) => void;
  fn1: (init: string) => string;
}

interface D {
  fn: (init: string) => string;
  fn1: (init: number) => string;
}

const E: C & D;

// 详细解释
type fn = (init:string)=>void & (init:string)=>number // 当入参相同时,返回void,以前者返回值类型为准
type fn1 = (init:string)=>string & (init:number)=>number // 当入参不相等时,入参为string则返回值为string,入参为number 则返回值为number
```

##### 联合类型

```typescript
interface user {
  id: number | string;
}
```

##### 字面量类型

```typescript
type userList = ["001", "002", "003"];

interface userInfo = {
  id: number;
  name: string;
};

type userList = {
  [num in userList]: userInfo
}

const list:userList = {
  '001':{
    id:1,
    name:'peter'
  }
}
```

##### 泛型

```typescript
type listType<T> = {
  name:<T>[]
}

const list:listType<string> = ['123']

// 带继承限制
type list2 <T extends number> = {
  name:<T>[]
}
const listEn1:list2<1|2> = [1,2] // ok
const listEn2:list2<'1'> = ['1'] // error

// 泛型可以有多个,也可以有默认值

interface ListData<T=string,P=number>{
  name:<T>
  age:<P>
  list:<P>[]
}
// 也可以用于对象和元组
interface listType<T={a:string,b:number}>{
  list:<T>
}

type list<T={a:string,b:number}>  = [T,T,T]
```

##### 安全链式调用 & 强制链式调用

```typescript
// 安全链式调用
// 普通js
a && a.b && a.b.c && a.b.c();

// ts中
a?.b?.c(); // 会被编译成上述代码  其返回值也和上述代码一样

const x: number = b.a?.set(); // 会报错， 因为b.a?.set()的返回值，不是 set函数的预期返回值 number， 而是 undefined | number

const a = {
  set: () => {
    console.log(2);
    return 3333;
  },
};

const b: { a?: { set: () => number } } = {
  a,
};

const x: number = b.a?.set(); // 会报错,因为b.a?.set()的返回值,不是 set函数的预期返回值 number, 而是 undefined | number

// 强制链式调用
const a = {
  set: () => {
    console.log(2);
    return 3333;
  },
};

const b: { a?: { set: () => number } } = {
  a,
};
const x: number = b.a!.set(); // 这里不会报错,因为ts认为这个代码肯定会调用set方法
// 如果a没有set方法,编译时不会报错，运行时报错
```

### 类型声明文件

类型声明我们可以在执行的代码中进行声明，也可以放在声明文件里面。 声明文件有两种，一种是全局声明文件(在该文件中声明的类型， 不需要导入，可以直接使用)， 模块声明文件（需要导入才能使用）

##### 全局声明文件

```typescript
// 放在任意ts includes范围里面的ts文件
declare interface AnyObj {
  [x: string]: any;
}

declare type state = 0 | 1 | 2;
```

##### 模块声明文件

```typescript
// 放在任意ts includes范围里面的ts文件
import { DataType } from "Typings";
export interface AnyObj {
  [x: string]: DataType;
}

export type state = 0 | 1 | 2;
```

#### 命名空间

命名空间主要用于我们将一些类型进行分类。比如，我们将很多组件或者方法放在了一个工程中，业务工程引入了该工程，我们在使用这个库的时候，有时候会用到库所对应功能的 类型， 比如函数的入参类型， 组件的 props 类型。 那么我们需要将方法，或者组件导出的同时也将 类型导出。 但是如果吧这些类型放在一起导出，会倒是很混乱，所以我们使用 namespace 将其分类

```typescript
// 方法1 fun1.ts
import { Fun1ArgType, Fun1ResType } from "./type.d.ts";
export default (arg: Fun1ArgType): Fun1ResType => {
  const res: Fun1ResType = doSomesting();
  return res;
};

// 方法2 fun2.ts
import { Fun2ArgType, Fun2ResType } from "./type.d.ts";
export default (arg: Fun2ArgType): Fun2ResType => {
  const res: Fun2ResType = doSomesting();
  return res;
};

// 类型声明文件 type.d.ts
export interface Fun1ArgType {
  xxx;
}
export interface Fun1ResType {
  xxx;
}
export interface Fun2ArgType {
  xxx;
}
export interface Fun2ResType {
  xxx;
}

// 导出出口
import fun1 from "./fun1.ts";
import fun2 from "./fun2.ts";

import {
  Fun1ArgType,
  Fun1ResType,
  Fun2ArgType,
  Fun2ResType,
} from "./type.d.ts";

export { fun1, fun2, Fun1ArgType, Fun1ResType, Fun2ArgType, Fun2ResType };
// 你会发现，我们除了用 type 的名字去区别, 没有对类型进行更好的归类，在使用的时候，我们很难清楚的知道该类型到底属于那个函数
```

这时候我们就可以使用 命名空间来解决这个问题了，来看代码：

```typescript
// 方法1 fun1.ts
import { Fun1ArgType, Fun1ResType } from "./type.d.ts";
export default (arg: Fun1ArgType): Fun1ResType => {
  const res: Fun1ResType = doSomesting();
  return res;
};

// 方法2 fun2.ts
import { Fun2ArgType, Fun2ResType } from "./type.d.ts";
export default (arg: Fun2ArgType): Fun2ResType => {
  const res: Fun2ResType = doSomesting();
  return res;
};

// 类型声明文件 type.d.ts
export namespace Fun1Types {
  export interface ArgType {
    a: string;
    b: number;
  }
  export type ResType = 1 | 2 | 3;
}
export namespace Fun2Types {
  export interface ArgType {
    name: string;
    id: number;
  }
  export type ResType = Array<Fun2Types.ArgType>; // 可以递归调用
}

// 导出出口
import fun1 from "./fun1.ts";
import fun2 from "./fun2.ts";

import { Fun1Types, Fun2Types } from "./type.d.ts";

export { fun1, fun2, Fun1Types, Fun2Types };
// 我们在调用方，可以导入工程，拿到Fun1Types，去使用 ， 比如

import { fun1, Fun1Types } from "toos";

const res: Fun1Types.ResType = fun1({ a: "", b: 1 }); // 其实fun1函数中声明了 返回值类型，我们不一定必须给res声明类型，ts会根据fun1的返回值自动推导出res 的类型，但是这里写上的原因是，为了让自己清楚当前值的类型
```

### 小结

## 参考文献

- [x] [(1.6w 字)浏览器灵魂之问，请问你能接得住几个？(神三元)](https://juejin.cn/post/6844904021308735502)
