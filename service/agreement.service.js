module.exports = {
  /**
   * 获取协议内容
   */
  get() {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getApp().globalData.url.host}/api/agreements/us_agreement`,
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
  }
}