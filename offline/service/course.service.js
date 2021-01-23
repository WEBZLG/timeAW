module.exports = {
  /**
   * 课程详情
   * @return {Promise}
   */
  courseInfo(uid, id) {
    return new Promise((resolve, reject) => {
      wx.request({
        //http://cmt.chineseglory.cn/api/courseoffline/coursef_info?uid=11&id=63
        url: `http://cmt.chineseglory.cn/api/courseoffline/coursef_info`,
        data: {
          uid,
          id
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