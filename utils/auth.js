const UTIL = require('./util')

module.exports = {
  /**
   * 获取授权状态
   */
  getAuth(auth) {
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success: res => {
          if (res.authSetting[`scope.${auth}`] === true) {
            resolve(`${auth}:success`)
          } else if (res.authSetting[`scope.${auth}`] === false) {
            reject(new Error(`${auth}:reject`))
          } else if (res.authSetting[`scope.${auth}`] === undefined) {
            resolve(`${auth}:fail`)
          }
        }
      })
    })
  },

  /**
   * 微信登陆
   */
  login() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: res => {
          resolve(res)
        },
        fail: res => {
          reject(res)
        }
      })
    })
  },

  /**
   * 检测应用登录状态
   */
  loginStatus() {
    return new Promise(async(resolve, reject) => {

      try {

        // 获取微信用户信息授权状态
        const result = await this.getAuth('userInfo')

        // 判断登陆状态
        UTIL.check(result == 'userInfo:success' && wx.getStorageSync('userInfo').id, 'login:fail')

        // 已登录
        resolve()
      } catch (e) {

        // 未登录
        reject(new Error('login:fail'))
      }
    })
  }
}