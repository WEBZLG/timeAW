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
    list: {
      type: Array
    }, // 列表
    detail: {
      type: String,
      value: '/pages/course-detail/course-detail'
    }, // 详情地址
    options: {
      type: String,
      value: 'id'
    } // 参数
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
     * 进入详情
     */
    enterDetail(e) {

      // 获取参数
      const {
        index
      } = e.currentTarget.dataset, {
        list,
        options
      } = this.data

      // 获取元素
      const detail = list[index][options]

      // 导航
      wx.navigateTo({
        url: `${this.data.detail}?id=${detail}`,
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