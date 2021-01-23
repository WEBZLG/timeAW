module.exports = {
  /**
   * 解密用户信息
   */
  encode(code) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getApp().globalData.url.host}/api/wxxiaochengxu/getOpenid`,
        data: {
          code
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