const
  UTIL = require('../../utils/util'),
  COMMENT_SERVICE = require('../../service/comment.service')
let OPTIONS
/**
 * 课程评论列表
 * 陈浩 2020/1/14
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    comment: {
      primary: {}, // 
      list: [] // 列表
    }, // 评论
  },

  /**
   * 回复
   */
  reply() {
    wx.navigateTo({
      url: `/pages/comment-post/comment-post?commentId=${OPTIONS.id}`,
    })
  },

  /**
   * 弹出初始化
   */
  eventInit() {
    this.getOpenerEventChannel().emit('init')
  },

  /**
   * 初始化数据
   */
  async init() {

    // 获取容器
    const container = this.selectComponent('#container')

    try {

      // 初始化页号
      // PAGE = 1

      // 获取数据
      const result = await COMMENT_SERVICE.detail(OPTIONS.id, wx.getStorageSync('userInfo').id)

      // 设置数据
      this.setData({
        'comment.primary': result.data.review,
        'comment.list': result.data.review_list
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
    OPTIONS = options

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

    return

    // 获取容器
    const container = this.selectComponent('#container')

    // 判断加载
    if (container.status() != 'canload') return

    try {

      // 设置状态
      container.status('loading')

      // 获取参数
      const {
        tutor
      } = this.data

      // 获取数据
      const result = await TUTOR_SERVICE.list(PAGE + 1)

      // 设置页号
      PAGE++

      // 设置数据
      this.setData({
        'tutor.list': tutor.list.concat(result.data)
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