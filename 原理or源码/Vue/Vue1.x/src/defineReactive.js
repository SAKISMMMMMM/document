import observe  from './observe.js'
import Dep from './dep.js'

/**
 * 通过 Object.defineProperty 为 obj.key 设置 getter、setter 拦截
 * @param {Object} obj 目标对象
 * @param {*} key 键值
 * @param {*} value 值
 */
export default function defineReactive(obj,key,value){

  // 递归调用 observe，处理 val 仍然为对象的情况
  const childOb = observe(value)

  // 生成订阅列表
  const dep = new Dep()

  Object.defineProperty(obj,key,{
    // getter
    get(){
      if(Dep.target){
        dep.depend()
        if(childOb){
          childOb.dep.depend()
        }
      }
      return value
    },
    set(newValue){
      console.log('setter!!!')
      // 如值没发生改变，则返回
      if(newValue=== value) return 
      value = newValue
      
      // 对新值进行响应式处理
      observe(value)

      // 数据更新，让 dep 通知自己收集的所有 watcher 执行 update 方法
      dep.notify()
    }
  })
}