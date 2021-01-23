const UTIL = require('../../utils/util')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressdata: [],
    carddata: [],
    all_card_num: 0,
    card_stock: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.addressdata_fuc();
    this.card_stock_fuc();
    this.carddata_fuc();
  },
  //加载初始数据
  addressdata_fuc: function() {
    var th = this;
    var uid = wx.getStorageSync('userInfo').id;
    wx.request({
      url: getApp().globalData.url.host + '/api/course/address_default',
      method: 'post',
      data: {
        uid: uid
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        //console.log(res.data.data);
        var result = res.data.data;
        th.setData({
          addressdata: result,
        })
      }
    })
  },
  //加载初始数据
  carddata_fuc: function() {
    var th = this;
    var uid = wx.getStorageSync('userInfo').id;
    wx.request({
      url: getApp().globalData.url.host + '/api/course/take_list',
      method: 'post',
      data: {
        uid: uid
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        //console.log(res.data.data);
        var result = res.data.data;

        result.forEach(item => {
          item.goods_num = 0
        })

        th.setData({
          carddata: result
        })
      }
    })
  },
  //初始用户库存接口
  card_stock_fuc: function() {
    var th = this;
    var uid = wx.getStorageSync('userInfo').id;
    wx.request({
      url: getApp().globalData.url.host + '/api/course/my_card',
      method: 'post',
      data: {
        uid: uid
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        //console.log(res.data.data);
        var result = res.data.data;
        th.setData({
          card_stock: result
        })
      }
    })
  },
  //加
  add: function(e) {
    var carddata = this.data.carddata //获取列表
    var index = e.currentTarget.dataset.index //获取当前点击事件的下标索引
    var goods_num = carddata[index].goods_num //获取里面的goods_num值

    goods_num++
    carddata[index].goods_num = goods_num;
    this.setData({
      carddata: carddata
    });
    this.getsumTotal()
  },
  //减
  reduce: function(e) {
    var carddata = this.data.carddata //获取列表
    var index = e.currentTarget.dataset.index //获取当前点击事件的下标索引
    var goods_num = carddata[index].goods_num //获取里面的goods_num值

    if (goods_num == 0) {
      goods_num--
      carddata[index].goods_num = 0
    } else {
      goods_num--
      carddata[index].goods_num = goods_num;
    }
    this.setData({
      carddata: carddata
    });
    this.getsumTotal()
  },
  //计算总和
  getsumTotal: function() {
    var sum = 0
    for (var i = 0; i < this.data.carddata.length; i++) {
      sum += this.data.carddata[i].goods_num
    }
    //更新数据
    this.setData({
      all_card_num: sum
    })
  },
  //跳转地址列表
  goAddress: function() {
    wx.navigateTo({
      url: '/pages/address/address',
      events: {
        address: (addressdata) => {
          wx.navigateBack()
          this.setData({
            addressdata
          })
        }
      }
    })
  },
  onReady: function() {
    //获得popup组件
    this.popup = this.selectComponent("#popup");
  },
  //提交数据
  take_submit: function() {
    var th = this;
    var card_stock = th.data.card_stock;
    if (card_stock == 0 || card_stock == null) {
      wx.showToast({
        title: '库存不足,请补足库存',
        icon: 'none'
      })
      return false
    }
    var all_card_num = th.data.all_card_num;
    if (all_card_num < 5) {
      wx.showToast({
        title: '请至少选择5张',
        icon: 'none'
      })
      return false
    }
    if (all_card_num > card_stock) {
      wx.showToast({
        title: '提卡数量不能大于库存',
        icon: 'none'
      })
      return false
    }
    if (!th.data.addressdata) {
      wx.showToast({
        title: '请选择收货地址',
        icon: 'none'
      })
      return false
    }
    var address_id = th.data.addressdata.id;
    var carddata = th.data.carddata;
    var card_ids = "";
    var nums = "";
    for (var i = 0; i < carddata.length; i++) {
      if (carddata[i].goods_num != 0) {
        card_ids += carddata[i].id + ",";
        nums += carddata[i].goods_num + ",";
      }
    }
    card_ids = card_ids.slice(0, -1);
    nums = nums.slice(0, -1);
    var uid = wx.getStorageSync('userInfo').id;
    //数据请求
    wx.request({
      url: getApp().globalData.url.host + '/api/course/take_card',
      data: {
        uid: uid,
        address_id: address_id,
        card_ids: card_ids,
        nums: nums,
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function(res) {
        //console.log(res);
        var code = res.data.code;
        if (code == 1) {

          th.getOpenerEventChannel().emit('init')

          wx.showModal({
            content: res.data.msg,
            showCancel: false,
            success: () => wx.navigateBack()
          })
        } else {
          wx.showToast({
            title: res.data.msg,
          })
          return false
        }
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

    // 分享
    return UTIL.share()
  }
})