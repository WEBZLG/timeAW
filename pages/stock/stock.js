const
  UTIL = require('../../utils/util'),
  STOCK_SERVICE = require('../../service/stock.service')
/**
 * 我的卡包
 * 李邦鑫
 * 于家辉
 * 陈浩 2020/1/3
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    count: 0, // 统计
    stock: {
      list: [], //列表
      page: 1,
    }, // 库存
  },
  /**
   * 切换事件
   */
  async cardTab(e) {


    var that = this;
    if (this.data.currentTab === e.target.dataset.id) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.id,

      })
    }

    this.selectComponent('#container').status('default')

    // 初始化数据
    await this.init()
  },
  //详情跳转
  goCard_details(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/stock-detail/stock-detail?id=' + id,
      events: {
        init: () => this.init()
      }
    })
  },
  //补卡申请
  goGetCard() {
    wx.navigateTo({
      url: '/pages/stock-replenish/stock-replenish',
      events: {
        init: () => this.init()
      }
    })
  },
  //提卡申请
  goTakeCard() {
    wx.showToast({
      title: '暂未开放',
      icon: 'none'
    })

    // wx.navigateTo({
    //   url: '/pages/stock-take/stock-take',
    //   events: {
    //     init: () => this.init()
    //   }
    // })
  },
  //库存统计跳转
  goStockCount() {
    wx.navigateTo({
      url: '/pages/stock-count/stock-count',
    })
  },

  // 我的cdkey跳转
  goMyCdkey() {
    wx.navigateTo({
      url: '/pages/my-cdkey/my-cdkey',
    })
  },

  /**
   * 初始化数据
   */
  async init() {

    // 获取容器
    const container = this.selectComponent('#container')

    try {
      
      // 设置状态
      // container.status('init')

      // 获取数据
      const [count, list] = await Promise.all([STOCK_SERVICE.count(wx.getStorageSync('userInfo').id), STOCK_SERVICE.list(wx.getStorageSync('userInfo').id, this.data.currentTab, 1)])

      // 设置数据
      this.setData({
        count: count.data,
        'stock.list': list.data,
        'stock.page': 1
      })

      // 设置状态
      container.status(list.data.length > 0 ? 'canload' : 'default')
    } catch (e) {

      // 设置状态
      container.status('error', e.message)
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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
  async onPullDownRefresh() {

    // 初始化数据
    await this.init()

    // 停止下拉
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  async onReachBottom() {

    // 获取容器
    const container = this.selectComponent('#container')

    try {

      // 判断状态
      if (container.status() != 'canload') return

      // 初始化数据
      const list = await STOCK_SERVICE.list(wx.getStorageSync('userInfo').id, this.data.currentTab, this.data.stock.page + 1)

      // 设置数据
      this.setData({
        'stock.list': this.data.stock.list.concat(list.data),
        'stock.page': this.data.stock.page + 1
      })

      // 设置状态
      container.status(list.data.length > 0 ? 'canload' : 'default')
    } catch (e) {

      console.error(e)

      // 设置状态
      container.status('error', e.message)
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