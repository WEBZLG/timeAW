module.exports = {

  /**
   * 购物车列表
   */
  cartList(uid,page) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getApp().globalData.url.host}/api/shop/shopCart`,
        data: {
          uid:uid,
          page:page
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
   * 添加购物车
   */
  addCart(uid,gid,num,sid) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getApp().globalData.url.host}/api/shop/shopCartAdd`,
        data: {
          uid:uid,
          goods_id:gid,
          goods_num:num,
          size_id:sid
        },
        success: result => {
          console.log(result)
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
   * 删除商品
   */
  reduceCart(uid,gid,nums,sid) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getApp().globalData.url.host}/api/shop/clean_cart`,
        data: {
          uid:uid,
          goods_ids:gid,
          goods_nums:nums,
          size_id:sid
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