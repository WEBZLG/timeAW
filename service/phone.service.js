module.exports = {

  /**
   * 获取电话号
   */
  get(iv, encryptedData, sessionKey) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getApp().globalData.url.host}/api/wechatsmall/getnumber`,
        method: 'GET',
        data: {
          iv,
          encryptedData,
          sessionKey
        },
        success: result => {
          if (result.statusCode != 200) {
            reject(new Error('网络错误'))
          } else if (result.data.phoneNumber) {
            // 返回数据
            resolve(result.data)
          } else {
            reject(new Error('网络错误'))
          }
        },
        fail: result => {
          reject(new Error('网络错误'))
        }
      })
    })
  },

  /**
   * 获取电话号
   */
  post(openid, mobile) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getApp().globalData.url.host}/api/course/member_mobile`,
        method: 'POST',
        data: {
          openid,
          mobile
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
    })
  },
}