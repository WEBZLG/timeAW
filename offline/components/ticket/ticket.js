// offline/components/ticket/ticket.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    ticket: {
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
    // 立即预约
    appointment(event) {
      wx.showToast({
        title: '请去App预约',
        icon: 'none',
        duration: 2000
      })
      // const id = event.currentTarget.dataset.id
      // const categoryId = this.data.ticket.category_id
      // if (categoryId === 1) {
      //   // 沙龙课跳列表
      //   wx.navigateTo({
      //     url: `/offline/pages/salon/salon`
      //   })
      // //  其他跳详情
      // } else {
      //   wx.navigateTo({
      //     url: `/offline/pages/course/course-detail?id=${id}`
      //   })
      // }

    },

  //  跳转核销记录
    writeOff(event) {
      const id = event.currentTarget.dataset.id
      wx.navigateTo({
        url: `/pages/write-off/write-off?id=${id}`
      })
    }
  }
})
