const OBSERVE = require('../utils/observe')
module.exports = {

  /**
   * 解密
   */
  encode(openid, sessionKey, encryptedData, iv) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getApp().globalData.url.host}/api/wxxiaochengxu/getuserinfo`,
        data: {
          openid,
          sessionKey,
          encryptedData,
          iv
        },
        success: result => {
          if (result.statusCode != 200) {
            reject(new Error('网络错误'))
          } else if (result.data.code == 1) {
            result.data.data.miniapp_openid = result.data.data.openId
            resolve(result.data)
          } else {
            reject(new Error(result.data.msg))
          }
        },
        fail: result => {
          reject(new Error('网络错误'))
        }
      })
    })
  },

  /**
   * 海报
   */
  poster() {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getApp().globalData.url.host}/api/Share/inday_count_poster`,
        success: result => {
          if (result.statusCode != 200) {
            reject(new Error('网络错误'))
          } else if (result.data.code == 1) {
            // 返回数据
            resolve(result.data)
          } else {
            reject(new Error(result.data.msg))
          }
        },
        fail: result => {
          reject(new Error('网络错误'))
        }
      })
    })
  },

  /**
   * 登录
   */
  login(uid) {
    return new Promise((resolve, reject) => {
      if (uid) {
        wx.request({
          url: `${getApp().globalData.url.host}/api/Course/login`,
          data: {
            uid,
          },
          success: result => {
            if (result.statusCode != 200) {
              reject(new Error('网络错误'))
            } else if (result.data.code == 1) {

              // 返回数据
              resolve(result.data)
            } else {
              reject(new Error(result.data.msg))
            }
          },
          fail: result => {
            reject(new Error('网络错误'))
          }
        })
      } else {

        // 返回数据
        resolve()
      }
    })
  },

  /**
   * 获取用户信息
   */
  get(uid) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getApp().globalData.url.host}/api/course/user_index`,
        data: {
          uid,
        },
        success: result => {
          if (result.statusCode != 200) {
            reject(new Error('网络错误'))
          } else if (result.data.code == 1) {

            // 存储信息
            wx.setStorageSync('userInfo', result.data.data)

            // 推送信息
            OBSERVE.publish('userInfo', result.data)

            // 返回数据
            resolve(result.data)
          } else {
            reject(new Error(result.data.msg))
          }
        },
        fail: result => {
          reject(new Error('网络错误'))
        }
      })
    })
  },

  /**
   * 添加用户
   */
  post(username, password, mobile, parentid, nickname, avatar, miniapp_openid, group_id) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getApp().globalData.url.host}/api/user/miniappregister`,
        data: {
          username,
          password,
          mobile,
          parentid,
          email: '',
          nickname,
          avatar,
          miniapp_openid,
          group_id,
        },
        success: result => {
          if (result.statusCode != 200) {
            reject(new Error('网络错误'))
          } else if (result.data.code == 1) {
            resolve(result.data)
          } else {
            reject(new Error(result.data.msg))
          }
        },
        fail: result => {
          reject(new Error('网络错误'))
        }
      })
    })
  },

  /**
   * 分享权限
   */
  share(uid) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getApp().globalData.url.host}/api/course/send_share`,
        data: {
          uid,
        },
        success: result => {
          if (result.statusCode != 200) {
            reject(new Error('网络错误'))
          } else if (result.data.code == 1) {
            resolve(result.data)
          } else {
            reject(new Error(result.data.msg))
          }
        },
        fail: result => {
          reject(new Error('网络错误'))
        }
      })
    })
  },

  /**
   * 获取session
   */
  session(code) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getApp().globalData.url.host}/api/wechatsmall/xcode`,
        data: {
          code,
        },
        success: result => {
          if (result.statusCode != 200) {
            reject(new Error('网络错误'))
          } else if (result.data.openid) {
            resolve(result.data)
          } else {
            reject(new Error(result.data.msg))
          }
        },
        fail: result => {
          reject(new Error('网络错误'))
        }
      })
    })
  },

  /**
   * 判断扫一扫权限
   */
  check(uid) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getApp().globalData.url.host}/api/courseoffline/auth_check`,
        data: {
          uid,
        },
        success: result => {
          if (result.statusCode != 200) {
            reject(new Error('网络错误'))
          } else if (result.data.code == 1) {
            resolve(result.data)
          } else {
            reject(new Error(result.data.msg))
          }
        },
        fail: result => {
          reject(new Error('网络错误'))
        }
      })
    })
  },

  /**
   * 核销
   */
  ver(admin_id, userid = '', mobile = '', course_id, time_id) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getApp().globalData.url.host}/api/courseoffline/course_ver`,
        data: {
          admin_id,
          userid,
          mobile,
          course_id,
          time_id
        },
        success: result => {
          if (result.statusCode != 200) {
            reject(new Error('网络错误'))
          } else if (result.data.code == 1) {
            resolve(result.data)
          } else {
            reject(new Error(result.data.msg))
          }
        },
        fail: result => {
          reject(new Error('网络错误'))
        }
      })
    })
  },

  /**
   * 修改手机号
   */
  putPhone(mobile, code, uid) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getApp().globalData.url.host}/api/course/check_sms`,
        data: {
          mobile,
          code,
          uid,
          event: 'changemobile'
        },
        success: result => {
          if (result.statusCode != 200) {
            reject(new Error('网络错误'))
          } else if (result.data.code == 1) {
            resolve(result.data)
          } else {
            reject(new Error(result.data.msg))
          }
        },
        fail: result => {
          reject(new Error('网络错误'))
        }
      })
    })
  },

  /**
   * 获取验证码
   */
  captcha(mobile) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getApp().globalData.url.host}/api/sms/send`,
        data: {
          mobile,
          event: 'changemobile'
        },
        success: result => {
          if (result.statusCode != 200) {
            reject(new Error('网络错误'))
          } else if (result.data.code == 1) {
            resolve(result.data)
          } else {
            reject(new Error(result.data.msg))
          }
        },
        fail: result => {
          reject(new Error('网络错误'))
        }
      })
    })
  },
}