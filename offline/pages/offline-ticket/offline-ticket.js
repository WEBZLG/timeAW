const AUTH = require('../../../utils/auth');
const TICKET_SERVICE = require('../../service/ticket.service')

let PAGE = 1

/**
 * 课程门票
 * 洪新
 * 2020/08/11
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    tabList: [], // 标签列表
    categoryId: null,
    ticketList: [], // 门票列表
    finished: false, // 加载完成
  },
  // 初始化数据
  async init() {
    const container = this.selectComponent('#container')
    try {
      await AUTH.loginStatus()
      container.status('canload')

      const tabRes = await TICKET_SERVICE.tabList()
      this.setData({
        tabList: tabRes.data,
        categoryId: tabRes.data[0].id
      })
      // const  ticketRes = await TICKET_SERVICE.ticketList(wx.getStorageSync('userInfo').id, this.data.categoryId)
      const  ticketRes = await TICKET_SERVICE.ticketList(wx.getStorageSync('userInfo').id, this.data.categoryId, PAGE)
      this.setData({
        ticketList: ticketRes.data
      })
      console.log(this.data.ticketList)
    } catch (e) {
      
      if (e.message === 'login:fail') {
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

  // 获取门票列表
  async getTicketList() {
    const ticketRes = await TICKET_SERVICE.ticketList(wx.getStorageSync('userInfo').id, this.data.categoryId, PAGE)
    this.setData({
      ticketList: ticketRes.data
    })
  },

  // 切换标签
  handleTabClick(event) {
    const container = this.selectComponent('#container')
    container.status('canload')
    PAGE = 1
    const id = event.currentTarget.dataset.id
    this.setData({
      active: event.currentTarget.dataset.index,
      categoryId: id,
      finished: false
    })
    this.getTicketList()
    this.goTop()
  },
  // 加载更多
  async loadMore() {
    const container = this.selectComponent('#container')
    if (this.data.finished) {
      return
    }
    const ticketRes = await TICKET_SERVICE.ticketList(wx.getStorageSync('userInfo').id, this.data.categoryId, PAGE)
    if (ticketRes.data.length === 0) {
      container.status('complete')
      this.setData({
        finished: true
      })
      return
    }
    this.setData({
      ticketRes: this.data.ticketList.concat(ticketRes.data)
    })
  },
  // 回到顶部，解决切换标签加载更多时候的bug
  goTop (e) {
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },

  // 下拉刷新
  async refresh() {

    const container = this.selectComponent('#container')

    container.status('canload')

    this.goTop()
    PAGE = 1
    this.setData({
      finished: false
    })
    this.getTicketList()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    this.refresh()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    PAGE++
    this.loadMore()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})