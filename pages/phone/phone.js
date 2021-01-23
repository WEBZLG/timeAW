const
  UTIL = require('../../utils/util'),
  AUTH = require('../../utils/auth'),
  USERINFO_SERVICE = require('../../service/userInfo.service'),
  LOGIN_SERVICE = require('../../service/login.service')
let
  SESSION_KEY,
  OPENID
/**
 * 登录
 * 陈浩
 * 2019/4/24
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:''
  },

  /**
   * 显示加载
   */
  beforeOpenType() {
    wx.showLoading({
      mask: true,
    })
  },

  /**
   * 获取手机号
   */
  async getphonenumber(e) {

    try {

      // 判断确定
      if (e.detail.errMsg != 'getPhoneNumber:ok') return

      // 获取加密数据
      const {
        encryptedData,
        iv
      } = e.detail, {
        nickName,
        avatarUrl,
        openId,
      } = wx.getStorageSync('userInfo')

      // 获取分享
      const share = wx.getStorageSync('share') || 1

      // 发送数据
      const result = await USERINFO_SERVICE.encode(OPENID, SESSION_KEY, encryptedData, iv)

      // 用户是否存在
      if (result.data.is_old == 1) {

        // 获取用户信息
        await USERINFO_SERVICE.get(result.data.user_id)
        if(this.data.type=='live'){
          wx.switchTab({
            url: '../wxLive/wxLive',
          })
        }else{
          // 返回
          wx.navigateBack()
        }
        
      } else {

        // 注册用户
        const userInfo = await USERINFO_SERVICE.post(result.data.phoneNumber, '', result.data.phoneNumber, share, nickName, avatarUrl, openId, 1)

        // 获取用户信息
        await USERINFO_SERVICE.get(userInfo.data.id)

        // 跳转至兴趣
        wx.redirectTo({
          url: '/pages/interest/interest',
        })
      }
    } catch (e) {

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
   * 初始化数据
   */
  async init() {

    // 获取容器
    const container = this.selectComponent('#container')

    try {

      // 微信登录
      const login = await AUTH.login()

      // 获取sessionKey与openid
      const result = await LOGIN_SERVICE.encode(login.code)

      // 设置数据
      SESSION_KEY = result.data.session_key
      OPENID = result.data.openid

      // 设置系统信息
      this.setData({
        logo: getApp().globalData.system.default_headimg,
        title: getApp().globalData.system.name
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
    console.log(options)
    if(options.type){
      this.setData({
        type:options.type
      })
    }
    // 隐藏分享
    wx.hideShareMenu()

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

  }
})