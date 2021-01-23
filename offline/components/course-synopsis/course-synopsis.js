// offline/components/course-synopsis/course-synopsis.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    synopsis: {
      type: Object
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
    // 报名
    signUp(event) {
      const id = event.currentTarget.dataset.id
      // wx.navigateTo({
      //   url: `../../pages/course/course-detail?id=${id}`,
      // })
      wx.showToast({
        title: '请去App预约',
        icon: 'none',
        duration: 2000
      })      
    },
  }
})