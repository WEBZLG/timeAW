const
  UTIL = require('../../utils/util'),
  AUTH = require('../../utils/auth'),
  SHARE_SERVICE = require('../../service/share.service')
/**
 * 我的素材
 * 陈浩 2019/7/16
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    category: {
      list: [{
        title: '我的收藏',
        id: 'course'
      }, {
        title: '我的动态',
        id: 'course'
      }],
    },
    tag: {
      list: [], // 列表
    }, // 标签
    userInfo: {} // 用户信息
  },

  /**
   * tab更改
   */
  tabChange(e) {

    // 初始化数据
    this.selectAllComponents('.share-material-list')[e.detail.contentIndex].init()
  },

  /**
   * 获取初始数据
   */
  async init() {

    // 获取容器
    const container = this.selectComponent('#container')

    try {

      // 检测登录
      await AUTH.loginStatus()

      // 获取数据
      const result = await SHARE_SERVICE.tag()

      // 设置数据
      this.setData({
        'tag.list': result.data,
        userInfo: wx.getStorageSync('userInfo')
      })

      // 设置状态
      container.status('default')

      // 初始化tab
      this.selectComponent('#tab').init()
    } catch (e) {

      if (e.message == 'login:fail') {

        // 跳转登录
        wx.redirectTo({
          url: getApp().globalData.pages.auth,
        })
      } else {

        // 设置状态
        // container.status('error', e.message)
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

    // 获取初始数据
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

    // 初始化数据
    this.selectAllComponents('.share-material-list')[this.selectComponent('#tab').index().contentIndex].init()

    // 停止下拉
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    this.selectAllComponents('.share-material-list')[this.selectComponent('#tab1').index().contentIndex].onReachBottom()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

    // 分享
    return UTIL.share()
  }
})