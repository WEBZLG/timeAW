// pages/profit/profit.js
// pages/record/record.js
const UTIL = require('../../utils/util')
const USERINFO_SERVICE = require('../../service/userInfo.service')
const WITHDRAWAL_SERVICE = require('../../service/withdrawal.service')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    empty: false,
    current: 1,
    userInfo: {},
    list: [],
    page: 1,
    type: 1,
    isShow: false,
    finished: false
  },
  // 提现，假的
  withdrawal() {
    wx.showToast({
      title: '请去App提现',
      icon: 'none',
      duration: 2000
    })
  },
  async init() {

    // 获取容器
    const container = this.selectComponent('#container')

    try {

      // 获取数据
      const result = await USERINFO_SERVICE.get(wx.getStorageSync('userInfo').id)
      // 设置数据
      this.setData({
        userInfo: result.data
      })
      this.profit()
      
      // 设置状态
      container.status('default')
    } catch (e) {

      // 设置状态
      container.status('error', e.message)
    }
  },
  handleTagClick(event) {
    // 1是获利 2是提现
    const _current = event.currentTarget.dataset.type;
    this.setData({
      current: _current,
      page: 1,
      finished: false,
      empty: false
    })
    if (_current == 1) {
      this.profit()
    } else if (_current == 2) {
      this.record()
    }
    // this.init()
  },

  // 获利
  async profit() {
    const profitRes = await WITHDRAWAL_SERVICE.profit(this.data.userInfo.id, this.data.type, 1)
    this.setData({
      list: profitRes.data
    })
    if (this.data.list.length == 0) {
      this.setData({
        empty: true
      })
    }
  },

  // 提现
  async record() {
    const recordRes = await WITHDRAWAL_SERVICE.record(this.data.userInfo.id, 1)
    this.setData({
      list: recordRes.data
    })
    if (this.data.list.length == 0) {
      this.setData({
        empty: true
      })
    }
  },

  // 加载更多
  async loadMore() {

    if (this.data.finished) {
      return
    }
    wx.showLoading({
      title: '加载中',
    })
    let _page = this.data.page

    this.setData({
      page: _page + 1
    })
    let _list = this.data.list
    // 直招获利
    if (this.data.current == 1) {
  
      const profitRes = await WITHDRAWAL_SERVICE.profit(this.data.userInfo.id, this.data.type, this.data.page)
      if (profitRes.data.length != 0) {
        // 设置数据
        this.setData({
          list: _list.concat(profitRes.data)
        })
        wx.hideLoading()
      } else if (profitRes.data.length == 0) {
        this.setData({
          finished: true
        })
        wx.hideLoading()
      }
    } else if(this.data.current == 2) {
      const recordRes = await WITHDRAWAL_SERVICE.record(this.data.userInfo.id, this.data.page)
      if (recordRes.data.length != 0) {
        // 设置数据
        this.setData({
          list: _list.concat(recordRes.data)
        })
        wx.hideLoading()
      } else if (recordRes.data.length == 0) {
        this.setData({
          finished: true
        })
        wx.hideLoading()
      }
    }


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
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
    this.init()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    this.loadMore()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})