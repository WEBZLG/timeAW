// 订单相关
module.exports = {

  /**
   * 确认订单页
   * @param {number} uid 
   * @param {number} num 
   * @param {number} goods_id 
   * @param {number} size_id 
   * @param {number} address_id
   */
  checkOrder(uid, num, goods_id, size_id, address_id) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getApp().globalData.url.host}/api/shop/checkOrder`,
        data: {
          uid,
          num,
          goods_id,
          size_id,
          address_id
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
   * 订单列表
   * 全部-1 待付款0 代配送1 待签收2 已完成6 退货中4
   */
  orderList(uid, type, page) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getApp().globalData.url.host}/api/shop/myOrder`,
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
  /**
   * 订单详情
   */
  orderDetails(order_id) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getApp().globalData.url.host}/api/shop/orderDetails`,
        data: {
          order_id
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
   * 确认收货
   */
  confirmReceipt(order_id) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getApp().globalData.url.host}/api/shop/confirmReceipt`,
        data: {
          order_id
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
   * 取消订单
   * @param {*} order_id 
   */
  cancelOrder(order_id) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getApp().globalData.url.host}/api/shop/orderCancel`,
        data: {
          order_id
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
   * 物流查询
   * @param {number String} num 
   */
  logistics(num, order_id) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getApp().globalData.url.host}/api/shop/kuaidi`,
        data: {
          num,
          order_id
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
   * 订单支付
   * @param {number} uid 
   * @param {number} goods_id 
   * @param {number} num 
   * @param {number} size_id 
   * @param {number} address_id 
   * @param {string} openid 
   */
  pay(uid, goods_id, num, size_id, address_id, openid,is_cart) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getApp().globalData.url.host}/api/shop/orderEntermini`,
        data: {
          uid,
          goods_id,
          num,
          size_id,
          address_id,
          openid,
          is_cart:is_cart
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
   * 
   * @param {number} order_id 
   * @param {string} openid 
   */
  orderPay(order_id, openid) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getApp().globalData.url.host}/api/shop/nowpay_miniapp`,
        data: {
          order_id,
          openid
        },
        success: result => {
          console.log(result)
          if (result.statusCode != 200) {
            reject(new Error('网络错误'))
          } else if (result.data) {
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