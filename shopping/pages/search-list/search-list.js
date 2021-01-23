// shopping/pages/search-list/search-list.js
const
  AUTH = require('../../../utils/auth'),
  UTIL = require('../../../utils/util'),
  CHAIN_SERVICE = require('../../service/chain.service');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyword:'',
    datalist:[]
  },
  // 获取搜索内容
  onChange(e){
    this.setData({
      keyword:e.detail
    })
  },
  // 商品详情
  goodsDetail(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../commodity-details/commodity-details?id=' + id,
    })
  },
   /**
   * 初始化数据
   */
  async init() {
    // 获取容器
    const container = this.selectComponent('#container')
    try {
      // 获取数据
      const result = await CHAIN_SERVICE.keySearch(wx.getStorageSync('userInfo').id,this.data.keyword)

      // 设置数据
      this.setData({
        datalist: result.data
      })

      // 设置状态
      container.status('default')
    } catch (e) {
      // 设置状态
      container.status('error', e.message)
    }
  },

   /**
   * 搜索
   */
  search(e) {
    try {
      // 获取搜索关键词
      const keyword = this.data.keyword.trim()
      // 验证
      UTIL.check(keyword, '关键词不能为空')
      // 设置关键词
      this.setData({
        keyword
      })
      this.init()
    } catch (e) {
      // 提示
      wx.showToast({
        title: e.message,
        icon: 'none'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取参数
    this.setData({
      keyword: options.keyword
    })

    // 初始化数据
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
    // 分享
    return UTIL.share()
  }
})