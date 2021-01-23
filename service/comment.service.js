module.exports = {

  /**
   * 评论
   */
  post(userid, course_id, comment) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getApp().globalData.url.host}/api/course/comment`,
        data: {
          course_id,
          userid,
          comment
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
   * 回复
   */
  reply(userid, comment_id, comment) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getApp().globalData.url.host}/api/course/reply`,
        data: {
          userid,
          comment,
          comment_id
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
   * 详情
   */
  detail(comment_id, userid) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getApp().globalData.url.host}/api/course/check_more`,
        data: {
          comment_id,
          userid
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
   * 获取评论列表
   */
  list(course_id, page, userid) {
    const data = {
      course_id,
      page
    }
    if (userid) data.userid = userid
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getApp().globalData.url.host}/api/course/comment_list`,
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
   * 点赞
   */
  likes(course_id, comment_id, userid) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getApp().globalData.url.host}/api/course/praise`,
        data: {
          course_id,
          userid,
          comment_id,
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