module.exports = {

  /**
   * 上传图片
   */
  upload(id, filePath) {
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: getApp().globalData.url.host + '/api/course/upload_image',
        filePath,
        name: 'photo',
        formData: {
          id
        },
        success: result => {
          if (result.statusCode != 200) {
            reject(new Error('网络错误'))
          } else {
            result.data = JSON.parse(result.data)
            if (result.data.code == 1) {
              resolve(result.data)
            } else {
              reject(new Error(result.data.msg))
            }
          }
        }
      })
    })
  },

  /**
   * 申请升级
   */
  apply(uid, group_id) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getApp().globalData.url.host}/api/course/shop_open`,
        data: {
          uid,
          group_id
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
   * 获取海报
   */
  poster() {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getApp().globalData.url.host}/api/course/shop_poster`,
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
   * 获取背景
   */
  background() {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getApp().globalData.url.host}/api/course/shop_background`,
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
   * 列表
   */
  list(uid) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getApp().globalData.url.host}/api/course/shop_list`,
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
   * 获取详情
   */
  get(shop_id, uid) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getApp().globalData.url.host}/api/course/shop_info`,
        data: {
          shop_id,
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
}