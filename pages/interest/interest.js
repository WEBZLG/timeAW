const
  UTIL = require('../../utils/util'),
  INTEREST_SERVICE = require('../../service/interest.service'),
  USERINFO_SERVICE = require('../../service/userInfo.service')
/**
 * 兴趣
 * 陈浩
 * 2019/7/24
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    interest: {
      list: [], // 列表
      value: [] // 值
    } // 兴趣
  },

  /**
   * 兴趣更改
   */
  interestChange(e) {
    this.setData({
      'interest.value': e.detail.value
    })
  },

  /**
   * 提交
   */
  async submit(e) {

    try {

      // 显示加载
      wx.showLoading({
        mask: true,
      })

      // 获取兴趣
      const interestId = e.detail.value.interest.reduce((value, item) => {
        value.push(this.data.interest.list[item].id)
        return value
      }, []).join(',')

      // 获取数据
      const result = await INTEREST_SERVICE.post(wx.getStorageSync('userInfo').id, interestId)

      // 重新加载用户信息
      const userInfo = await USERINFO_SERVICE.get(wx.getStorageSync('userInfo').id)

      // 验证
      UTIL.check(userInfo.data.mobile, 5)

      // 返回
      // wx.navigateBack()
      wx.reLaunch({
        url: '/pages/home/home',
      })
    } catch (e) {

      if (e.message == 5) {

        // 未绑定电话 跳转至绑定电话页
        wx.redirectTo({
          url: '/pages/phone-post/phone-post',
        })
      } else {

        // 提示
        wx.showModal({
          content: e.message,
          showCancel: false
        })
      }
    } finally {

      // 隐藏加载
      wx.hideLoading()
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
      const result = await INTEREST_SERVICE.list()

      // 设置数据
      this.setData({
        'interest.list': result.data
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

    // 获取数据
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

  }
})