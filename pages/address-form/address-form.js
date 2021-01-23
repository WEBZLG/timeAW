const
  UTIL = require('../../utils/util'),
  ADDRESS_SERVICE = require('../../service/address.service')
let OPTIONS
/**
 * 添加/修改 地址
 * 陈浩
 * 2018/12/4
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {}, // 地址参数
    region: [], // 地区
  },

  /**
   * 修改地区
   */
  regionChange(e) {
    this.setData({
      region: e.detail.value
    })
  },

  /**
   * 提交
   */
  async submit(e) {

    try {

      // 获取参数
      const {
        region,
        contact,
        address,
        phone,
        status
      } = e.detail.value, {
        id,
      } = this.data.address

      // 验证
      UTIL.check(contact, '请输入联系人')
      UTIL.check(phone, '请输入正确的手机号码', /^1\d{10}$/)
      UTIL.check(region.join(), '请选择地区')

      // 处理参数
      const params = {
        uid: wx.getStorageSync('userInfo').id,
        name: contact,
        mobile: phone,
        region: region[0],
        city: region[1],
        xian: region[2],
        address,
        address_id: id,
        status: status ? 1 : 0
      }

      // 修改添加地址
      const result = await ADDRESS_SERVICE[id ? 'put' : 'post'](params)

      // 显示提示
      wx.showModal({
        content: result.msg,
        showCancel: false,
        success: res => wx.navigateBack()
      })

      // 推送地址
      this.getOpenerEventChannel().emit('init')
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
     
      

      // 如果是修改地址
      if (OPTIONS.data) {
        
        // 获取数据
        const data = JSON.parse(decodeURIComponent(OPTIONS.data))

        // 获取地区信息
        const {
          region,
          city,
          xian
        } = data

        // 设置数据
        this.setData({
          address: data,
          region: [region, city, xian]
        })
      }

      // 设置状态为缺省
      container.status('default')
    } catch (e) {

      // 设置状态为完成
      container.status('error', e.message)
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

    // 设置参数
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