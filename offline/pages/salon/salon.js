const AUTH = require('../../../utils/auth');
const SALON_SERVICE = require('../../service/salon.service')
/**
 * 沙龙课
 * 洪新
 * 2020/08/14
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseList: [], // 课程列表
    beforeList: [], // 以往课程
  },
  // 初始化
  async init() {
    // 获取容器
    const container = this.selectComponent('#container')
    // 判断登录状态
    await AUTH.loginStatus()
    const uid = wx.getStorageSync('userInfo').id
    const salonRes = await SALON_SERVICE.getSalonList(uid)
    console.log(salonRes)
    for (const item of salonRes.data.course) {
      console.log(item.category_id)
    }
    this.setData({
      courseList: salonRes.data.course,
      beforeList: salonRes.data.course_past
    })

    container.status('default')
    try {
      
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log(123)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})