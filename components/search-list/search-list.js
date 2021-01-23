const
  AUTH = require('../../utils/auth'),
  UTIL = require('../../utils/util'),
  SEARCH_SERVICE = require('../../service/search.service')

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
    category: {
      type: String
    }, // 分类
    keyword: {
      type: String,
      value: '',
    } // 关键词
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

        // 设置状态
        container.status('init')

        // 获取参数
        const {
          category,
          keyword
        } = this.data

        // 获取数据
        const result = await SEARCH_SERVICE.list(wx.getStorageSync('userInfo').id, keyword)

        // 设置数据
        this.setData({
          list: result.data[category],
        })
        
        // 弹出完成
        this.triggerEvent('success')

        // 设置状态
        if (category == "course") {
          container.status(...(result.data[category].length ? ['default'] : ['empty', '/images/none/class.png']))
        } else {
          container.status(...(result.data[category].length ? ['default'] : ['empty', '/images/none/teacher.png']))
        }
      } catch (e) {

        // 设置状态
        container.status('error', e.message)
      }
    }
  }
})