// pages/my-order/my-order.js
const MYORDER_SERVICE =  require('../../service/myorder.service')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: [],
    page: 1,
    isShow: false
  },
  async init() {

    // console.log(wx.getStorageSync('userInfo').id)
    const container = this.selectComponent('#container')

    try {
      const result = await MYORDER_SERVICE.list(wx.getStorageSync('userInfo').id, this.data.page)
      console.log(result)
      this.setData({
        orderList: result.data,
        page: this.data.page + 1
      })
      container.status('default')
      // console.log(this.data.page)
    } catch (error) {
      container.status('error')
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
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
  async onReachBottom() {
    if(this.data.isShow) {
      return
    }
    wx.showLoading({
      title: '加载中',
    })
    const result = await MYORDER_SERVICE.list(wx.getStorageSync('userInfo').id, this.data.page)
    if(result.data.length == 0) {
      wx.hideLoading()
      this.setData({
        isShow: true
      })
      wx.showToast({
        title: '没有更多了',
        icon: 'none',
        duration: 2000
      })
      return
    }
    this.setData({
      orderList: this.data.orderList.concat(result.data),
      page: this.data.page + 1
    })
    wx.hideLoading()
    console.log(this.data.page)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})