const
  UTIL = require('../../utils/util'),
  AUTH = require('../../utils/auth'),
  OFFLINE_COURSE_SERVICE = require('../../service/offlineCourse.service')
let PAGE
/**
 * 我的-线下课
 * 陈浩 2019/12/28
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    course: {
      list: [] // 列表
    } // 课程
  },

  /**
   * 初始化信息
   */
  async init() {

    // 获取容器
    const container = this.selectComponent('#container')

    try {

      // 检测登录
      await AUTH.loginStatus()

      PAGE = 1

      // 获取数据
      const result = await OFFLINE_COURSE_SERVICE.list(wx.getStorageSync('userInfo').id, PAGE)

      // 设置数据
      this.setData({
        'course.list': result.data
      })

      // 设置状态
      container.status(result.data.length <= 0 ? 'empty' : 'canload')
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
  async onPullDownRefresh() {

    // 初始化数据
    await this.init()

    // 停止下拉
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  async onReachBottom() {

    // 获取容器
    const container = this.selectComponent('#container')

    // 判断加载
    if (container.status() != 'canload') return

    try {

      // 获取参数
      const {
        course
      } = this.data

      // 获取数据
      const result = await OFFLINE_COURSE_SERVICE.list(wx.getStorageSync('userInfo').id, PAGE + 1)

      // 增加页号
      PAGE++

      // 设置数据
      this.setData({
        'course.list': course.list.concat(result.data)
      })

      // 设置状态
      container.status(result.data.length <= 0 ? 'complete' : 'canload')
    } catch (e) {

      // 设置状态
      container.status('error', e.message)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

    // 分享
    return UTIL.share()
  }
})