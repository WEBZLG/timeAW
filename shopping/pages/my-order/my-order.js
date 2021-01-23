const
  UTIL = require('../../../utils/util'),
  AUTH = require('../../../utils/auth'),
  ORDER_SERVICE = require('../../service/order.service');

let PAGE = 1

Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: -1,
    statusList: [{
        status: '全部',
        idx: -1
      },
      {
        status: '待付款',
        idx: 0
      },
      {
        status: '待配送',
        idx: 1
      },
      {
        status: '待签收',
        idx: 2
      },
      // {
      //   status: '退货中',
      //   idx: 4
      // },
      // {
      //   status: '已取消',
      //   idx: -1
      // },
      {
        status: '已完成',
        idx: 6
      },
    ],
    orderList: [],
    finished: false
  },
  scroll(e) {
    console.log(e)
  },
  // 切换tab
  async handleTabClick(e) {
    PAGE = 1
    wx.showLoading({
      title: '加载中',
    })
    const id = e.target.dataset.id
    console.log(id)
    this.setData({
      active: id,
      finished: false
    })

    try {
      const result = await ORDER_SERVICE.orderList(wx.getStorageSync('userInfo').id, id, 1)
      this.setData({
        orderList: result.data
      })
      wx.hideLoading()
    } catch (e) {
      wx.hideLoading()
      wx.showToast({
        title: e.message,
        icon: 'none',
        duration: 2000
      })

    }

  },
  async init(id) {

    // 获取容器
    const container = this.selectComponent('#container')

    try {

      // 检测登录
      await AUTH.loginStatus()

      // 获取数据
      const result = await ORDER_SERVICE.orderList(wx.getStorageSync('userInfo').id, this.data.active, 1)
      // const result = await ORDER_SERVICE.orderList(119681, -1, 1)
      this.setData({
        orderList: result.data
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

  // 分页
  async loadMore() {
    if (this.data.finished) {
      return
    }
    PAGE++
    try {
      wx.showLoading({
        title: '加载中',
      })
      const result = await ORDER_SERVICE.orderList(wx.getStorageSync('userInfo').id, this.data.active, PAGE)
      if (result.data.length != 0) {
        let list = this.data.orderList.concat(result.data)
        this.setData({
          orderList: list
        })
        wx.hideLoading()
      } else {
        this.setData({
          finished: true
        })
        wx.hideLoading()
      }
    } catch (e) {
      wx.hideLoading()
      wx.showToast({
        title: e.message,
        icon: 'none',
        duration: 2000
      })
    }
  },
  resetInit() {
    console.log(123)
    this.setData({
      active: this.data.active
    })
    this.init()
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
  onPullDownRefresh: async function () {
    this.setData({
      finished: false
    })
    PAGE = 1
    try {
      const result = await ORDER_SERVICE.orderList(wx.getStorageSync('userInfo').id, this.data.active, PAGE)
      // const result = await ORDER_SERVICE.orderList(119681, this.data.active, PAGE)
      console.log(result)
      this.setData({
        orderList: result.data
      })
      wx.stopPullDownRefresh()
    } catch (e) {
      wx.showToast({
        title: e.message,
        icon: 'none',
        duration: 2000
      })
    }

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