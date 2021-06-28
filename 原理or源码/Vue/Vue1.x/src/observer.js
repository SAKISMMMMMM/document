import defineReactive from './defineReactive.js'
import observe from './observe.js'
import protoArgument from './protoArgument.js'
import Dep from './dep.js'
/**
 * 为普通对象或者数组设置响应式的入口 
 */
export default function Observer(value){
  this.dep = new Dep() // 新建订阅列表，处理订阅对象本身时的更新情况
  Object.defineProperty(value,'__ob__',{
    value:this,
    // 枚举设置为 false，禁止被枚举，
    // 1、可以在递归设置数据响应式的时候跳过 __ob__ 
    // 2、将响应式对象字符串化时也不限显示 __ob__ 对象
    enumerable:false,
    writable:true,
    configurable: true
  })

  if(Array.isArray(value)){
    // 数组响应式
    protoArgument(value)
    this.observeArray(value)
  }else{
    // 对象响应式
    this.walk(value)
  }

}
/**
 * 遍历对象每个属性，为属性设置setter和getter
 * @param {*} obj  需要遍历的对象
 */
Observer.prototype.walk = function (obj){
  for(let key in obj){
    defineReactive(obj,key,obj[key])
  }
}
/**
 * 遍历数组处理每个元素，为元素设置响应式
 * 为了处理元素为对象的情况，达到例如this.arr[index].name = xxx 是响应式
 * @param {*} arr 需要遍历的数组
 */
Observer.prototype.observeArray = function (arr){
  for(let item of arr){
    observe(item)
  }
}