/**
 * 图片列表
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
    }, // 图片选择器
    max: {
      type: Number,
      value: 9
    } // 最大图片数
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
     * 预览图片
     */
    preview(e) {

      // 获取参数
      const {
        value,
        preview
      } = this.data, {
        index
      } = e.currentTarget.dataset

      if (typeof(preview) === 'boolean' && preview === true) {

        // 预览图片
        wx.previewImage({
          urls: this.data.value,
          current: value[index]
        })
      } else if (typeof(preview) === 'object' && preview.length) {

        // 预览图片
        wx.previewImage({
          urls: preview,
          current: preview[index]
        })
      }
    },

    /**
     * 添加照片
     */
    post(e) {

      const {
        max,
        value
      } = this.data

      // 选择图片
      wx.chooseImage({
        count: max - value.length,
        success: result => {

          // 添加图片
          this.setData({
            value: value.concat(result.tempFilePaths)
          })

          // 弹出选择
          this.triggerEvent('choose', {
            post: result.tempFilePaths,
            value: value.concat(result.tempFilePaths)
          })
        }
      })
    },

    /**
     * 删除图片
     */
    delete(e) {

      // 判断选择
      if (!this.data.choose) return

      // 提示
      wx.showModal({
        content: '删除该图片？',
        success: res => {

          // 判断确认
          if (!res.confirm) return

          // 获取数据
          const
            index = e.currentTarget.dataset.index,
            value = this.data.value
          // 删除
          value.splice(index, 1)
          console.log(value)

          // 添加图片
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