module.exports = {
  /**
   * 获取VIP课程列表
   */
  list(uid) {
    return new Promise((resolve, reject) => {
      wx.request({
        // url: `${getApp().globalData.url.host}/api/course/VIP_list`,
        url: `${getApp().globalData.url.host}/api/package/package_list?uid`,
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
   * 购买礼包
   */
  post(uid, packageId) {
    // return new Promise((resolve, reject) => {
    //   wx.request({
    //     url: `${getApp().globalData.url.host}/api/course/VIP_list`,
    //     data: {
    //       uid,
    //     },
    //     success: result => {
    //       if (result.statusCode != 200) {
    //         reject(new Error('网络错误'))
    //       } else if (result.data.code == 1) {
    //         resolve(result.data)
    //       } else {
    //         reject(new Error(result.data.msg))
    //       }
    //     },
    //     fail: result => {
    //       reject(new Error('网络错误'))
    //     }
    //   })
    // })
  }
}