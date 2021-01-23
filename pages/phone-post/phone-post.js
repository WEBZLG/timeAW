const
  UTIL = require('../../utils/util'),
  AUTH = require('../../utils/auth'),
  PHONE_SERVICE = require('../../service/phone.service'),
  USERINFO_SERVICE = require('../../service/userInfo.service')
let
  SESSION

/**
 * 绑定电话
 * 陈浩
 * 2017/7/26
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 开放授权之前
   */
  async beforeOpenType() {

    // 显示加载
    wx.showLoading({
      mask: true,
    })

    // 登录
    const login = await AUTH.login()

    // 获取session
    SESSION = await USERINFO_SERVICE.session(login.code)
  },

  /**
   * 登录
   */
  async getPhoneNumber(e) {

    try {

      // 判断授权
      if (e.detail.errMsg != 'getPhoneNumber:ok') return

      // 获取参数
      const {
        iv,
        encryptedData
      } = e.detail, {
        openid,
        session_key
      } = SESSION

      // 获取手机号
      const phone = await PHONE_SERVICE.get(iv, encryptedData, session_key)

      // 发送手机号
      await PHONE_SERVICE.post(openid, phone.phoneNumber)

      // 获取用户信息
      await USERINFO_SERVICE.get(wx.getStorageSync('userInfo').id)

      // 返回
      wx.navigateBack()
    } catch (e) {

      // 提示
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
   * 初始化数据
   */
  async init() {

    // 登录
    const login = await AUTH.login()

    // 获取session
    SESSION = await USERINFO_SERVICE.session(login.code)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {

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