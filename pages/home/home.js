const
  UTIL = require('../../utils/util'),
  AUTH = require('../../utils/auth'),
  HOME_SERVICE = require('../../service/home.service'),
  USERINFO_SERVICE = require('../../service/userInfo.service'),
  SYSTEM_SERVICE = require('../../service/system.service'),
  LEVEL_SERVICE = require('../../service/system.service')
/**
 * 首页
 * 陈浩 2019/7/4
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mainCourse: false, // 时间与崇尚主营课
    swiper: {
      options: {
        autoplay: true,
        circular: true,
        indicatorDots: false,
        indicatorColor: 'rgba(255, 255, 255, 0.4)',
        indicatorActiveColor: 'rgba(0, 0, 0, 0.6)'
      }, // 配置
      index: 0, // 下标
      list: [], // 列表
    }, // 轮播
    nav: {
      list: [] // 列表
    }, // 导航
    panel: [], // 板块
    groupId: '', // 用户等级
  },

  /**
   * 轮播切换
   */
  swiperChange(e) {
    this.setData({
      'swiper.index': e.detail.current
    })
  },

  /**
   * 点击轮播
   */
  swiperTap(e) {

    // 获取参数
    const swiper = this.data.swiper.list[e.currentTarget.dataset.index]

    // 判断是否则跳转
    if (swiper.is_jump == 1) {
      wx.navigateTo({
        url: `/pages/web-view/web-view?src=${encodeURIComponent(swiper.href)}`
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
    

      // 请求队列
      const request = [HOME_SERVICE.detail(wx.getStorageSync('userInfo').id), SYSTEM_SERVICE.get()]

      try {

        // 判断登录
        await AUTH.loginStatus()

        // 获取用户信息
        request.push(USERINFO_SERVICE.get(wx.getStorageSync('userInfo').id))
      } catch (e) {

        // 警告信息
        console.warn('用户未登录')
      }

      // 获取数据
      const [result, system] = await Promise.all(request)

      // 获取系统信息
      system.data.forEach(item => {
        getApp().globalData.system[item.name] = item.value
      })

      // getApp().globalData.system.maincourse = 1

      // 设置数据
      this.setData({
        mainCourse: getApp().globalData.system.maincourse == 1,
        'swiper.list': result.data.banner,
        'nav.list': result.data.nav,
        panel: result.data.list,
        groupId: wx.getStorageSync('userInfo').group_id||''
      })
      // console.log(this.data.groupId)

      // 
      if (getApp().globalData.system.maincourse == 1) {

        // 设置状态
        container.status('default')
      } else {
        setTimeout(() => {
          // 切换tab
          wx.switchTab({
            url: '/pages/share/share',
          })
        }, 1000);
      }
    } catch (e) {

      // 设置状态
      container.status('error', e.message)
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {

    // 隐藏TAB
    wx.hideTabBar()

    // 初始化数据
    await this.init()

    // 主营课
    if (getApp().globalData.system.maincourse == 1) {

      // 显示TAB
      wx.showTabBar()
    }

    // 跳转至enter页
    UTIL.router(getApp().globalData.pages.enter)
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

    try {

      // 验证登录
      await AUTH.loginStatus()

      // 获取信息
      UTIL.message()

      // 控制等级
      LEVEL_SERVICE.levelControl(wx.getStorageSync('userInfo').id)
    } catch (e) {

      // 警告信息
      console.warn('用户未登录')
    }
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