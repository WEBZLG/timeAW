module.exports = {
  /**
   * 获取沙龙课列表
   */
  getSalonList(uid) {
    return new Promise((resolve, reject) => {
      wx.request({
        // http://cmt.chineseglory.cn/api/courseoffline/offline_more?uid=11&category_id=1&is_card=1
        // 加参数 is_card 跳进来传1 正常0 小程序传1
        url: `${getApp().globalData.url.host}/api/courseoffline/offline_more`,
        data: {
          uid: uid,
          category_id: 1,
          is_card: 1
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
