const
  AUTH = require('../../utils/auth'),
  UTIL = require('../../utils/util'),
  LEVEL_SERVICE = require('../../service/system.service')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    category: {
      list: [{
        title: '导师榜',
        id: 'course'
      }, {
        title: '课程榜',
        id: 'course'
      }],
    }
  },

  /**
   * tab更改
   */
  tabChange(e) {
    this.selectAllComponents('.ranking-item')[e.detail.contentIndex].init()
  },

  /**
   * 初始化数据
   */
  init() {

    // 设置状态
    this.selectComponent('#container').status('default')

    // 初始化tab
    this.selectComponent('#tab').init(this.selectComponent('#tab').index().contentIndex)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  async onShow() {

    try {

      // 验证登录
      await AUTH.loginStatus()

      // 获取信息
      UTIL.message()

      // 初始化数据
      this.init()

      // 控制等级
      LEVEL_SERVICE.levelControl(wx.getStorageSync('userInfo').id)
    } catch (e) {

      // 初始化数据
      this.init()
    }
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
  async onPullDownRefresh() {

    // 初始化数据
    await this.selectAllComponents('.ranking-item')[this.selectComponent('#tab').index().contentIndex].init()

    // 停止下拉
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    this.selectAllComponents('.ranking-item')[this.selectComponent('#tab').index().contentIndex].onReachBottom()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

    // 分享
    return UTIL.share()
  }
})