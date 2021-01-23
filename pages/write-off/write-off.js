// pages/write-off/write-off.js
const
  UTIL = require('../../utils/util'),
  AUTH = require('../../utils/auth'),
  OFFLINE_COURSE_SERVICE = require('../../service/offlineCourse.service')
let PAGE
Page({

  /**
   * 页面的初始数据
   */
  data: {
    empty: false,
    log: {},
    id: ''
  },
  async init(id) {

    // 获取容器
    const container = this.selectComponent('#container')

    try {

      // 检测登录
      await AUTH.loginStatus()

      // PAGE = 1

      // 获取数据
      const result = await OFFLINE_COURSE_SERVICE.writeOff(wx.getStorageSync('userInfo').id, id)
      console.log(result)
      if (result.data.length == 0) {
        this.setData({
          empty: true
        })
      } else {
        // 设置数据
        this.setData({
          log: result.data[0]
        })
      }

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
    console.log(options)
    this.init(options.id)
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