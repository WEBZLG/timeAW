const
  UTIL = require('../../../utils/util'),
  AUTH = require('../../../utils/auth'),
  OFFLINE_COURSE_SERVICE = require('../../../service/offlineCourse.service'),
  COURSE_SERVICE = require('../../service/course.service')
let OPTIONS


/**
 * 新线下课
 * 洪新 2020/08/10
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null, // 课程id
    // popup: true,
    isShow: false,
    active: -1,
    timeList: [],
    course: {},
    choiceAddress: '',
    num: '', // 剩余席位
    timeId: null, // 时间id
  },
  // 课程报名
  signUp() {
    this.setData({
      isShow: false
    })
  },

  // 预约席位
  appointment() {
    // 底部弹窗暂时不要
    // this.setData({
    //   popup: true
    // })

    //  去app 假的
    wx.showToast({
      title: '请去App预约',
      icon: 'none',
      duration: 2000
    })

  },

  // 弹窗内预约席位按钮
  popupBtn() {
    console.log(100)
    if (this.data.timeId == null) {
      wx.showToast({
        title: '请选择预约时间',
        icon: 'none',
        duration: 2000
      })

    } else {
      this.seat()
    }
  },
  // 选择时间
  choiceTime(event) {
    console.log(event.currentTarget.dataset.disable)
    if(event.currentTarget.dataset.disable) {
      return false
    } else {
      this.setData({
        active: event.currentTarget.dataset.index,
        choiceAddress: event.currentTarget.dataset.address,
        num: event.currentTarget.dataset.num,
        timeId: event.currentTarget.dataset.timeid
      })
    }
  },
  /**
   * 初始化
   */
  async init() {
    // 获取容器
    const container = this.selectComponent('#container')

    try {

      // 检测登录
      await AUTH.loginStatus()

      // 获取数据
      // const [course, qrcode] = await Promise.all([OFFLINE_COURSE_SERVICE.get(OPTIONS.id, wx.getStorageSync('userInfo').id), OFFLINE_COURSE_SERVICE.qrcode(OPTIONS.id, wx.getStorageSync('userInfo').id)])
      // const course = await OFFLINE_COURSE_SERVICE.get(OPTIONS.id, wx.getStorageSync('userInfo').id)
      const course = await COURSE_SERVICE.courseInfo(wx.getStorageSync('userInfo').id, OPTIONS.id)
      // 设置数据
      this.setData({
        course: course.data,
        timeList: course.data.time
        // qrcode: qrcode.data
      })

      // 设置标题
      // wx.setNavigationBarTitle({
      //   title: course.data.title,
      // })

      // 设置状态
      container.status(course.data.length <= 0 ? 'empty' : 'default')
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
    // let timestamp = Date.parse(new Date());
    // let endTime = this.data.course.signtime * 1000;
    // console.log(timestamp)
    // console.log(endTime)
    // if (timestamp > endTime) {
    //   this.setData({
    //     end: true
    //   })
    // }
  },
  onClose() {
    this.setData({
      popup: false
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 初始化 课程id
    // this.setData({
    //   id: options.id
    // })
    OPTIONS = options
    console.log(OPTIONS.id)
    this.init()
  },

  // 预约席位
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
          openid,
          time_id: this.data.timeId
        },
        success: async (res) => {
          if(res.errMsg === 'request:ok') {
            wx.hideLoading()
            if(res.data.code === 1) {
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
          openid,
          time_id: this.data.timeId
        },
        success: async (res) => {
          console.log(res)
          if(res.errMsg === 'request:ok') {
            wx.hideLoading()
            console.log(res.data.data)
            const result = await UTIL.requestPayment(res.data.data)
            // 支付成功重新获取
            if(result.errMsg === 'requestPayment:ok') {
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})