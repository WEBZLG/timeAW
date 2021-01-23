const
  UTIL = require('../../../utils/util'),
  AUTH = require('../../../utils/auth'),
  COMMODITY_SERVICE = require('../../service/commodity.service');

let PAGE = 1
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    finished: false,
    cid:''
  },

  // 初始化
  async init(id) {

    // 获取容器
    const container = this.selectComponent('#container')

    try {

      // 检测登录
      await AUTH.loginStatus()

      // 获取数据
      const result = await COMMODITY_SERVICE.moreList(this.data.cid,PAGE)
      this.setData({
        list: result.data
      })


      // 设置状态
      // container.status(result.data.length <= 0 ? 'empty' : 'canload')
      container.status('default')
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

  // 加载更多
  async loadMore() {
    const container = this.selectComponent('#container')
    PAGE++
    if (this.data.finished) {
      return
    }
    wx.showLoading({
      title: '加载中',
    })
    try {
      const result = await COMMODITY_SERVICE.moreList(this.data.cid,PAGE)
      if (result.data.length == 0) {
        this.setData({
          finished: true
        })
        wx.hideLoading()
      } else {
        this.setData({
          list: this.data.list.concat(result.data)
        })
        wx.hideLoading()
      }
    } catch (e) {
      wx.hideLoading()
      container.status('error', e.message)
    }

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let cid = options.cid
    this.setData({
      cid:cid
    })
    PAGE = 1
    this.init()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showLoading({
      title: '加载中',
    })
    PAGE = 1
    this.setData({
      finished: false,
      list: []
    })
    wx.stopPullDownRefresh()
    this.init()
    wx.hideLoading()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.loadMore()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})