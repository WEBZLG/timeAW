const
  UTIL = require('../../../utils/util'),
  AUTH = require('../../../utils/auth'),
  ORDER_SERVICE = require('../../service/order.service')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    number: null,
    order_id: '',
    virtual_name: '',
    steps: [{
        text: '快件已由西溪水岸快递服务站49幢2单XXX菜鸟驿站代 收，请及时取件，如有疑问请联系181671XXXXX',
        desc: '2016-10-07 11:49:42',
      },
      {
        text: '客户签收人: 邮件收发章 已签收 感谢使用圆通速递， 期待再次为您服务',
        desc: '2016-10-07 11:49:42',
      },
      {
        text: '客户签收人: 邮件收发章 已签收 感谢使用圆通速递， 期待再次为您服务',
        desc: '2016-10-07 11:49:42',
      },
      {
        text: '客户签收人: 邮件收发章 已签收 感谢使用圆通速递， 期待再次为您服务',
        desc: '2016-10-07 11:49:42',
      },
    ],
  },

  // 初始化
  async init(id) {

    // 获取容器
    const container = this.selectComponent('#container')

    try {

      // 检测登录
      await AUTH.loginStatus()

      // 获取数据
      const result = await ORDER_SERVICE.logistics(this.data.number, this.data.order_id)
      for (const item of result.data.virtual_info) {
        delete item.desc
      }
      const res1 = JSON.parse(JSON.stringify(result.data.virtual_info).replace(/context/g, "text"));
      const res2 = JSON.parse(JSON.stringify(res1).replace(/ftime/g, "desc"));
      this.setData({
        steps: res2
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      number: options.number,
      virtual_name: options.virtual_name,
      order_id: options.order_id
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