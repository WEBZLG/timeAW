// shopping/pages/shopping-cart/shopping-cart.js
const
  UTIL = require('../../../utils/util'),
  AUTH = require('../../../utils/auth'),
  CART_SERVICE = require('../../service/cart.service');
  let PAGE=1
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartList: [],
    result: [],
    checkedAll: false,
    totalPrice: 0,
    check_goods:[],
    checkGoods: [],
    isexit: false,
    exit: '编辑',
    finished: false
  },
  // 商品详情
  goodsDetail(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../commodity-details/commodity-details?id=' + id,
    })
  },
  // 初始化
  async init(id) {
    // 获取容器
    const container = this.selectComponent('#container')
    try {
      // 检测登录
      await AUTH.loginStatus()
      // 获取购物车数据
      const cartResult = await CART_SERVICE.cartList(wx.getStorageSync('userInfo').id,PAGE)
      this.setData({
        cartList: cartResult.data
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
    const container = this.selectComponent('#container')
    PAGE++
    if (this.data.finished) {
      return
    }
    wx.showLoading({
      title: '加载中',
    })
    try {
      const result = await CART_SERVICE.cartList(PAGE)
      if (result.data.length == 0) {
        this.setData({
          finished: true
        })
        wx.hideLoading()
      } else {
        this.setData({
          cartList: this.data.cartList.concat(result.data)
        })
        wx.hideLoading()
      }
    } catch (e) {
      wx.hideLoading()
      container.status('error', e.message)
    }

  },
  // 商品数量
  onChangeNum(event) {
    //console.log(event)
    var items = this.data.cartList //获取购物车列表
    var index = event.currentTarget.dataset.index; //获取当前点击事件的下标索引
    var least = event.currentTarget.dataset.least; //获取当前点击事件的下标索引
    if(least>=event.detail){
      wx.showToast({
        title: '受不了了，宝贝不能再减少了哦~',
        icon:'none'
      })
    }
    items[index].goods_num = event.detail //获取购物车里面的value值
    this.setData({
      cartList: items
    });
    
    this.getTotalPrice(); // 重新获取总价
  },

  // // 复选
  onChangeCheck(event) {
    let _this = this
    console.log(event)
    this.setData({
      result: event.detail,
      checkGoods: [],
      check_goods:event.detail.map(res=>{
        return res.split('-')[0]
      }),
      // check_size:event.detail.map(res=>{
      //   return res.split(',')[1]
      // })
    });
    console.log(this.data.check_goods)
    this.data.result.length == this.data.cartList.length ? this.setData({
      checkedAll: true
    }) : this.setData({
      checkedAll: false
    })

    this.data.cartList.map(item => {
      _this.data.result.map(res => {
        if ((item.goods_id+'-'+item.size_id) == res) {
          _this.setData({
            checkGoods: _this.data.checkGoods.concat(item)
          })
        }
      })
    })
    this.getTotalPrice(); // 重新获取总价
  },

  // 全选
  onChangeAll(event) {
    let _this = this
    this.setData({
      checkedAll: event.detail
    })
    let check = this.data.checkedAll
    if (check == true) {
      _this.data.cartList.map(item => {
        _this.setData({
          result:_this.data.result.concat(item.goods_id+'-'+item.size_id),
          check_goods: _this.data.check_goods.concat(item.goods_id),
          checkGoods: _this.data.checkGoods.concat(item)
        })
      })
    } else {
      _this.setData({
        result: [],
        check_goods:[],
        checkGoods: []
      })
    }
    this.getTotalPrice(); // 重新获取总价
  },
  // 总价
  getTotalPrice() {
    let items = this.data.checkGoods;
    let total = 0;
    for (let i = 0; i < items.length; i++) {
      total += Number(items[i].goods_num) * Number(items[i].money);
    }
    this.setData({
      totalPrice: total * 100
    });
    //console.log(this.data.totalPrice)
  },
  // 编辑
  onExit() {
    this.data.isexit == false ? this.setData({
      isexit: true,
      exit: '取消'
    }) : this.setData({
      isexit: false,
      exit: '编辑'
    })
  },

  // 删除商品
  onDelete() {
    let _this = this
    let uid = wx.getStorageSync('userInfo').id
    let gid = this.data.check_goods.join(',')
    let nums = this.data.checkGoods.map(res => {
      return res.goods_num
    }).join(',')
    let sid = this.data.checkGoods.map(res => {
      return res.size_id
    }).join(',')
    if (this.data.checkGoods.length == 0) {
      wx.showToast({
        title: '请选择要删除的商品',
        icon: 'none'
      })
      return false;
    } else {
      wx.showModal({
        title: '提示',
        content: '确定要删除吗？',
        success: function (sm) {
          if (sm.confirm) {
            CART_SERVICE.reduceCart(uid, gid, nums, sid).then(res=>{
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 1000
              })
              _this.setData({
                result: [],
                check_goods:[],
                checkGoods: []
              })
              setTimeout(function () {
                _this.init()
              }, 1000)
            })

          } else if (sm.cancel) {
            //console.log('用户点击取消')
          }
        }
      })
    }
  },
  onSubmit() {
    if (this.data.checkGoods.length == 0) {
      wx.showToast({
        title: '请选择要购买的商品',
        icon: 'none'
      })
      return false;
    } else {
      let params = {
        uid: wx.getStorageSync('userInfo').id,
        num: this.data.checkGoods.map(res => {
          return res.goods_num
        }).join(','),
        goods_id: this.data.check_goods.join(','),
        size_id: this.data.checkGoods.map(res => {
          return res.size_id
        }).join(','),
        is_cart:1
      }
      params = JSON.stringify(params)
      wx.navigateTo({
        url: `/shopping/pages/confirm-order/confirm-order?params=${params}`
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.init()
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
      finished: false,
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