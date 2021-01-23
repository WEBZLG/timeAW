module.exports = {

  /**
   * 获取课程海报详情
   */
  course(type, course_id, course_title, bigimg, coursePath, uid, nickname, avatar) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getApp().globalData.url.host}/api/wechatsmall/course_poster`,
        data: {
          type,
          course_id,
          course_title,
          bigimg,
          coursePath,
          uid,
          nickname,
          avatar
        },
        success: result => {
          if (result.statusCode != 200) {
            reject(new Error('网络错误'))
          } else if (result.data) {
            resolve(result.data)
          } else {
            reject(new Error('网络错误'))
          }
        },
        fail: result => {
          reject(new Error('网络错误'))
        }
      })
    })
  },

  /**
   * 获取普通海报详情
   */
  invite(share_id, bigimg, uid, nickname, avatar) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getApp().globalData.url.host}/api/wechatsmall/tupian_arr`,
        data: {
          share_id,
          bigimg,
          uid,
          nickname,
          avatar
        },
        success: result => {
          if (result.statusCode != 200) {
            reject(new Error('网络错误'))
          } else if (result.data) {
            resolve(result.data)
          } else {
            reject(new Error('网络错误'))
          }
        },
        fail: result => {
          reject(new Error('网络错误'))
        }
      })
    })
  },

  /**
   * 用户信息海报
   */
  userInfo(share_id, uid, nickname, avatar, bigimg) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getApp().globalData.url.host}/api/Wechatsmall/inday_count`,
        data: {
          share_id,
          uid,
          nickname,
          avatar,
          bigimg,
        },
        success: result => {
          if (result.statusCode != 200) {
            reject(new Error('网络错误'))
          } else if (result.data) {
            resolve(result.data)
          } else {
            reject(new Error('网络错误'))
          }
        },
        fail: result => {
          reject(new Error('网络错误'))
        }
      })
    })
  },

  /**
   * 获取普通海报列表
   */
  list() {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getApp().globalData.url.host}/api/share/poster`,
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