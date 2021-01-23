/**
 * 视频列表
 * 陈浩
 * 2019/4/30
 */
Component({
  behaviors: ['wx://form-field'],
  /**
   * 组件的属性列表
   */
  properties: {
    preview: {
      type: Boolean,
      optionalTypes: [Array]
    }, // 预览
    value: {
      type: Array,
      value: [],
    }, // 列表
    size: {
      type: Number,
      value: 4,
    }, // 尺寸
    choose: {
      type: Boolean
    }, // 视频选择器
    max: {
      type: Number,
      value: 9
    } // 最大视频数
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
     * 添加
     */
    post(e) {

      const {
        max,
        value
      } = this.data

      // 选择视频
      wx.chooseVideo({
        count: max - value.length,
        success: result => {
          
          // 添加视频
          value.concat.push(result.tempFilePath)
          
          // 设置数据
          this.setData({
            value
          })

          // 弹出选择
          this.triggerEvent('choose', {
            post: [result.tempFilePath],
            value
          })
        }
      })
    },

    /**
     * 删除
     */
    delete(e) {

      // 判断选择
      if (!this.data.choose) return

      // 提示
      wx.showModal({
        content: '删除该视频？',
        success: res => {

          // 判断确认
          if (!res.confirm) return

          // 获取数据
          const
            index = e.currentTarget.dataset.index,
            value = this.data.value

          // 删除
          value.splice(index, 1)

          // 添加视频
          this.setData({
            value
          })

          // 弹出删除
          this.triggerEvent('delete', {
            index,
            value
          })
        }
      })
    },
  },
})