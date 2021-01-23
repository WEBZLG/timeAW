const
  UTIL = require('../../utils/util'),
  STOCK_SERVCIE = require('../../service/stock.service')

/**
 * 补卡申请
 * 陈浩、李帮鑫
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    replenish: {}, // 补卡信息
    superior: {}, // 上级信息
    count: 0, // 统计卡数
    picture: '' // 打款截图
  },

  /**
   * 移除图片
   */
  removeImage() {
    this.setData({
      picture: ''
    })
  },

  /**
   * 选择图片
   */
  chooseImage() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        this.setData({
          picture: res.tempFilePaths[0]
        })
      }
    })
  },

  /**
   * 学习卡增加
   */
  increase() {

    // 获取参数
    const {
      count,
      replenish
    } = this.data

    // 判断最大库存选择
    if (Number(replenish.max) <= Number(count)) return

    // 设置数据
    this.setData({
      count: Number(count) + 1
    })
  },

  /**
   * 学习卡减少
   */
  decrease() {

    // 获取参数
    const {
      count,
      replenish
    } = this.data

    // 判断最小库存选择
    if (Number(replenish.min) >= Number(count)) return

    // 设置数据
    this.setData({
      count: Number(count) - 1
    })
  },

  /**
   * 提交申请
   */
  async submit(e) {

    try {

      // 显示加载
      wx.showLoading({
        mask: true,
      })

      // 获取参数
      const {
        picture,
        count
      } = this.data

      // 验证
      UTIL.check(picture, '须上传打款截图')

      // 发送图片
      const upload = await STOCK_SERVCIE.upload(picture)

      // 发送请求
      const result = await STOCK_SERVCIE.apply(wx.getStorageSync('userInfo').id, count, upload.data)

      // 隐藏加载
      wx.hideLoading()

      // 弹出事件
      this.getOpenerEventChannel().emit('init')

      // 显示提示
      wx.showModal({
        content: result.msg,
        showCancel: false,
        success: () => wx.navigateBack()
      })
    } catch (e) {

      // 隐藏加载
      wx.hideLoading()

      // 提示
      wx.showToast({
        title: e.message,
        icon: 'none',
      })
    }
  },

  /**
   * 初始化数据
   */
  async init() {

    try {

      // 获取数据
      const [replenish, superior] = await Promise.all([STOCK_SERVCIE.replenish(wx.getStorageSync('userInfo').id), STOCK_SERVCIE.superior(wx.getStorageSync('userInfo').id)])

      // 设置数据
      this.setData({
        replenish: replenish.data,
        superior: superior.data,
        count: replenish.data.min
      })
    } catch (e) {

      // 提示
      console.error(e)
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

    // 返回分享
    return UTIL.share()
  }
})