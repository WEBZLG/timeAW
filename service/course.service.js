module.exports = {

  /**
   * 兑换CDKEY
   */
  cdkey(uid, course_id, cdkey) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getApp().globalData.url.host}/api/course/course_cdkey`,
        method: 'POST',
        data: {
          uid,
          course_id,
          cdkey
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
   * 福利课兑换CDKEY
   */
  welfareCdkey(uid, course_id, cdkey) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getApp().globalData.url.host}/api/coursenew/course_cdkey`,
        method: 'POST',
        data: {
          uid,
          course_id,
          cdkey
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
   * 解锁课程
   */
  unlock(uid, course_id) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getApp().globalData.url.host}/api/course/course_unlock`,
        method: 'POST',
        data: {
          uid,
          course_id,
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
   * 申请课程
   */
  postApply(uid, course_id, other = '') {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getApp().globalData.url.host}/api/course/add_order`,
        method: 'POST',
        data: {
          uid,
          course_id,
          other
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
   * 获取申请信息
   */
  getApply(uid) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getApp().globalData.url.host}/api/course/check_first`,
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
   * 增加热度
   */
  hot(course_id, uid) {
    return new Promise((resolve, reject) => {
      if (uid) {
        wx.request({
          url: `${getApp().globalData.url.host}/api/Hot/click_course`,
          data: {
            uid,
            course_id
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
      } else {
        resolve({})
      }
    })
  },

  /**
   * 获取课程
   */
  get(course_id, uid) {
    return new Promise((resolve, reject) => {
      const data = {
        course_id
      }
      if (uid) data.uid = uid
      wx.request({
        url: `${getApp().globalData.url.host}/api/course/course_info_g`,
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
   * 获取课程列表
   */
  list(id, link, page) {
    const options = {
      nav: {
        url: `${getApp().globalData.url.host}/api/course/nav_list`,
        data: {
          nav_id: id,
          page
        }
      },
      panel: {
        url: `${getApp().globalData.url.host}/api/course/index_list`,
        data: {
          index_id: id,
          page
        }
      }
    }
    return new Promise((resolve, reject) => {
      wx.request({
        url: options[link].url,
        data: options[link].data,
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
   * 优享
   */
  enjoyment(uid) {
    return new Promise((resolve, reject) => {
      if (uid) {
        wx.request({
          url: `${getApp().globalData.url.host}/api/course/is_superior`,
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
      } else {
        resolve({
          data: 0
        })
      }
    })
  },

  /**
   * 获取我的课程
   */
  mine(uid, page) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getApp().globalData.url.host}/api/course/my_course`,
        data: {
          uid,
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
   * 提交课程进度
   */
  progress(uid, course_id, micro_id, micro_time) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getApp().globalData.url.host}/api/Course/micro_uselog`,
        data: {
          uid,
          course_id,
          micro_id,
          micro_time
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