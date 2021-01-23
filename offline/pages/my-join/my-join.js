const AUTH = require('../../../utils/auth')

/**
 * 我的参与
 * 洪新
 * 2020/08/13
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    tabList: [
      {name: '全国沙龙门票'},
      {name: '班长课程门票'},
      {name: '院长课程门票'}
    ],
    courseList: [
      {
        id: 1,
        name: '月入六位数我只用了一个月的时间，阿巴阿巴',
        startTime: '2020年08月20日',
        endTime: '2020年09月20日',
        address: '黑龙江省哈尔滨市南岗区宣庆街138号'
      },
      {
        id: 2,
        name: '月入六位数我只用了一个月的时间阿巴阿巴',
        startTime: '2020年08月20日',
        endTime: '2020年09月20日',
        address: '黑龙江省哈尔滨市南岗区宣庆街138号'
      },
      {
        id: 3,
        name: '月入六位数我只用了一个月的时间阿巴阿巴',
        startTime: '2020年08月20日',
        endTime: '2020年09月20日',
        address: '黑龙江省哈尔滨市南岗区宣庆街138号'
      },
      {
        id: 4,
        name: '月入六位数我只用了一个月的时间阿巴阿巴',
        startTime: '2020年08月20日',
        endTime: '2020年09月20日',
        address: '黑龙江省哈尔滨市南岗区宣庆街138号'
      }
    ]
  },

  // 初始化
  async init() {
    // 获取容器
    const container = this.selectComponent('#container')
    // 判断登录状态
    await AUTH.loginStatus()

    // 获取我的参与


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

  // 切换标签
  handleTabClick(event) {
    this.setData({
      active: event.currentTarget.dataset.index
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})