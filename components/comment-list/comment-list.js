const
  COMMENT_SERVICE = require('../../service/comment.service')
let PAGE
/**
 * 评论列表
 * 陈浩 2019/7/31
 */
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    courseId: {
      type: String,
    }, // 课程ID
  },

  /**
   * 组件的初始数据
   */
  data: {
    comment: {
      hot: [], // 热门
      all: [] // 全部
    } // 评论
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
        const courseId = this.data.courseId

        // 初始化页号
        PAGE = 1

        // 评论列表
        const result = await COMMENT_SERVICE.list(courseId, PAGE, wx.getStorageSync('userInfo').id)

        // 获取列表
        this.setData({
          'comment.hot': result.data.is_hot,
          'comment.all': result.data.is_all
        })

        // 设置状态
        container.status(...(result.data.is_all.length > 0 ? ['canload'] : ['empty', '/images/course-detail/empty.png']))
      } catch (e) {

        // 设置状态
        container.status('error', e.message)
      }
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    async onPullDownRefresh() {

      // 获取容器
      const container = this.selectComponent('.container')

      try {

        // 获取参数
        const {
          courseId,
          comment
        } = this.data

        // 评论列表
        const result = await COMMENT_SERVICE.list(courseId, PAGE + 1, wx.getStorageSync('userInfo').id)

        // 增加页号
        PAGE++

        // 获取列表
        this.setData({
          'comment.hot': result.data.is_hot,
          'comment.all': comment.all.concat(result.data.is_all)
        })

        // 设置状态
        container.status(result.data.is_all.length > 0 ? 'canload' : 'complete')
      } catch (e) {

        // 设置状态
        container.status('error', e.message)
      }
    }
  }
})