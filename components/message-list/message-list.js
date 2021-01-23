const
  UTIL = require('../../utils/util'),
  AUTH = require('../../utils/auth'),
  MESSAGE_SERVICE = require('../../service/message.service')
let PAGE

/**
 * 消息列表
 * 陈浩
 * 2019/8/3
 */
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    category: {
      type: String,
    } // 分类
  },

  /**
   * 组件的初始数据
   */
  data: {
    message: {
      list: [] //列表
    } // 消息
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 跳转消息详情
    handleMessage(e) {
      console.log(e)
      const id = e.currentTarget.dataset.id
      wx.navigateTo({ //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）
        url: `/pages/message-details/message-details?id=${id}`
      })
    },
    async getMore() {
      // 获取容器
      const container = this.selectComponent('.container')

      // 判断加载
      if (container.status() != 'canload') return

      try {

        // 获取参数
        const {
          category,
          message: {
            list
          }
        } = this.data

        // 获取数据
        const result = await MESSAGE_SERVICE.list(wx.getStorageSync('userInfo').id, category, PAGE + 1)

        // 设置数据
        this.setData({
          'message.list': list.concat(result.data.data)
        })

        // 设置页号
        PAGE++

        // 设置状态
        container.status(result.data.last_page > result.data.current_page ? 'canload' : 'complete')
      } catch (e) {

        // 设置状态
        container.status('error', e.message)
      }
    },
    /**
     * 初始化数据
     */
    async init() {

      // 获取容器
      const container = this.selectComponent('.container')

      try {

        // 验证登录
        await AUTH.loginStatus()

        try {

          // 获取参数
          const category = this.data.category

          // 获取数据
          const result = await MESSAGE_SERVICE.list(wx.getStorageSync('userInfo').id, category, 1)

          // 清除未读信息
          await MESSAGE_SERVICE.clearUnread(wx.getStorageSync('userInfo').id, category)

          // 获取未读信息
          const unread = await MESSAGE_SERVICE.unread(wx.getStorageSync('userInfo').id)

          // 弹出未读信息
          this.triggerEvent('unread', Object.values(unread.data))

          // 设置数据
          this.setData({
            'message.list': result.data.data
          })

          // 设置页号
          PAGE = 1

          // 设置状态
          if (result.data.total == 0) container.status('empty', '/images/message/empty.png')
          else if (result.data.last_page == 1) container.status('complete')
          else container.status('canload')
        } catch (e) {

          // 设置状态
          container.status('error', e.message)
        }
      } catch (e) {

        // 设置状态
        container.status('empty', '/images/message/empty.png')
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
          message: {
            list
          }
        } = this.data

        // 获取数据
        const result = await MESSAGE_SERVICE.list(wx.getStorageSync('userInfo').id, category, PAGE + 1)

        // 设置数据
        this.setData({
          'message.list': list.concat(result.data.data)
        })

        // 设置页号
        PAGE++

        // 设置状态
        container.status(result.data.last_page > result.data.current_page ? 'canload' : 'complete')
      } catch (e) {

        // 设置状态
        container.status('error', e.message)
      }
    },
  },
})