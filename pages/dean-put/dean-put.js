const
  UTIL = require('../../utils/util'),
  DEAN_SERVICE = require('../../service/dean.service')

/**
 * 院长信息编辑
 * 陈浩
 * 2019/8/8
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dean: {} // 院长信息
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

      // 获取参数
      const {
        avatar,
        name,
        label,
        description
      } = e.detail.value

      // 验证数据
      UTIL.check(avatar, '请上传头像')
      UTIL.check(name, '请输入姓名')
      UTIL.check(label, '请输入标签')
      // UTIL.check(description, '请输入个人风采')
      
      // 上传头像
      const upload = (new RegExp(/tmp/)).test(avatar) ? (await DEAN_SERVICE.upload(avatar)).data.file : avatar

      // 提交数据
      const result = await DEAN_SERVICE.post(wx.getStorageSync('userInfo').id, upload, name, label, description)

      // 弹出事件
      this.getOpenerEventChannel().emit('init')

      // 显示提示
      wx.showModal({
        content: result.msg,
        showCancel: false,
        success: () => wx.navigateBack()
      })
    } catch (e) {

      // 显示提示
      wx.showModal({
        content: e.message,
        showCancel: false
      })
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
      const result = await DEAN_SERVICE.get(wx.getStorageSync('userInfo').id)

      // 设置数据
      this.setData({
        dean: result.data
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