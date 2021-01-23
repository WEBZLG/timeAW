const
  UTIL = require('../../../utils/util'),
  AUTH = require('../../../utils/auth'),
  ORDER_SERVICE = require('../../service/order.service')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    orderStatus: -1,
    order: {},
    goods: {},
    statusObj: {
      '0': {
        statusContent: '等待付款',
        statusColor: 'red-bg'
      },
      '-1': {
        statusContent: '取消订单',
        statusColor: 'red-bg'
      },
      '1': {
        statusContent: '待配送',
        statusColor: 'blue-bg'
      },
      '2': {
        statusContent: '等待收货',
        statusColor: 'blue-bg'
      },
      '4': {
        statusContent: '退货中',
        statusColor: 'red-bg'
      },
      '6': {
        statusContent: '已完成',
        statusColor: 'blue-bg'
      },

    }
  },

  // 跳转物流详情
  handleSeeLogistics() {
    const number = this.data.order.virtual_sn
    const order_id = this.data.order.order_id
    const virtual_name = this.data.order.virtual_name
    wx.navigateTo({
      url: `/shopping/pages/check-logistics/check-logistics?number=${number}&order_id=${order_id}&virtual_name=${virtual_name}`
    })
  },
  // 联系客服
  contactCustomerService() {
    wx.navigateTo({
      url: `/pages/online/online`
    })
  },
  // 取消订单
  cancelOrder() {
    const that = this
    wx.showModal({
      title: '确定取消订单',
      async success(res) {
        if (res.confirm) {
          try {
            wx.showLoading({
              title: '加载中',
            })
            const result = await ORDER_SERVICE.cancelOrder(that.data.order.id)
            that.init()
            wx.hideLoading()
          } catch (e) {
            wx.hideLoading()
            wx.showToast({
              title: e.message,
              icon: 'none',
              duration: 2000
            })
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 确认收货
  confirmReceipt() {
    const that = this
    wx.showModal({
      title: '是否确认收货',
      async success(res) {
        if (res.confirm) {
          try {
            wx.showLoading({
              title: '加载中',
            })
            const result = await ORDER_SERVICE.confirmReceipt(that.data.order.id)
            that.init()
            wx.hideLoading()
          } catch (e) {
            wx.hideLoading()
            wx.showToast({
              title: e.message,
              icon: 'none',
              duration: 2000
            })
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 立即付款
  async payNow() {
    try {
      wx.showLoading({
        title: '加载中'
      })
      const openid = wx.getStorageSync('userInfo').miniapp_openid
      const result = await ORDER_SERVICE.orderPay(this.data.order.id, openid)
      console.log(result)
      const res = await UTIL.requestPayment(result)
      // console.log(res)
      wx.hideLoading()
      this.init()

    } catch (e) {
      console.log(e)
      wx.showToast({
        title: '支付失败',
        icon: 'none',
        duration: 2000
      })
    }
  },
  async init(id) {

    // 获取容器
    const container = this.selectComponent('#container')

    try {

      // 检测登录
      await AUTH.loginStatus()

      // 获取数据

      const result = await ORDER_SERVICE.orderDetails(this.data.id)
      this.setData({
        order: result.data.order,
        goods: result.data.goods,
        orderStatus: result.data.order.status
      })

      // 设置状态
      // container.status(result.data.length <= 0 ? 'empty' : 'canload')
      container.status('default')
    } catch (e) {

      if (e.message == 'login:fail') {

        // 跳转登录
        wx.redirectTo({
          url: getApp().globalData.pages.auth,
        })
      } else {

        // 设置状态
        container.status('error', e.message)
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    this.init()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})