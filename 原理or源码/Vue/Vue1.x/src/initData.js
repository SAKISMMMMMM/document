import proxy from './proxy.js'
import observe from './observe.js'
/**
 * 1、初始化 options.data
 * 2、代理 data 对象上的各个属性到 Vue 实例
 * 3、给 data 对象上的各个属性设置响应式能力
 * @param {*} vm 
 */

export default function initData (vm) {
  let { data } = vm.$options
  // 如果没有定义data 创建一个空对象
  if (!data) {
    vm._data = {}
  } else {
    vm._data = typeof data === 'function' ? data() : data
  }
  for(let key in vm._data){
    proxy(vm,'_data',key)
  }
  observe(vm._data)
}