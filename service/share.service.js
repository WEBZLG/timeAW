module.exports = {

  /**
   * 上传分享视频
   */
  uploadVideo(filePath) {
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: `${getApp().globalData.url.host}/api/extension/dynamic_video`,
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

  /**
   * 上传分享图片
   */
  uploadImage(filePath) {
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: `${getApp().globalData.url.host}/api/course/dean_upload`,
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

  /**
   * 收藏
   */
  favorite(uid, material_id) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getApp().globalData.url.host}/api/course/share_collect`,
        data: {
          material_id,
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
   * 取消收藏
   */
  unfavorite(uid, material_id) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getApp().globalData.url.host}/api/course/share_uncollect`,
        data: {
          material_id,
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
   * 提交分享（图片）
   */
  postImage(uid, category_id, img_urls, img_urls_thumb, content) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getApp().globalData.url.host}/api/course/dean_share_upload`,
        data: {
          uid,
          category_id,
          img_urls,
          img_urls_thumb,
          content
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
   * 提交分享（视频）
   */
  postVideo(uid, category_id, video_urls, video_fm, content) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getApp().globalData.url.host}/api/extension/video_share_upload`,
        data: {
          uid,
          category_id,
          video_urls,
          video_fm,
          content
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
   * 标签
   */
  tag() {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getApp().globalData.url.host}/api/share/category`,
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
   * 素材
   */
  material(uid, dluid, category_id, page) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getApp().globalData.url.host}/api/course/collect_list`,
        data: {
          uid,
          dluid,
          category_id,
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

  /**
   * 分类列表
   */
  list(uid, category_id, page) {
    return new Promise((resolve, reject) => {
      const data = {
        category_id,
        page
      }
      if (uid) data.uid = uid

      // 判断主营课
      const url = `${getApp().globalData.url.host}${(getApp().globalData.system.maincourse == 1) ? '/api/share/index' : '/api/share/shangxian_index'}`

      wx.request({
        url,
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
}