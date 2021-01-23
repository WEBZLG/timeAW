// pages/my-cdkey/my-cdkey.js
const CDKEY_SERVICE = require('../../service/cdkey.service')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    empty: true,
    stock: 0,
    current: '1',
    showModal: false,
    number: 1,
    codeList: [],
    page: 1,
    finished: false
    // type: '1'
  },

  async init() {

    // console.log(wx.getStorageSync('userInfo').id)
    const container = this.selectComponent('#container')

    try {
      const result = await CDKEY_SERVICE.get(wx.getStorageSync('userInfo').id, this.data.current, this.data.page)
      console.log(result)
      this.setData({
        stock: result.data.stock,
        codeList: result.data.logs
      })
      console.log(this.data.codeList)
      if (this.data.codeList.length != 0) {
        this.setData({
          empty: false
        })
      } else {
        this.setData({
          empty: true
        })
      }
      container.status('default')
    } catch (error) {
      container.status('error')
    }
  },
  // 生成学习码按钮
  handleGenerateClick() {
    this.setData({
      showModal: true
    })
  },
  handleTabClick(event) {
    console.log(event.currentTarget.dataset.current)
    const _current = event.currentTarget.dataset.current;
    this.setData({
      page: 1,
      current: _current
    })
    this.init()
  },
  // 减
  handleSubtractClick() {
    if (this.data.number == 1) {
      wx.showToast({
        title: '最低一张',
        icon: 'none',
        duration: 2000
      })
      return
    }
    this.setData({
      number: this.data.number - 1
    })
  },
  // 加
  handleAddClick() {
    this.setData({
      number: this.data.number + 1
    })
  },
  // 确认兑换
  async handleConfirmClick() {
    wx.showLoading({
      title: '加载中',
    })
    try {
      const result = await CDKEY_SERVICE.exchange(wx.getStorageSync('userInfo').id, this.data.number)
      wx.hideLoading()
      this.setData({
        showModal: false
      })
      wx.showToast({
        title: '兑换成功',
        icon: 'success',
        duration: 2000
      })
      // tab切换到未使用
      this.setData({
        page: 1,
        current: 1
      })
      this.init()
    } catch (error) {
      console.log(error)
      wx.hideLoading()
      wx.showToast({
        title: error,
        icon: 'none',
        duration: 2000
      })
    }
  },
  // 复制学习码
  handleCopyClick(event) {
    console.log(event.currentTarget.dataset.code)
    wx.setClipboardData({
      data: event.currentTarget.dataset.code,
      success: async (res) => {
        wx.showToast({
          title: '复制成功',
        });
        console.log(res)
        const result = await CDKEY_SERVICE.codeCopy(event.currentTarget.dataset.id)
        console.log(result)
      }
    })
  },
  preventTouchMove() {
    this.setData({
      showModal: false
    })
  },
  // 点击蒙层关闭
  close() {
    this.setData({
      showModal: false
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
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
  async onReachBottom() {
    if (this.data.finished) {
      return
    }
    wx.showLoading({
      title: '加载中',
    })
    let list = this.data.codeList
    this.setData({
      page: this.data.page + 1
    })
    try {
      const result = await CDKEY_SERVICE.get(wx.getStorageSync('userInfo').id, this.data.current, this.data.page)
      console.log(result)
      if (result.data.logs.length != 0) {
        this.setData({
          codeList: list.concat(result.data.logs)
        })
      } else if (result.data.logs.length == 0) {
        this.setData({
          finished: true
        })
      }
      wx.hideLoading()

    } catch (error) {
      wx.hideLoading()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})