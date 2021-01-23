const
  AUTH = require('../../utils/auth'),
  COMMENT_SERVICE = require('../../service/comment.service')
/**
 * 评论元素
 * 陈浩 2019/7/31
 */
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      value: {}
    }, // 元素
    footer: {
      type: Boolean,
      value: true
    }, // 底部
    likes: {
      type: Boolean,
      value: true
    } // 点赞
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 更多
     */
    more() {
      wx.navigateTo({
        url: `/pages/comment-detail/comment-detail?id=${this.data.item.id}`,
        events: {
          likes: () => {

            // 获取参数
            const {
              prise,
              zan_num
            } = this.data.item

            // 设置参数
            this.setData({
              'item.prise': prise ^ 1,
              'item.zan_num': zan_num + (prise ^ 1 || -1)
            })
          }
        }
      })
    },

    /**
     * 回复
     */
    reply() {
      wx.navigateTo({
        url: `/pages/comment-post/comment-post?commentId=${this.data.item.id}`,
      })
    },

    /**
     * 点赞
     */
    async likes() {
      try {

        // 显示加载
        wx.showLoading()

        // 验证登录
        await AUTH.loginStatus()

        // 获取参数
        const {
          prise,
          course_id,
          zan_num,
          id
        } = this.data.item

        // 点赞
        await COMMENT_SERVICE.likes(course_id, id, wx.getStorageSync('userInfo').id)

        // 设置参数
        this.setData({
          'item.prise': prise ^ 1,
          'item.zan_num': zan_num + (prise ^ 1 || -1)
        })

        // 初始化
        this.getOpenerEventChannel().emit('likes')

        // 隐藏加载
        wx.hideLoading()
      } catch (e) {

        // 隐藏加载
        wx.hideLoading()

        if (e.message == 'login:fail') {

          // 登录
          wx.navigateTo({
            url: getApp().globalData.pages.auth,
          })
        } else {

          // 提示
          wx.showModal({
            content: e.message,
            showCancel: false
          })
        }
      }
    },
  }
})