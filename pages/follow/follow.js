const
  AUTH = require('../../utils/auth'),
  UTIL = require('../../utils/util'),
  TUTOR_SERVICE = require('../../service/tutor.service'),
  USERINFO_SERVICE = require('../../service/userInfo.service')

/**
 * 我的导师
 * 陈浩、李帮鑫
 * 2019/7/17
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tutor: {
      list: [] //列表
    } // 导师
  },

  /**
   * 跳转详情
   */
  tutorDetail(e) {

    // 获取下标
    const index = e.currentTarget.dataset.index

    // 获取课程
    const tutor = this.data.tutor.list[index]

    // 跳转
    wx.navigateTo({
      url: `/pages/tutor-home/tutor-home?id=${tutor.id}`,
    })
  },

  /**
   * 关注导师
   */
  async follow(e) {

    try {

      // 获取参数
      const index = e.currentTarget.dataset.index

      // 加载
      wx.showLoading({
        mask: true,
      })

      // 获取参数
      const {
        follow,
        tutor: {
          list
        }
      } = this.data

      // 发送请求
      const result = list[index].cancel ? await TUTOR_SERVICE.follow(list[index].id, wx.getStorageSync('userInfo').id) : await TUTOR_SERVICE.unfollow(list[index].id, wx.getStorageSync('userInfo').id)

      // 初始化数据
      await this.init();

      // 获取个人信息
      await USERINFO_SERVICE.get(wx.getStorageSync('userInfo').id)

      // 隐藏加载
      wx.hideLoading()

      // 提示
      wx.showToast({
        title: result.msg,
      })
    } catch (e) {

      // 隐藏加载
      wx.hideLoading()

      // 提示
      wx.showToast({
        title: e.message,
        icon: 'none'
      })
    }
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
      const result = await TUTOR_SERVICE.followList(wx.getStorageSync('userInfo').id)

      // 设置数据
      this.setData({
        'tutor.list': result.data
      })

      // 设置标题
      wx.setNavigationBarTitle({
        title: `我的关注(${result.data.length})`,
      })

      // 设置状态
      container.status(...(result.data.length ? ['complete'] : ['empty', '/images/follow/empty.png']))
    } catch (e) {

      // 判断登陆
      if (e.message == 'login:fail') {

        // 跳转登录
        wx.navigateTo({
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
  async onPullDownRefresh() {

    // 初始化数据
    await this.init()

    // 停止下拉
    wx.stopPullDownRefresh()
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
  }
})