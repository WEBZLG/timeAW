const
  UTIL = require('../../utils/util'),
  DEAN_SERVICE = require('../../service/dean.service')

/**
 * 院长主页
 * 陈浩
 * 2019/8/8
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dean: {} // 院长
  },

  /**
   * 信息修改
   */
  deanPut() {
    wx.navigateTo({
      url: '/pages/dean-put/dean-put',
      events: {
        init: () => this.init()
      }
    })
  },

  /**
   * 初始化数据
   */
  async init() {

    // 获取容器
    const container = this.selectComponent('#container')

    try {

      // 获取数据
      const result = await DEAN_SERVICE.get(wx.getStorageSync('userInfo').id)

      // 设置数据
      this.setData({
        dean: result.data
      })

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