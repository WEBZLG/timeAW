// components/course-poster/course-poster.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    content: {
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    poster: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    init() {
      this.setData({
        poster: this.data.content
      })
    }
  }
})
