/**
 * 首页列表-推荐
 * 陈浩
 * 2019/7/4
 */
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

    /**
     * 进入课程
     */
    enterCourse(e) {
      wx.navigateTo({
        url: `/pages/course-detail/course-detail?id=${e.currentTarget.dataset.id}`,
      })
    },

    /**
     * 进入导师
     */
    enterTutor(e) {
      wx.navigateTo({
        url: `/pages/tutor-home/tutor-home?id=${e.currentTarget.dataset.id}`,
      })
    },
  }
})