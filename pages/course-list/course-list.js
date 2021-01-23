const
  UTIL = require('../../utils/util'),
  COURSE_SERVICE = require('../../service/course.service')
let PAGE = 1
/**
 * 课程列表
 * 陈浩
 * 2019/7/29
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    options: {}, // 参数
    course: {
      list: [] // 列表
    }, // 课程
  },

  /**
   * 初始化数据
   */
  async init() {

    // 获取容器
    const container = this.selectComponent('#container')

    try {

      // 设置状态
      container.status('init')

      // 初始化页号
      PAGE = 1

      // 获取参数
      const {
        id,
        link
      } = this.data.options

      // 获取数据
      const result = await COURSE_SERVICE.list(id, link, PAGE)

      // 设置数据
      this.setData({
        'course.list': result.data
      })

      // 设置状态
      container.status(result.data.length > 0 ? 'canload' : 'complete')
    } catch (e) {

      // 设置状态
      container.status('error', e.message)
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

    // 获取参数
    this.setData({
      options
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

      // 设置状态
      container.status('loading')

      // 获取参数
      const {
        options: {
          id,
          link
        },
        course: {
          list
        }
      } = this.data

      // 获取数据
      const result = await COURSE_SERVICE.list(id, link, PAGE + 1)

      // 设置页号
      PAGE++

      // 设置数据
      this.setData({
        'course.list': list.concat(result.data)
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