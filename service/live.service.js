module.exports = {

  /**
   * 获取列表
   */
  list(page) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getApp().globalData.url.host}/api/live/liveList`,
        data: {
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
  apply({
    real_name,
    idcard,
    mobile,
    anchor_wechat,
    user_id
  }) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getApp().globalData.url.host}/api/live/liveAnchorReview`,
        // method: "POST",
        data: {
          real_name,
          idcard,
          mobile,
          anchor_wechat,
          user_id
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
  sessionNew({
    name,
    coverImg,
    startTime,
    endTime,
    anchorName,
    anchorWechat,
    subAnchorWechat,
    createrWechat,
    shareImg,
    feedsImg,
    isFeedsPublic,
    type,
    closeLike,
    closeGoods,
    closeComment,
    closeReplay,
    closeShare,
    closeKf
  }) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `http://cm.chineseglory.cn/api/live/liveRoomcreate`,
        // method: "POST",
        data: {
          name,
          coverImg,
          startTime,
          endTime,
          anchorName,
          anchorWechat,
          subAnchorWechat,
          createrWechat,
          shareImg,
          feedsImg,
          isFeedsPublic,
          type,
          closeLike,
          closeGoods,
          closeComment,
          closeReplay,
          closeShare,
          closeKf
        },
        success: result => {
          if (result.statusCode != 200) {
            reject(new Error('网络错误'))
          } else if (result.data.errcode == 0) {
            resolve(result.data)
          } else if(result.data.errcode == 300041){
            reject(new Error('创建直播间失败，请联系客服'))
          }else{
            reject(new Error(result.data.errmsg))
          }
        },
        fail: result => {
          reject(new Error('网络错误'))
        }
      })
    })
  },

  session({
    name,
    cover_image,
    show_image,
    share_image,
    channel_image,
    start_time,
    end_time,
    anchor_name,
    anchor_wechat,
    helper_wechat,
    type,
    // screen_type,
    close_official,
    close_like,
    close_goods,
    close_comment,
    share,
    replay,
    user_id
  }) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getApp().globalData.url.host}/api/live/liveLiveroomReview`,
        // method: "POST",
        data: {
          name,
          cover_image,
          show_image,
          share_image,
          channel_image,
          start_time,
          end_time,
          anchor_name,
          anchor_wechat,
          helper_wechat,
          type,
          screen_type: 0,
          close_official,
          close_like,
          close_goods,
          close_comment,
          share,
          replay,
          user_id
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
  // url: `${getApp().globalData.url.host}/api/live/img_upload`,
  upload(filePath,type) {
    let url;
    if(type=='coverImage'){
      url = `${getApp().globalData.url.host}/api/live/getCoverMediaId`
    }else if(type=='shareImage'){
      url = `${getApp().globalData.url.host}/api/live/getShareMediaId`
    }else if(type=='channelImage'){
      url = `${getApp().globalData.url.host}/api/live/getFeedsMediaId`
    }
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: url,
        filePath,
        name: 'file',
        success: result => {
          console.log(result)
          if (result.statusCode != 200) {
            reject(new Error('网络错误'))
          } else {
            // result.data = JSON.parse(result.data)
            result.data = result.data
            resolve(result.data)
            // if (result.data.code == 1) {
            //   resolve(result.data)
            // } else {
            //   reject(new Error(result.data.msg))
            // }
          }
        },
        fail: result => {
          console.log(result)
          reject(new Error('网络错误'))
        }
      })
    })
  },

  auth(user_id) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getApp().globalData.url.host}/api/live/livePermission`,
        // method: "POST",
        data: {
          user_id
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

  qrcode() {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getApp().globalData.url.host}/api/shop/liveShareimg`,
        data: {
          uid: wx.getStorageSync('userInfo').id
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
   * 直播开关
   * 0 关 1 开
   */
  changer() {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getApp().globalData.url.host}/api/course/getConfig?id=223`,
        data: {
          
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