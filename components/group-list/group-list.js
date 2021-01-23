const
  UTIL = require('../../utils/util'),
  GROUP_SERVICE = require('../../service/group.service')
let PAGE

/**
 * 团队列表
 * 陈浩 2019/8/3
 */
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    maxPage: {
      type: String,
      value: Infinity,
    }, // 最大页数
    userId: {
      type: String
    }, // 用户ID
    groupId: {
      type: Number
    } // 分类
  },

  /**
   * 组件的初始数据
   */
  data: {
    group: {
      list: [] // 列表
    }, // 团队
    enter: false, // 是否能进入下一级
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 跳转
     */
    navigateTo(e) {

      // 不超过maxPage页则可以打开
      if (this.data.enter) {

        // 获取用户信息
        const index = e.currentTarget.dataset.index

        // 获取用户信息
        const {
          id,
          nickname
        } = this.data.group.list[index]

        // 跳转
        wx.navigateTo({
          url: `/pages/group/group?id=${id}&nickname=${nickname}`
        })
      }
    },

    /**
     * 初始化数据
     */
    async init() {

      // 获取容器
      const container = this.selectComponent('.container')

      try {

        // 获取参数
        const {
          groupId,
          userId
        } = this.data

        // 统计页数
        const count = getCurrentPages().reduce((count, page) => {
          return page.route == 'pages/group/group' ? count + 1 : count + 0
        }, 0)

        // 设置页号
        PAGE = 1

        // 获取数据
        const result = await GROUP_SERVICE.list(userId, groupId, PAGE)

        // 设置数据
        this.setData({
          'group.list': result.data.team,
          enter: count < this.data.maxPage
        })

        // 弹出统计人数
        this.triggerEvent('count', [
          result.data.count_all,
          result.data.count_1,
          result.data.count_2,
          result.data.count_3,
          result.data.count_4,
          result.data.count_5,
        ])

        // 设置状态
        container.status(...(result.data.team.length > 0 ? ['canload'] : ['empty', '/images/none/member.png']))
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
        const {
          groupId,
          group,
          userId
        } = this.data

        // 获取数据
        const result = await GROUP_SERVICE.list(userId, groupId, PAGE + 1)

        // 设置数据
        this.setData({
          'group.list': group.list.concat(result.data.team)
        })

        // 设置页号
        PAGE++

        // 设置状态
        container.status(...(result.data.team.length > 0 ? ['canload'] : ['complete']))
      } catch (e) {

        // 设置状态
        container.status('error', e.message)
      }
    },
  },
})