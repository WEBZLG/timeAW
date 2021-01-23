/**
 * 弹出层
 * 陈浩
 * 2019/7/30
 */
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
    }, // 标题
    type: {
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    status: false // 弹框状态
  },

  /**
   * 组件的方法列表
   */
  methods: {

    /**
     * 关闭
     */
    close() {
      this.setData({
        status: false
      })
    },

    /**
     * 打开
     */
    open() {
      this.setData({
        status: true
      })
    }
  }
})