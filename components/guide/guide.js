const
  UTIL = require('../../utils/util')
/**
 * 引导组件
 * 陈浩
 * 2019/8/13
 */
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    status: 'close', // 状态
    right: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 关闭
     */
    close() {

      // 设置状态
      wx.setStorageSync('guide', 'close')

      // 关闭
      this.setData({
        status: 'clsoe'
      })
    },
  },
  /**
   * 生命周期
   */
  lifetimes: {
    /**
     * 在组件在视图层布局完成后执行
     */
    ready() {

      // 获取信息
      const
        menu = wx.getMenuButtonBoundingClientRect(),
        system = wx.getSystemInfoSync()

      // 设置信息
      this.setData({
        right: system.screenWidth - menu.right + menu.width - UTIL.rpx(30 / 2) - UTIL.rpx(40) - menu.width / 4
      })
    },
  },
  /**
   * 页面生命周期
   */
  pageLifetimes: {
    /**
     * 组件所在的页面被展示时执行
     */
    show() {
      // 设置状态
      this.setData({
        status: wx.getStorageSync('guide') ? 'close' : 'open'
      })
    },
  }
})