import Observer from './Observer.js'
/**
 * 通过 Observer 类为对象设置响应式能力
 * @returns Observer 实例
 */

export default function observe(data){
  // 避免无限递归
  // 当 value 不是对象直接结束递归
  if (typeof data !== 'object') return
  // 如果value 已经存在__ob__ 属性，则说明对象已经存在相应能领，则直接返回对象
  if(data.__ob__) return data.__ob__

  // 返回Observer实例
  return new Observer(data)
}