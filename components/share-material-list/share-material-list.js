const
  AUTH = require('../../utils/auth'),
  UTIL = require('../../utils/util'),
  SHARE_SERVICE = require('../../service/share.service')

/**
 * 分享列表
 * 陈浩 2019/7/15
 */
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    userId: {
      type: String,
    },
    category: {
      type: String,
      value: 'list'
    }, // 分类
    tag: {
      type: String
    } // 标签
  },

  /**
   * 组件的初始数据
   */
  data: {
    list: [], // 列表
    page: 1, // 页号
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
        const {
          category,
          tag,
          userId,
          page
        } = this.data
        // 设置状态
        container.status('init')

        // 获取数据
        const result = await SHARE_SERVICE.material(userId, wx.getStorageSync('userInfo').id, tag, page)

        // 设置数据
        this.setData({
          list: result.data[category]
        })

        // 为空图片
        const empty = {
          list: '/images/material/favoriteEmpty.png',
          my: '/images/material/materialEmpty.png'
        }

        // 设置状态
        container.status(...(result.data[category].length ? ['canload'] : ['empty', empty[category]]))
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
          category,
          tag,
          userId,
          page,
          list
        } = this.data

        // 设置状态
        container.status('loading')

        // 获取数据
        const result = await SHARE_SERVICE.material(userId, wx.getStorageSync('userInfo').id, tag, page + 1)

        // 设置数据
        this.setData({
          list: list.concat(result.data[category]),
          page: page + 1
        })

        // 为空图片
        const empty = {
          list: '/images/material/favoriteEmpty.png',
          my: '/images/material/materialEmpty.png'
        }

        // 设置状态
        container.status(result.data[category].length ? 'canload' : 'complete')
      } catch (e) {

        // 设置状态
        container.status('error', e.message)
      }
    }
  }
})