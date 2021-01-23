const
  UTIL = require('../../../utils/util'),
  AUTH = require('../../../utils/auth'),
  COMMODITY_SERVICE = require('../../service/commodity.service'),
  CART_SERVICE = require('../../service/cart.service');

let GOODSID
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 0,
    goods_id: null,
    show: false,
    details: {},
    currentSwiper: 1,
    money: null,
    specs: null,
    specsContent: '',
    specsList: [],
    size_money: [],
    size_id: null,
    // size_money_obj: {}, 
    priceStork: null, //规格不同 库存不同
    number: 1,
    unitPrice: null, // 单价
    totalMoeny: null, // 总价
    type: 0 //选择规格弹出类型显示不同按钮
  },
  // 轮播图
  swiperChange(event) {
    let current = event.detail.current
    this.setData({
      current
    })
  },
  onClose() {
    this.setData({
      show: false
    });
  },

  handleCloseClick() {
    this.setData({
      show: false
    })
  },
  // 返回
  goBack() {
    //console.log('返回')
  },
  share() {
    //console.log('分享')
  },
  // 购物车
  onCart() {
    wx.navigateTo({
      url: `/shopping/pages/shopping-cart/shopping-cart`
    })
  },
  // 选择规格弹窗
  chooseNorm(e) {
    // 0规格 1加入购物车 2立即购买
    let type = e.currentTarget.dataset.type

    //console.log(type)
    this.setData({
      show: true,
      type: type
    });
  },
  // 子组件
  handleChoiceSpecs(e) {
    //console.log(e.detail)
    this.setData({
      specs: e.detail
    })
  },
  // 父组件
  choiceSpecs(e) {
    const idx = e.currentTarget.dataset.idx
    this.data.specsList[idx] = this.data.specs
    let specsListStr = this.data.specsList.toString()
    //console.log(specsListStr)
    for (const item of this.data.size_money) {
      if (item.size_list == specsListStr) {
        //console.log(item)
        this.setData({
          unitPrice: item.money,
          specsContent: item.size_list_info,
          priceStork: item.stock,
          size_id: item.id,
          money: item.money
        })
      }
    }
  },
  // 选择数量
  chiceNumber(e) {
    //console.log(e.detail)
    this.setData({
      number: e.detail
    })
  },
  async init(id) {

    // 获取容器
    const container = this.selectComponent('#container')

    try {

      // 检测登录
      await AUTH.loginStatus()

      // 获取数据
      const result = await COMMODITY_SERVICE.commodityDetails(this.data.goods_id, wx.getStorageSync('userInfo').id)
      this.setData({
        details: result.data,
        size_money: result.data.size_money,
        number: result.data.siglebuyleast
      })
      this.formatSizeList(result.data.size_list, result.data.size_money)
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

  // 格式化 specsList
  formatSizeList(size_list, size_money) {
    let list = []
    for (const item of size_list) {
      list.push(item.value[0].id)
    }
    this.setData({
      specsList: list,
      unitPrice: size_money[0].money * 1,
      specsContent: size_money[0].size_list_info,
      priceStork: size_money[0].stock,
      size_id: size_money[0].id,
      money: size_money[0].money
    })
  },

  // 立即购买
  buyNow() {
    // 库存不足
    if (this.data.priceStork == 0) {
      wx.showToast({
        title: '库存不足',
        icon: 'none',
        duration: 2000
      })
      return
    }
    let params = {
      uid: wx.getStorageSync('userInfo').id,
      num: this.data.number,
      goods_id: this.data.details.id,
      size_id: this.data.size_id
    }
    params = JSON.stringify(params)
    wx.navigateTo({
      url: `/shopping/pages/confirm-order/confirm-order?params=${params}`
    })
  },
  // 加入购物车
  addCart() {
    // 库存不足
    if (this.data.priceStork == 0) {
      wx.showToast({
        title: '库存不足',
        icon: 'none',
        duration: 2000
      })
      return
    }
    let
      uid = wx.getStorageSync('userInfo').id,
      num = this.data.number,
      goods_id = this.data.details.id,
      size_id = this.data.size_id;

    // 添加购物车
    CART_SERVICE.addCart(uid, goods_id, num, size_id).then(res=>{
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
      this.onClose()
    })
  },
  saveImage(e) {
    let url = e.currentTarget.dataset.url;
    //console.log(url)
    let arr = url.split('"')
    //console.log(arr[1])
    wx.saveImageToPhotosAlbum({
      filePath: arr[1],
      success(res) {
        //console.log(res);
      },
      fail(res) {
        //console.log(res);
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options)
    this.setData({
      goods_id: options.id
    })
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
    // this.init()
    // wx.stopPullDownRefresh()
    // //console.log(this.data.goods_id)
    // this.onLoad({
    //   id: this.data.goods_id
    // })
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