const
  AUTH = require('../../utils/auth'),
  UTIL = require('../../utils/util'),
  COURSE_SERVICE = require('../../service/course.service')
let PAGE = 1
/**
 * 我的课程
 * 陈浩
 * 2019/7/17
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    course: {
      list: [] //列表
    } // 课程
  },

  /**
   * 跳转详情
   */
  courseDetail(e) {

    try {

      // 获取下标
      const index = e.currentTarget.dataset.index

      // 获取课程
      const course = this.data.course.list[index]

      // 验证
      UTIL.check(course.status != 1, '此课程已下架')

      // 跳转
      wx.navigateTo({
        url: `/pages/course-detail/course-detail?id=${course.id}`,
      })
    } catch (e) {

      // 下架则提示
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

      // 初始化页号
      PAGE = 1

      // 获取数据
      const result = await COURSE_SERVICE.mine(wx.getStorageSync('userInfo').id, PAGE)

      // 设置数据
      this.setData({
        'course.list': result.data
      })

      // 设置状态
      container.status(...(result.data.length > 0 ? ['canload'] : ['empty', '/images/course-own/empty.png']))
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
      const result = await COURSE_SERVICE.mine(wx.getStorageSync('userInfo').id, PAGE + 1)

      // 增加页号
      PAGE++

      // 设置数据
      this.setData({
        'course.list': course.list.concat(result.data)
      })

      // 设置状态
      container.status(result.data.length > 0 ? 'canload' : 'complete')
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