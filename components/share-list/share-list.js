const
  AUTH = require('../../utils/auth'),
  UTIL = require('../../utils/util'),
  SHARE_SERVICE = require('../../service/share.service')
let PAGE

/**
 * 分享列表
 * 陈浩
 * 2019/7/15
 */
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tag: {
      type: String
    } // 标签
  },

  /**
   * 组件的初始数据
   */
  data: {
    list: [], // 列表
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 初始化数据
     */
    async init() {

      // 获取容器
      const container = this.selectComponent('.container')

      try {

        // 获取参数
        const tag = this.data.tag

        // 获取数据
        const result = await SHARE_SERVICE.list(wx.getStorageSync('userInfo').id, tag, 1)

        // 设置数据
        this.setData({
          list: result.data.list
        })

        // 设置页号
        PAGE = 1

        // 设置状态
        container.status(result.data.list.length ? 'canload' : 'complete')
      } catch (e) {

        // 设置状态
        container.status('error', e.message)
      }
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    async onReachBottom() {

      // 获取容器
      const container = this.selectComponent('.container')

      // 判断加载
      if (container.status() != 'canload') return

      try {

        // 获取参数
        const {
          tag,
          list
        } = this.data

        // 获取数据
        const result = await SHARE_SERVICE.list(wx.getStorageSync('userInfo').id, tag, PAGE + 1)

        // 设置数据
        this.setData({
          list: list.concat(result.data.list)
        })

        // 设置页号
        PAGE++

        // 设置状态
        container.status(result.data.list.length ? 'canload' : 'complete')
      } catch (e) {

        // 设置状态
        container.status('error', e.message)
      }
    }
  }
})