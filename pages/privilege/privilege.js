const
  UTIL = require('../../utils/util'),
  AUTH = require('../../utils/auth'),
  PRIVILEGE_SERVICE = require('../../service/privilege.service')

/**
 * 权益
 * 陈浩
 * 2019/7/29
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reachbottom : true,
    poster: '', // 海报
    background: '', // 背景
    privilege: {
      list: [] // 列表
    } // 权益
  },

  /**
   * 开通
   */
  obtain() {
    wx.createSelectorQuery().select('.privilege-poster').boundingClientRect(res => {
      wx.pageScrollTo({
        scrollTop: res.height
      })
    }).exec()
  },

  /**
   * 初始化数据
   */
  async init() {

    // 获取容器
    const container = this.selectComponent('#container')

    try {

      // 检测登录
      await AUTH.loginStatus()

      // 获取数据
      const [poster, background, list] = await Promise.all([PRIVILEGE_SERVICE.poster(), PRIVILEGE_SERVICE.background(), PRIVILEGE_SERVICE.list(wx.getStorageSync('userInfo').id)])

      // 设置数据
      this.setData({
        poster: poster.data,
        background: background.data,
        'privilege.list': list.data
      })

      // 设置状态
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
  onLoad(options) {

    // 初始化数据
    this.init()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

    // 分享
    return UTIL.share()
  },

  //消失button
  onPageScroll: function (res) {
    console.log(res)
    if (res.scrollTop < 1000) {
      this.setData({ reachbottom: true })
    } else {
      this.setData({ reachbottom: false })
    }
  }
})