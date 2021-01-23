const
  UTIL = require('../../utils/util'),
  AUTH = require('../../utils/auth'),
  OBSERVE = require('../../utils/observe'),
  USERINFO_SERVICE = require('../../service/userInfo.service')
let COUNTDOWN
/**
 * 修改手机号码
 * 李邦鑫 
 * 陈浩 2020/1/3
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    captcha: {
      status: false, // 状态
      countdown: 0 // 倒计时
    }, // 验证码
    currentPhone: '' // 当前号码
  },

  /**
   * 表单提交
   */
  formSubmit(e) {

    // 获取提交类型
    const submitType = e.detail.target.dataset.submit

    // 提交
    this[submitType](e)
  },

  /**
   * 修改手机号
   */
  async putPhone(e) {

    try {

      // 获取数据
      const {
        phone,
        captcha,
      } = e.detail.value

      // 显示加载
      wx.showLoading({
        mask: true
      })

      // 验证数据
      UTIL.check(phone, '请输入正确的手机号码', /^1\d{10}$/)
      UTIL.check(captcha, '请输入验证码')

      // 获取数据
      const result = await USERINFO_SERVICE.putPhone(phone, captcha, wx.getStorageSync('userInfo').id)

      // 弹出初始化
      this.getOpenerEventChannel().emit('init')

      // 显示提示
      wx.showModal({
        content: result.msg,
        showCancel: false,
        success: res => {
          wx.navigateBack()
        }
      })
    } catch (e) {

      // 显示提示
      wx.showModal({
        content: e.message,
        showCancel: false
      })
    } finally {

      // 隐藏加载
      wx.hideLoading()
    }
  },

  /**
   * 获取验证码
   */
  async getCaptcha(e) {

    try {

      // 获取表单数据
      const {
        phone
      } = e.detail.value

      // 显示加载
      wx.showLoading({
        mask: true
      })

      // 验证数据
      UTIL.check(phone, '请输入正确的手机号码', /^1\d{10}$/)

      // 发送数据
      const result = await USERINFO_SERVICE.captcha(phone)

      // 倒计时开始
      UTIL.countdown('resetPhoneCountdown').start(60)

      // 隐藏加载
      wx.hideLoading()

      // 显示提示
      wx.showToast({
        title: result.msg,
        icon: 'none'
      })
    } catch (e) {

      // 隐藏加载
      wx.hideLoading()

      // 错误提示
      wx.showModal({
        content: e.message,
        showCancel: false
      })
    } finally {

      // 隐藏加载
      wx.hideLoading()
    }
  },

  /**
   * 初始化信息
   */
  async init() {

    // 获取容器
    const container = this.selectComponent('#container')

    try {

      // 设置数据
      this.setData({
        currentPhone: wx.getStorageSync('userInfo').mobile
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

    // 订阅倒计时
    COUNTDOWN = OBSERVE.subscribe('resetPhoneCountdown', countdown => {

      this.setData({
        captcha: {
          status: countdown != 0,
          countdown
        }
      })
    }, {
      proxy: true,
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