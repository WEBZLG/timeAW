const
  AUTH = require('../../utils/auth'),
  UTIL = require('../../utils/util'),
  ADDRESS_SERVICE = require('../../service/address.service')

/**
 * 我的课程
 * 李帮鑫、陈浩、于家辉
 * 2019/7/17
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    choice: false,
    address: {
      list: [] //列表
    }, // 地址
  },

  /**
   * 添加地址
   */
  postAddress() {
    wx.navigateTo({
      url: '/pages/address-form/address-form',
      events: {
        init: () => this.init()
      }
    })
  },

  /**
   * 修改地址
   */
  putAddress(e) {

    // 获取下标
    const index = e.currentTarget.dataset.index

    // 获取地址
    const address = this.data.address.list[index]

    // 跳转
    wx.navigateTo({
      url: `/pages/address-form/address-form?data=${JSON.stringify(address)}`,
      events: {
        init: () => this.init()
      }
    })
  },
  /**
   * 删除地址
   */
  async delAddress(e) {

    // 获取下标
    const index = e.currentTarget.dataset.index

    // 获取地址
    const address = this.data.address.list[index]

    try {

      // 显示加载
      wx.showLoading({
        mask: true
      })

      // 验证
      UTIL.check(this.data.address.list.length > 1, '收货地址不能为空，至少为一条')

      // 获取数据
      const result = await ADDRESS_SERVICE.delete(address.id)

      // 显示提示
      wx.showToast({
        title: result.msg,
        icon: 'none',
        duration: 1500,
      })

      // 隐藏提示
      wx.hideLoading()

      // 初始化数据
      this.init()
    } catch (e) {

      // 隐藏提示
      wx.hideLoading()

      // 显示提示
      wx.showToast({
        title: e.message,
        icon: 'none',
        duration: 1500,
      })
    }
  },

  /**
   * 选择地址
   */
  choose_address(e) {
    var arr = e.currentTarget.dataset.arr;
    this.getOpenerEventChannel().emit('address', arr)
    console.log(arr)
    this.isChoice(arr)
  },

  // 判断是否是选择地址
  isChoice(arr) {
    let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。

    let prevPage = pages[pages.length - 2];

    //prevPage 是获取上一个页面的js里面的pages的所有信息。 -2 是上一个页面，-3是上上个页面以此类推。

    prevPage.setData({ // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作。

      address_id: arr.id

    })

    // true选择收货地址 false
    console.log(this.data.choice)
    if (this.data.choice) {
      wx.navigateBack({
        delta: arr
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

      // 获取数据
      const result = await ADDRESS_SERVICE.list(wx.getStorageSync('userInfo').id)

      // 设置数据
      this.setData({
        'address.list': result.data
      })

      // 设置状态
      container.status(...(result.data.length ? ['default'] : ['empty', '/images/address/empty.png']))
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
    console.log(options)
    if (options.j_params) {
      console.log('选择地址')
      this.setData({
        choice: true
      })
    }
    console.log(this.data.choice)
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