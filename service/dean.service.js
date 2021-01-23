module.exports = {

  /**
   * 获取院长信息
   */
  get(uid) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getApp().globalData.url.host}/api/course/dean_info`,
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
   * 上传院长信息
   */
  post(uid, thumb, name, label, description = '') {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getApp().globalData.url.host}/api/course/dean_info_change`,
        method: 'POST',
        data: {
          uid,
          thumb,
          name,
          description,
          label,
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
   * 上传图片
   */
  upload(filePath) {
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: getApp().globalData.url.host + '/api/course/dean_upload',
        filePath,
        name: 'file',
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
}