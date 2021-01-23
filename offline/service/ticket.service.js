module.exports = {
  /**
   * 顶部标签
   */
  tabList() {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getApp().globalData.url.host}/api/courseoffline/get_offline_category`,
        success: result => {
          if (result.statusCode !== 200) {
            reject(new Error('网络错误'))
          } else if (result.data.code === 1) {
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
   * 门票列表
   */
  ticketList(uid, category_id, page) {
    return new Promise((resolve, reject) => {
      wx.request({
        //http://cmt.chineseglory.cn/api/courseoffline/offline_ticket?uid=11&category_id=1
        url: `${getApp().globalData.url.host}/api/courseoffline/offline_ticket`,
        data: {
          uid,
          category_id,
          page
        },
        success: result => {
          if (result.statusCode !== 200) {
            reject(new Error('网络错误'))
          } else if (result.data.code === 1) {
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