const
  UTIL = require('../../utils/util'),
  ORDER_SERVICE = require('../../service/order.service')
let PAGE

/**
 * 订单列表
 * 陈浩
 * 2019/8/3
 */
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    category: {
      type: Number
    } // 分类
  },

  /**
   * 组件的初始数据
   */
  data: {
    order: {
      list: [] // 列表
    }, // 订单
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
        const category = this.data.category

        // 获取数据
        const result = await ORDER_SERVICE.list(wx.getStorageSync('userInfo').id, category, 1)

        // 设置数据
        this.setData({
          'order.list': result.data.data
        })

        // 设置页号
        PAGE = 1

        // 设置状态
        if (result.data.total == 0) container.status('empty', '/images/order/empty.png')
        else if (result.data.current_page < result.data.last_page) container.status('canload')
        else if (result.data.current_page >= result.data.last_page) container.status('complete')
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

        // 设置状态
        container.status('loading')

        // 获取参数
        const category = this.data.category

        // 获取数据
        const result = await ORDER_SERVICE.list(wx.getStorageSync('userInfo').id, category, 1)

        // 设置数据
        this.setData({
          'order.list': result.data.data
        })

        // 设置页号
        PAGE++

        // 设置状态
        if (result.data.current_page < result.data.last_page) container.status('canload')
        else if (result.data.current_page >= result.data.last_page) container.status('complete')
        else if (total == 0) container.status('empty', '/images/order/empty.png')
      } catch (e) {

        // 设置状态
        container.status('error', e.message)
      }
    },
  },
})