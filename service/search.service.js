module.exports = {

  /**
   * 清除历史信息
   */
  clearHistory(uid) {
    return new Promise((resolve, reject) => {
      const data = {}
      if (uid) {
        data.uid = uid
      }
      wx.request({
        url: `${getApp().globalData.url.host}/api/course/search_delete`,
        data: {
          uid
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
   * 搜索首页信息
   */
  infomation(uid) {
    return new Promise((resolve, reject) => {
      const data = {}
      if (uid) data.uid = uid
      wx.request({
        url: `${getApp().globalData.url.host}/api/course/search_hots`,
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
  },

  /**
   * 获取搜索列表
   */
  list(uid, keywords) {
    return new Promise((resolve, reject) => {
      const data = {
        keywords
      }
      if (uid) data.uid = uid
      wx.request({
        url: `${getApp().globalData.url.host}/api/course/search_list`,
        data,
        success: result => {
          if (result.statusCode != 200) {
            reject(new Error('网络错误'))
          } else if (result.data.code == 1) {
            if (!result.data.data) result.data.data = []
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