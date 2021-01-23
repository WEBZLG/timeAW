const
  UTIL = require('../../utils/util'),
  AUTH = require('../../utils/auth'),
  MESSAGE_SERVICE = require('../../service/message.service');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    message: {},
    dateStr: null
  },

  // 时间格式化
  formatDate(timeStamp) {
    let time = new Date(timeStamp)
    let year = time.getFullYear()
    let month = time.getMonth() + 1
    let date = time.getDate()
    let hours = time.getHours()
    let minute = time.getMinutes()
    let second = time.getSeconds()

    if (month < 10) {
      month = '0' + month
    }
    if (date < 10) {
      date = '0' + date
    }
    if (hours < 10) {
      hours = '0' + hours
    }
    if (minute < 10) {
      minute = '0' + minute
    }
    if (second < 10) {
      second = '0' + second
    }
    let dateStr = year + '-' + month + '-' + date + ' ' + hours + ':' + minute + ':' + second
    this.setData({
      dateStr: dateStr
    })
  },

  /**
   * 初始化
   */
  async init() {
    // 获取容器
    const container = this.selectComponent('#container')

    try {

      // 检测登录
      await AUTH.loginStatus()

      // 获取数据
      const result = await MESSAGE_SERVICE.message(this.data.id)

      this.setData({
        message: result.data
      })
      this.formatDate(result.data.createtime * 1000)
      // 页面标题
      wx.setNavigationBarTitle({
        title: result.data.pagetitle
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
        // container.status('error', e.message)
        console.log(e.message)
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