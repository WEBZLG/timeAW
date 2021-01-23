const
  UTIL = require('../../utils/util'),
  POSTER_SERVICE = require('../../service/poster.service')

/**
 * 海报详情
 * 陈浩
 * 2019/8/5
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
    poster: '' // 海报
  },

  /**
   * 组件的方法列表
   */
  methods: {

    /**
     * 初始化数据
     */
    async init(type, data) {

      // 获取容器
      const container = this.selectComponent('.container')

      try {

        // 设置状态
        container.status('init')

        // 获取参数
        const {
          id,
          nickname,
          avatar
        } = wx.getStorageSync('userInfo')

        // 设置模式
        const mode = {
          invite: async() => {
            return await POSTER_SERVICE.invite(data.id, data.background, id, nickname, avatar)
          },
          course: async() => {
            return await POSTER_SERVICE.course(data.type, data.id, data.title, data.background, data.cover, id, nickname, avatar)
          },
          userInfo: async() => {
            return await POSTER_SERVICE.userInfo(data.id, id, nickname, avatar, data.background)
          }
        }

        // 获取参数
        const result = await mode[type]()
        
        // 设置数据
        this.setData({
          poster: result.data.pic
        })

        // 弹出海报
        this.triggerEvent('poster', result.data.pic)

        // 设置状态
        container.status('default')
      } catch (e) {

        // 设置状态
        container.status('error', e.message)
      }
    }
  }
})