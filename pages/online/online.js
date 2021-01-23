// pages/online/online.js
const ONLINE_SERVICE = require('../../service/online.service')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serviceList: []
  },
  // 一键拨打
  call(event) {
    console.log('一建拨打')
    wx.makePhoneCall({
			phoneNumber: event.currentTarget.dataset.phone
		})
  },
  // 一键复制
  copy(event) {
    wx.setClipboardData({
      data: event.currentTarget.dataset.detail,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {

    const container = this.selectComponent('#container')

    try {
      const list = await ONLINE_SERVICE.get()
      this.setData({
        serviceList: list.data.data2
      })
      container.status('default')
    } catch (error) {
      container.status('error')
    }


    console.log(this.data.serviceList)
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