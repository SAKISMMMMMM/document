import initData from './initData.js'
import mount from './compiler/index.js'

export default function Vue(options) {
  this._init(options)
}

/**
 * 初始化配置对象
 * @param {*} options 
 */
 Vue.prototype._init = function (options) {
  // 将 options 配置挂载到 Vue 实例上
  this.$options = options
  // 初始化 options.data
  // 代理 data 对象上的各个属性到 Vue 实例
  // 给 data 对象上的各个属性设置响应式能力
  initData(this)

  // 如果存在 el 配置项，则调用 $mount 方法编译模版
  if (this.$options.el) {
    this.$mount()
  }

}

/**
 * 实例化Watcher
 */

Vue.prototype.$mount = function () {
  mount(this)
}

