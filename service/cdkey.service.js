module.exports = {
  /**
   * 获取关于内容
   */
  // 参数 uid,type(1=>未使用,2=>已使用),page(默认1)
  get(uid, type, page) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getApp().globalData.url.host}/api/course/code_list`,
        data: {
          uid,
          type,
          page
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
  // api/course/stock_to_code
  // 兑换学习码
  exchange(uid, num) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getApp().globalData.url.host}/api/course/stock_to_code`,
        data: {
          uid,
          num
        },
        success: result => {
          if (result.statusCode != 200) {
            reject(new Error('网络错误'))
          } else if (result.data.code == 1) {
            resolve(result.data)
          } else {
            reject(result.data.msg)
          }
        },
        fail: result => {
          reject(new Error('网络错误'))
        }
      })
    })
  },
  // 复制学习码
  codeCopy(code_id) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getApp().globalData.url.host}/api/course/code_copy`,
        data: {
          code_id
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
  }
}