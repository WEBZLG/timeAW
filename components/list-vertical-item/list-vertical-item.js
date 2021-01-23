/**
 * 横版列表
 * 陈浩
 * 2019/7/12
 */
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    course: {
      type: Object,
      observer(course) {
        console.log(course)
      }
    }, // 课程
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
     * 进入导师
     */
    enterTutor(e) {
      wx.navigateTo({
        url: `/pages/tutor-home/tutor-home?id=${e.currentTarget.dataset.id}`,
      })
    },
  }
})