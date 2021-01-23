module.exports = {
  /**
   * 获取首页详情
   */
  detail(uid) {
    return new Promise((resolve, reject) => {
      const data = {}
      if (uid) data.uid = uid
      wx.request({
        url: `${getApp().globalData.url.host}/api/course/index`,
        data,
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