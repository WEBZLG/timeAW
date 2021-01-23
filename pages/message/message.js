const
  UTIL = require('../../utils/util'),
  AUTH = require('../../utils/auth'),
  OBSERVE = require('../../utils/observe'),
  MESSAGE_SERVICE = require('../../service/message.service'),
  LEVEL_SERVICE = require('../../service/system.service')

/**
 * 信息通知
 * 陈浩、于家辉
 * 2019/8/3
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    category: {
      list: [{
        id: 1,
        attention: false,
        title: '订单消息',
        icon: {
          normal: '/images/message/order.png',
          active: '/images/message/order-active.png',
        },
      }, {
        id: 2,
        attention: false,
        title: '晋级消息',
        icon: {
          normal: '/images/message/promotion.png',
          active: '/images/message/promotion-active.png',
        },
      }, {
        id: 3,
        attention: false,
        title: '课程消息',
        icon: {
          normal: '/images/message/course.png',
          active: '/images/message/course-active.png',
        },
      }, {
        id: 4,
        attention: false,
        title: '系统消息',
        icon: {
          normal: '/images/message/system.png',
          active: '/images/message/system-active.png',
        },
      }] // 列表
    }, // 分类
  },

  /**
   * tab更改
   */
  async tabChange(e) {

    // 初始化数据
    this.selectAllComponents('.message-list')[e.detail.contentIndex].init()
  },

  /**
   * 未读信息
   */
  unread(e) {

    // 获取参数
    const list = this.data.category.list

    // 循环获取提示
    list.forEach((item, index) => item.attention = e.detail[index])

    // 设置数据
    this.setData({
      'category.list': list
    })

    // 如果全部没有提示则清除提示
    // if (e.detail.every(item => item == 0)) {
    //   wx.hideTabBarRedDot({
    //     index: 3,
    //   })
    // }
  },

  /**
   * 初始化数据
   */
  async init() {

    // 设置状态
    this.selectComponent('#container').status('default')

    // 初始化tab
    this.selectComponent('#tab').init(this.selectComponent('#tab').index().contentIndex)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {

    // try {

    //   // 验证登录
    //   await AUTH.loginStatus()

    //   // 订阅用户信息
    //   OBSERVE.subscribe('userInfo', status => {

    //     // 初始化数据
    //     this.init()
    //   }, {
    //     proxy: true
    //   })
    // } catch (e) {

    //   // 初始化数据
    //   this.init()
    // }
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

      // 订阅用户信息
      OBSERVE.subscribe('userInfo', status => {

        // 初始化数据
        this.init()
      }, {
        proxy: true
      })

      // 控制等级
      LEVEL_SERVICE.levelControl(wx.getStorageSync('userInfo').id)
    } catch (e) {

      // 初始化数据
      this.init()
    }

    // try {

    //   // 验证登录
    //   await AUTH.loginStatus()

    //   // 控制等级
    //   LEVEL_SERVICE.levelControl(wx.getStorageSync('userInfo').id)
    // } catch (e) {}
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
    await this.selectAllComponents('.message-list')[this.selectComponent('#tab').index().contentIndex].init()

    // 停止下拉
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    this.selectAllComponents('.message-list')[this.selectComponent('#tab').index().contentIndex].getMore()
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})