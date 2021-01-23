const
  UTIL = require('../../../utils/util'),
  AUTH = require('../../../utils/auth'),
  ORDER_SERVICE = require('../../service/order.service')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: null,
    goods: null,
    address: null,
    params: {}
  },
  // 跳转地址列表
  jumpAddressList() {
    const j_params = JSON.stringify(this.data.params);
    //console.log(j_params)
    wx.navigateTo({
      url: `/pages/address/address?j_params=${j_params}`
    })
  },
  // 立即支付
  async payNow() {
    let address_id = this.data.address.id
    if(address_id=="0"){
      wx.showToast({
        title: '请添加收货地址',
        icon:'none'
      })
      return false;
    }
    const openid = wx.getStorageSync('userInfo').miniapp_openid
    try {
      wx.showLoading({
        title: '加载中'
      })
      // uid, goods_id, num, size_id, address_id, openid
      const params = this.data.params
      let is_cart = params.is_cart?params.is_cart:0
      console.log(is_cart)
      const result = await ORDER_SERVICE.pay(params.uid, params.goods_id, params.num, params.size_id, this.data.address.id, openid,is_cart)
      // //console.log(result)
      const res = await UTIL.requestPayment(result.data)
      //console.log(res)
      // //console.log(res)
      if (res.errMsg = 'requestPayment:ok') {
        wx.navigateTo({
          url: `../my-order/my-order`
        })
      }
      wx.hideLoading()

    } catch (e) {
      // //console.log(e.msg)
      wx.showToast({
        title: e.message || '取消支付',
        icon: 'none',
        duration: 2000
      })
      setTimeout(() => {
        wx.navigateTo({
          url: `../my-order/my-order`
        })
      }, 2100)
    }
  },
  async init(id) {

    // 获取容器
    const container = this.selectComponent('#container')

    try {

      // 检测登录
      await AUTH.loginStatus()

      let params = this.data.params
      let address_id = this.data.address_id
      // 获取数据
      /**
       * 确认订单页
       * @param {number} uid 
       * @param {number} num 
       * @param {number} goods_id 
       * @param {number} size_id 
       * @param {number} address_id
       */
      const result = await ORDER_SERVICE.checkOrder(params.uid, params.num, params.goods_id, params.size_id, address_id)
      //console.log(result.data)
      this.setData({
        order: result.data,
        goods: result.data.goods,
        address: result.data.address
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
      params: JSON.parse(options.params)
    })
    //console.log(this.data.params)
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
  onShow: async function () {
    try {
      let params = this.data.params
      let address_id = this.data.address_id
      const result = await ORDER_SERVICE.checkOrder(params.uid, params.num, params.goods_id, params.size_id, address_id)
      //console.log(result.data)
      this.setData({
        order: result.data,
        goods: result.data.goods,
        address: result.data.address
      })
    } catch (e) {
      container.status('error', e.message)
    }
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