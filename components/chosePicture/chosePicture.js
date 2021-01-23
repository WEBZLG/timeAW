/**
 * 选择图片
 * 陈浩
 * 2019/7/1
 */
Component({
  behaviors: ['wx://form-field'],
  /**
   * 组件的属性列表
   */
  properties: {
    value: {
      type: String,
      value: ''
    } // 图片
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
     * 添加图片
     */
    increase() {
      wx.chooseImage({
        count: 1,
        success: res => {

          // 设置数据
          this.setData({
            value: res.tempFilePaths[0]
          })

          // 弹出事件
          this.triggerEvent('change', {
            value: res.tempFilePaths[0]
          })
        }
      })
    },
  }
})