const
  AUTH = require('../../utils/auth'),
  UTIL = require('../../utils/util'),
  SEARCH_SERVICE = require('../../service/search.service')

/**
 * 搜索-列表
 * 陈浩
 * 2019/7/25
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    category: {
      list: [{
          id: 'course',
          title: '课程'
        },
        {
          id: 'author',
          title: '导师'
        },
      ] //列表
    }, // 分类
    keyword: '' // 关键词
  },

  /**
   * 搜索
   */
  search(e) {

    try {

      // 获取搜索关键词
      const keyword = e.detail.keyword.trim()

      // 验证
      UTIL.check(keyword, '关键词不能为空')

      // 设置关键词
      this.setData({
        keyword
      })

      // 初始化数据
      this.selectAllComponents('.search-list')[this.selectComponent('#tab').index().contentIndex].init()
    } catch (e) {

      // 提示
      wx.showToast({
        title: e.message,
        icon: 'none'
      })
    }
  },

  /**
   * 搜索成功
   */
  searchSuccess() {
    this.getOpenerEventChannel().emit('init')
  },

  /**
   * tab更改
   */
  tabChange(e) {
    this.selectAllComponents('.search-list')[e.detail.contentIndex].init()
  },

  /**
   * 初始化数据
   */
  async init() {

    // 设置状态
    this.selectComponent('#container').status('default')

    // 初始化tab
    this.selectComponent('#tab').init()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

    // 获取参数
    this.setData({
      keyword: options.keyword
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
  }
})