const
  RANKING_SERVICE = require('../../service/ranking.service')
let PAGE
/**
 * 排行榜-课程
 * 陈浩 2020/1/9
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
    course: {
      list: [] // 列表
    } // 课程
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 前往详情
     */
    courseDetail(e) {
      wx.navigateTo({
        url: `/pages/course-detail/course-detail?id=${e.currentTarget.dataset.id}`,
      })
    },
    /**
     * 初始化数据
     */
    async init() {

      // 获取容器
      const container = this.selectComponent('.container')

      try {

        PAGE = 1

        // 获取数据
        const result = await RANKING_SERVICE.course(PAGE)

        // 设置数据
        this.setData({
          'course.list': result.data
        })

        // 设置页号
        PAGE = 1

        // 设置状态
        container.status(...(result.data.length > 0 ? ['canload'] : ['empty', '/images/order/empty.png']))
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
        const course = this.data.course

        // 获取数据
        const result = await RANKING_SERVICE.course(PAGE + 1)

        // 增加页号
        PAGE++

        // 设置数据
        this.setData({
          'course.list': course.list.concat(result.data)
        })

        // 设置页号
        PAGE++

        // 设置状态
        container.status(result.data.length > 0 ? 'canload' : 'complete')
      } catch (e) {

        // 设置状态
        container.status('error', e.message)
      }
    },
  }
})