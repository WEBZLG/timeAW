// pages/record/record.js
const UTIL = require('../../utils/util')
const USERINFO_SERVICE = require('../../service/userInfo.service')
const WITHDRAWAL_SERVICE = require('../../service/withdrawal.service')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    empty: true,
    userInfo: {},
    page: 1,
    recordList: [],
    finished: false
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

      // 获取记录
      const recordRes = await WITHDRAWAL_SERVICE.record(this.data.userInfo.id, this.data.page)
      // 设置数据
      this.setData({
        recordList: recordRes.data
      })
      // 数据状态
      if(this.data.recordList.length == 0) {
        this.setData({
          empty: true
        })
      } else {
        this.setData({
          empty: false
        })
      }
      // 设置状态
      container.status('default')
    } catch (e) {

      // 设置状态
      container.status('error', e.message)
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  async onReachBottom () {
    if(this.data.finished == true) {
      return
    }
    wx.showLoading({
      title: '加载中',
    })
    let _page = this.data.page + 1
    this.setData({
      page: _page
    })
    console.log(this.data.page)
    const list = this.data.recordList

    const recordRes = await WITHDRAWAL_SERVICE.record(this.data.userInfo.id, this.data.page)
    if(recordRes.data.length == 0) {
      this.setData({
        finished: true
      })
    }
    // 设置数据
    this.setData({
      recordList: list.concat(recordRes.data)
    })
    wx.hideLoading()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})