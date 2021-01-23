const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data_arr: [],
    text_val: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var id = options.id;
    this.data_fuc(id);
  },
  //加载初始库存数据
  data_fuc: function(id) {
    var th = this;
    var uid = wx.getStorageSync('userInfo').id;
    wx.request({
      url: getApp().globalData.url.host + '/api/course/auditing_info',
      method: 'post',
      data: {
        auditing_id: id
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        //console.log(res.data.data);
        var result = res.data.data;
        th.setData({
          data_arr: result,
        })
      }
    })
  },
  //数据
  text_val_fuc: function(e) {
    var th = this;
    th.setData({
      text_val: e.detail.value
    })
  },
  onReady: function() {},
  //驳回
  auditing_fail: function(e) {
    var th = this;
    var text_val = th.data.text_val;
    if (text_val == "") {
      wx.showToast({
        title: '请输入驳回理由',
        icon: 'loading',
        duration: 1000
      })
      return false
    }
    var auditing_id = th.data.data_arr.id;
    wx.request({
      url: getApp().globalData.url.host + '/api/course/auditing_fail',
      method: 'post',
      data: {
        auditing_id: auditing_id,
        other: text_val
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        //console.log(res.data.data);
        if (res.data.code == 1) {

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
        }
      }
    })
  },
  //同意
  auditing_agree: function(e) {
    var th = this;
    var auditing_id = th.data.data_arr.id;
    wx.request({
      url: getApp().globalData.url.host + '/api/course/auditing_agree',
      data: {
        auditing_id: auditing_id
      },
      success(res) {
        console.log(res.data);
        if (res.data.code == 1) {

          th.getOpenerEventChannel().emit('init')

          wx.showModal({
            content: res.data.msg,
            showCancel: false,
            success: () => wx.navigateBack()
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },
})