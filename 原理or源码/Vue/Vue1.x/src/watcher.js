import Dep from "./dep.js"

/**
 * 
 * @param {*} cb 回调函数，负责Dom更新的回调函数
 */
export default function Watcher(cb) {
  // 备份 cb 函数
  this._cb = cb

  // 赋值Dep.target 
  Dep.target = this

  cb()
 
  // 执行完cb回调函数，把target赋值为null
  Dep.target = null

}

/**
 * 响应式数据更新时，dep 通知 watcher 执行 update 方法，
 * 让 update 方法执行 this._cb 函数更新 DOM
 */

Watcher.prototype.update = function (){
  this._cb()
}