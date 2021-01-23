// shopping/pages/supply-chain/supply-chain.js
const
  UTIL = require('../../../utils/util'),
  AUTH = require('../../../utils/auth'),
  CHAIN_SERVICE = require('../../service/chain.service');
let PAGE = 1
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [],
    hotSaleList: [],
    hotreList: [],
    liveList: [],
    recommendList: [],
    finished: false
  },
  // 搜索
  onSearch() {
    wx.navigateTo({
      url: '../search/search',
    })
  },
  // 初始化
  async init(id) {

    // 获取容器
    const container = this.selectComponent('#container')

    try {

      // 检测登录
      await AUTH.loginStatus()

      // 获取banner数据
      const bannerResult = await CHAIN_SERVICE.banner()
      this.setData({
        bannerList: bannerResult.data
      })
      // 获取热销数据
      const hotResult = await CHAIN_SERVICE.hotSale()
      this.setData({
        hotSaleList: hotResult.data
      })
      // 获取爆品数据
      const hotreResult = await CHAIN_SERVICE.hotRecommend()
      let hotList = hotreResult.data.res
      let hotListLength = hotreResult.data.res.length
      let num = parseInt(hotListLength / 3);
      let arr = [];
      for (let i = 0; i < num; i++) {
        let newArr = []
        for (var j = 0; j < 3; j++) {
          newArr.push(hotList[j])
        }
        arr.push(newArr)
      }
      if (hotListLength % 3 != 0) {
        let newArr = []
        for (let k = (num * 3); k < hotListLength; k++) {
          newArr.push(hotList[k])
        }
        arr.push(newArr)
      }
      this.setData({
        hotreList: {
          res:arr,
          category_id:hotreResult.data.category_id
        }
      })
      // 获取活动分类数据
      const liveResult = await CHAIN_SERVICE.liveShopshow()
      this.setData({
        liveList: liveResult.data
      })
      // 获取为你推荐数据
      const reResult = await CHAIN_SERVICE.recommendedYou(PAGE)
      this.setData({
        recommendList: reResult.data.res
      })

      // 设置状态
      // container.status(result.data.length <= 0 ? 'empty' : 'canload')
      container.status('default')
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
  // 加载更多
  async loadMore() {
    let _this = this
    const container = this.selectComponent('#container')
    PAGE++
    if (this.data.finished) {
      return
    }
    wx.showLoading({
      title: '加载中',
    })
    try {
      const result = await CHAIN_SERVICE.recommendedYou(PAGE)
      if (result.data.res.length == 0) {
        PAGE--
        this.setData({
          finished: true
        })
        wx.hideLoading()
      } else {
        this.setData({
          recommendList: _this.data.recommendList.concat(result.data.res)
        })
        wx.hideLoading()
      }
    } catch (e) {
      wx.hideLoading()
      container.status('error', e.message)
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    PAGE=1
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
    wx.showLoading({
      title: '加载中',
    })
    PAGE = 1
    this.setData({
      finished: false
    })
    wx.stopPullDownRefresh()
    this.init()
    wx.hideLoading()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.loadMore()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    // 分享
    return UTIL.share()
  }
})