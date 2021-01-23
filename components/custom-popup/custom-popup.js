/**
 * 自定义弹出层
 * 陈浩
 * 2019/7/30
 */
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    shadowClose: {
      value: false,
      type: Boolean
    } // 阴影关闭
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
     * 阴影关闭
     */
    shadow() {
      if (this.data.shadowClose) this.close()
      this.setData({
        status: false
      })
    },

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