const
  UTIL = require('../../utils/util'),
  AUTH = require('../../utils/auth'),
  OFFLINE_COURSE_SERVICE = require('../../service/offlineCourse.service')
let OPTIONS
/**
 * 线下课详情
 * 陈浩 2019/12/28
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    course: {}, // 课程
    qrcode: '', // 二维码
    end: false
  },

  /**
   * 初始化信息
   */
  async init() {

    // 获取容器
    const container = this.selectComponent('#container')

    try {

      // 检测登录
      await AUTH.loginStatus()

      // 获取数据
      const [course, qrcode] = await Promise.all([OFFLINE_COURSE_SERVICE.get(OPTIONS.id, wx.getStorageSync('userInfo').id), OFFLINE_COURSE_SERVICE.qrcode(OPTIONS.id, wx.getStorageSync('userInfo').id)])

      // 设置数据
      this.setData({
        course: course.data,
        qrcode: qrcode.data
      })

      // 设置标题
      wx.setNavigationBarTitle({
        title: course.data.title, 
      })

      // 设置状态
      container.status(course.data.length <= 0 ? 'empty' : 'default')
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
    let timestamp = Date.parse(new Date());
    let endTime = this.data.course.signtime * 1000;
    console.log(timestamp)
    console.log(endTime)
    if(timestamp > endTime) {
      this.setData({
        end: true
      })
    }
  },

  /**
   * 打开二维码
   */
  openQrcode() {
    this.selectComponent('#qrcode').open()
  },

  /**
   * 预约席位
   */
  seat() {
    wx.showLoading({
      title: '请稍后',
    })
    const id = OPTIONS.id
    const uid = wx.getStorageSync('userInfo').id
    const openid = wx.getStorageSync('userInfo').miniapp_openid
    if(this.data.course.seat_fee == 0) {
      wx.request({
        url: `${getApp().globalData.url.host}/api/courseoffline/pay_seat_miniapp`,
        data: {
          uid,
          id,
          openid
        },
        success: async (res) => {
          if(res.errMsg == 'request:ok') {
            wx.hideLoading()
            if(res.data.code == 1) {
              wx.showToast({
                title: '预约成功',
                icon: 'success',
                duration: 2000
              })
              this.init()
            }
          }
        }
      })
    } else if(this.data.course.seat_fee > 0) {
      wx.request({
        url: `${getApp().globalData.url.host}/api/courseoffline/pay_seat_miniapp`,
        data: {
          uid,
          id,
          openid
        },
        success: async (res) => {
          console.log(res)
          if(res.errMsg == 'request:ok') {
            wx.hideLoading()
            console.log(res.data.data)
            const result = await UTIL.requestPayment(res.data.data)
            // 支付成功重新获取
            if(result.errMsg == 'requestPayment:ok') {
              wx.showToast({
                title: '预约成功',
                icon: 'success',
                duration: 2000
              })
              this.init()
            }
          }
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

    // 获取参数
    OPTIONS = options

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
  async onShow() {

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