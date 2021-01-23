const
  UTIL = require('../../utils/util'),
  AUTH = require('../../utils/auth'),
  TUTOR_SERVICE = require('../../service/tutor.service'),
  SHARE_SERVICE = require('../../service/share.service'),
  USERINFO_SERVICE = require('../../service/userInfo.service')
let OPTIONS

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tutor: {}, // 导师信息
    course: {
      list: [] // 列表
    }, // 课程
    tag: {
      list: [] // 列表
    }, // 标签
    follow: false, // 关注
    setup: false, // 设置按钮
    userInfo: {} // 用户信息
  },

  /**
   * 切换material
   */
  materialChange(e) {
    this.selectAllComponents('.share-material-list')[e.detail.contentIndex].init()
  },

  /**
   * 切换TAB
   */
  tabChange(e) {

    // 获取参数
    const
      index = e.detail.contentIndex,
      course = this.data.course

    // 设置函数
    const tab = [
      () => {
        // 课程列表
        this.selectComponent('#course-container').status(...(course.list.length ? ['default'] : ['empty', '/images/tutor/courseEmpty.png']))
      },
      () => {
        // ta的动态
        this.selectComponent('#material-container').init()
      },
      () => {
        // 导师详情
        this.selectComponent('#tutor-container').status('default')
      },
    ]

    // 应用函数
    tab[index]()
  },

  /**
   * 关注导师
   */
  async follow() {

    try {

      // 加载
      wx.showLoading({
        mask: true,
      })

      // 检测登录
      await AUTH.loginStatus()

      // 获取参数
      const {
        follow,
        tutor
      } = this.data

      // 发送请求
      const result = follow == 1 ? await TUTOR_SERVICE.unfollow(tutor.id, wx.getStorageSync('userInfo').id) : await TUTOR_SERVICE.follow(tutor.id, wx.getStorageSync('userInfo').id)

      // 设置数据
      this.setData({
        follow: follow ^ 1
      })

      // 用户信息
      await USERINFO_SERVICE.get(wx.getStorageSync('userInfo').id)

      // 隐藏加载
      wx.hideLoading()

      // 提示
      wx.showToast({
        title: result.msg,
      })
    } catch (e) {

      // 隐藏加载
      wx.hideLoading()

      // 判断登陆
      if (e.message == 'login:fail') {

        // 跳转登录
        wx.navigateTo({
          url: getApp().globalData.pages.auth,
        })
      } else {

        // 提示
        wx.showToast({
          title: e.message,
          icon: 'none'
        })
      }
    }
  },

  /**
   * 初始化数据
   */
  async init() {

    // 获取容器
    const container = this.selectComponent('#container')

    try {

      // 获取数据
      const [detail, tag] = await Promise.all([TUTOR_SERVICE.detail(OPTIONS.id, wx.getStorageSync('userInfo').id), SHARE_SERVICE.tag()])

      // 设置数据
      this.setData({
        tutor: detail.data.author,
        follow: detail.data.is_like,
        setup: OPTIONS.id == wx.getStorageSync('userInfo').author_id,
        'course.list': detail.data.course,
        'tag.list': tag.data,
        userInfo: wx.getStorageSync('userInfo'),
      })

      //设置状态
      container.status('default')
    } catch (e) {

      //设置状态
      container.status('error', e.message)
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {

    // 获取参数
    OPTIONS = options

    // 初始化数据
    await this.init()

    // 初始化tab
    this.selectComponent('#tab').init(1)
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

    // 获取tab下标
    const tab = this.selectComponent('#tab').index().contentIndex

    // 动态
    if (tab == 1) {

      // 获取动态下标
      const share = this.selectComponent('#material-container').index().contentIndex

      // 动态加载
      this.selectAllComponents('.share-material-list')[share].onReachBottom()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

    // 分享
    return UTIL.share()
  }
})