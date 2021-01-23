const
  UTIL = require('../../utils/util'),
  AUTH = require('../../utils/auth')

/**
 * 我的团队
 * 陈浩 2020/1/3
 * 洪新 2020/07/22
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    options: {
      maxPage: 2 // 最大页数
    }, // 参数
    group: {
      list: [{
        id: 0,
        count: 0,
        title: '全部'
      }, {
        id: 1,
        count: 0,
        title: '用户'
      }, {
        id: 2,
        count: 0,
        title: '会员'
      }, {
        id: 3,
        count: 0,
        title: '班长'
      }, {
        id: 4,
        count: 0,
        title: '院长'
      }] // 列表
    } // 团队
  },

  /**
   * 统计
   */
  count(e) {

    // 获取参数
    const list = this.data.group.list

    // 循环添加统计
    list.forEach((item, index) => {
      item.count = e.detail[index]
    })
    
    // 设置数据
    this.setData({
      'group.list': list
    })
  },

  /**
   * tab更改
   */
  tabChange(e) {
    this.selectAllComponents('.group-list')[e.detail.contentIndex].init()
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
        container.status('error', e.message)
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

    // 获取参数
    this.setData({
      options: Object.assign({
        id: wx.getStorageSync('userInfo').id,
        nickname: wx.getStorageSync('userInfo').name
      }, this.data.options, options)
    })

    wx.setNavigationBarTitle({
      title: `${this.data.options.id == wx.getStorageSync('userInfo').id ? '我' : this.data.options.nickname}的团队`,
    })

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
  async onPullDownRefresh() {

    // 初始化数据
    await this.selectAllComponents('.group-list')[this.selectComponent('#tab').index().contentIndex].init()

    // 停止下拉
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  async onReachBottom() {

    // 初始化数据
    await this.selectAllComponents('.group-list')[this.selectComponent('#tab').index().contentIndex].onReachBottom()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

    // 分享
    return UTIL.share()
  }
})