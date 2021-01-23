const
  AUTH = require('../../../utils/auth'),
  UTIL = require('../../../utils/util'),
  CHAIN_SERVICE = require('../../service/chain.service');
/**
 * 搜索首页

 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    history: [], // 历史记录
    keyword:''
  },
  // 获取搜索内容
  onChange(e){
    this.setData({
      keyword:e.detail
    })
  },

  /**
   * 搜索
   */
  search(keyword) {
    // 跳转
    wx.navigateTo({
      url: `../search-list/search-list?keyword=${keyword}`,
      events: {
        init: () => this.init()
      }
    })
  },

  /**
   * 清除历史记录
   */
  clearHistory() {
    wx.showModal({
      title: '提示',
      content: '确认清除吗？',
      success: async res => {
        if (res.confirm) {

          try {

            // 显示加载
            wx.showLoading({
              mask: true,
            })

            // 获取数据
            const result = await CHAIN_SERVICE.clearSearch(wx.getStorageSync('userInfo').id)

            // 设置数据
            this.setData({
              history: []
            })

            // 隐藏加载
            wx.hideLoading()

            // 提示
            wx.showToast({
              title: result.msg,
              icon: 'none',
            })
          } catch (e) {

            // 隐藏加载
            wx.hideLoading()

            // 提示
            wx.showToast({
              title: e.message,
              icon: 'none'
            })
          }
        }
      }
    })
  },

  /**
   * 标签搜索
   */
  tagSearch(e) {
    // 搜索
    this.search(e.currentTarget.dataset.keyword)
  },

  /**
   * 搜索提交
   */
  submit(e) {
    try {
      // 获取搜索关键词
      const keyword = this.data.keyword.trim()
      //console.log(keyword)
      // 验证
      UTIL.check(keyword, '关键词不能为空')
      var regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im,
        regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;

      if (regEn.test(keyword) || regCn.test(keyword)) {
        // alert("名称不能包含特殊字符.");
        wx.showToast({
          title:"名称不能包含特殊字符",
          icon: 'none'
        })
        return false;
      } else {
        // 搜索
        this.search(keyword)
      }
    } catch (e) {
      // 提示
      wx.showToast({
        title: e.message,
        icon: 'none',
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
      // 获取数据
      const result = await CHAIN_SERVICE.historySearch(wx.getStorageSync('userInfo').id)

      // 设置数据
      this.setData({
        history: result.data
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
    this.init()
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