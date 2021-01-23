module.exports = {
  /**
   * 获取用户出卡人
   */
  list(uid) {
    return new Promise((resolve, reject) => {
      wx.request({
        // url: `${getApp().globalData.url.host}/api/course/VIP_list`,
        url: `${getApp().globalData.url.host}/api/course/get_sender`,
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
   * 使用库存购课
   */
  useStock(uid, course_ids) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getApp().globalData.url.host}/api/package/package_submit_stock`,
        data: {
          uid,
          course_ids
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
   * 原价购买单个
   */
  originalPrice(uid, course_id, openid) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getApp().globalData.url.host}/api/course/course_pay_miniapp`,
        data: {
          uid,
          course_id,
          openid
        },
        success: result => {
          if (result.statusCode != 200) {
            reject(new Error('网络错误'))
          } else if (result.data.code == 1) {
            resolve(result.data)
          } else {
            reject(result)
          }
        },
        fail: result => {
          reject(new Error('网络错误'))
        }
      })
    }) 
  },

  /**
   * 原价购买多个
   */
  originalPrices(uid, course_id, openid) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getApp().globalData.url.host}/api/course/course_pay_miniapp`,
        data: {
          uid,
          course_id,
          openid
        },
        success: result => {
          if (result.statusCode != 200) {
            reject(new Error('网络错误'))
          } else if (result.data.code == 1) {
            resolve(result.data)
          } else {
            reject(result)
          }
        },
        fail: result => {
          reject(new Error('网络错误'))
        }
      })
    }) 
  }
}