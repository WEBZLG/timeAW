const
  UTIL = require('../../../utils/util'),
  LIVE_SERVICE = require('../../../service/live.service')
/**
 * 申请直播
 * 2020/9/28
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form: {
      realname: '',
      idcard: '',
      wxcode: '',
      phone: ''
    }
  },

  /**
   * 输入
   */
  onInput(e) {
    // 获取参数
    const form = this.data.form

    // 设置参数
    form[e.currentTarget.dataset.name] = e.detail.value

    // 设置数据
    this.setData({
      form
    })
  },

  /**
   * 提交
   */
  async onSubmit() {
    try {

      // 显示加载
      wx.showLoading()

      // 获取数据
      const {
        realname,
        idcard,
        wxcode,
        phone,
      } = this.data.form

      UTIL.check(realname, '请填写真实姓名')
      UTIL.check(idcard, '请填写正确的身份证号', /(^\d{18}$)|(^\d{17}(\d|X|x)$)/)
      UTIL.check(wxcode, '请填写正确的微信号码', /^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$/)
      UTIL.check(phone, '请输入正确的手机号码', /^1\d{10}$/)

      // 申请
      await LIVE_SERVICE.apply({
        real_name: realname,
        idcard: idcard,
        mobile: phone,
        user_id: wx.getStorageSync('userInfo').id,
        anchor_wechat: wxcode,
      })

      // 触发刷新
      this.getOpenerEventChannel().emit('init')

      wx.showModal({
        content: "提交成功，请等待审核",
        showCancel: false,
        success: () => {

          // 后退
          wx.navigateBack()
        },
      })
    } catch (e) {

      // 显示提示
      wx.showModal({
        content: e.message,
        showCancel: false,
      })
    } finally {

      // 隐藏加载
      wx.hideLoading()
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},

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

    // 分享
    return UTIL.share()
  }
})