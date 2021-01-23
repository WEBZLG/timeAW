const
  UTIL = require('../../utils/util'),
  PRIVILEGE_SERVICE = require('../../service/privilege.service'),
  USERINFO_SERVICE = require('../../service/userInfo.service')

let OPTIONS

/**
 * 代理商详情
 * 陈浩、于家辉
 * 2019/7/30
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    superior: {}, // 上级信息
    poster: '', // 海报
    card: 0 // 卡片数量
  },

  /**
   * 打开弹窗
   */
  openPopup() {
    // this.selectComponent('#popup').open()
    wx.showToast({
      title: '暂未开放',
      icon: 'none',
      duration: 2000
    })
  },

  /**
   * 提交
   */
  async submit(e) {

    try {

      // 加载
      wx.showLoading({
        mask: true,
      })

      // 获取用户信息
      const userInfo = await USERINFO_SERVICE.get(wx.getStorageSync('userInfo').id)

      // 获取参数
      const
        id = OPTIONS.id,
        group_id = userInfo.data.group_id,
        picture = e.detail.value.picture
       
      // 验证
      UTIL.check(picture, '请上传打款截图')
      UTIL.check(id >= group_id, '您已开通更高级别')
      UTIL.check(id != group_id, '您已经是此级别')

      // 提交申请
      const apply = await PRIVILEGE_SERVICE.apply(wx.getStorageSync('userInfo').id, OPTIONS.id)

      // 上传图片
      const upload = await PRIVILEGE_SERVICE.upload(apply.data, picture)

      // 提示
      wx.showModal({
        content: apply.msg,
        showCancel: false,
        success: () => wx.navigateBack()
      })
    } catch (e) {

      // 提示
      wx.showModal({
        content: e.message,
        showCancel: false
      })
    } finally {

      // 隐藏
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
      const result = await PRIVILEGE_SERVICE.get(OPTIONS.id, wx.getStorageSync('userInfo').id)

      // 设置数据
      this.setData({
        superior: result.data.parent_info, // 上级信息
        poster: result.data.shop_info, // 海报
        card: result.data.card_num // 学习卡数量
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

    // 获取参数
    OPTIONS = options

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