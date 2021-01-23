/**
 * 自定义图片
 * 陈浩
 * 2019/4/29
 */
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    menu: {
      type: Boolean,
      value: false
    }, // 菜单
    preview: {
      type: Boolean,
      optionalTypes: [String],
    }, // 预览
    type: {
      type: String,
      value: 'normal',
      observer(value) {

        // 选项
        const options = {
          normal: 'scaleToFill',
          cover: 'aspectFill',
          icon: 'aspectFit',
          poster: 'widthFix',
          gallery: 'scaleToFill'
        }

        // 设置数据
        this.setData({
          mode: options[value]
        })
      }
    }, // 类型
    src: {
      type: String,
      value: '',
      observer() {
        this.setData({
          panel: 'normal'
        })
      }
    }, //源
  },

  /**
   * 组件的初始数据
   */
  data: {
    mode: 'scaleToFill',
    defaultSrc: './images/default.png', // 缺省路径
    lostSrc: './images/lost.png', // 丢失路径
    panel: 'loading',
    width: '100%'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 图像预览
     */
    preview() {

      // 获取预览状态、源和预览列表
      const {
        preview,
        src,
      } = this.data

      if (typeof(preview) == 'boolean' && preview === true) {

        // 预览图片
        wx.previewImage({
          urls: [src],
        })
      } else if (typeof(preview) == 'string' && preview !== '') {

        // 预览图片
        wx.previewImage({
          urls: [preview],
        })
      }
    },

    /**
     * 图像加载错误
     */
    error(e) {
      this.setData({
        panel: 'error',
      })
    },

    /**
     * 图像加载完毕
     */
    load(e) {

      this.setData({
        panel: 'normal'
      })

      // 如果为画廊模式
      if (this.data.type == 'gallery') {

        // // 计算宽度
        // this.createIntersectionObserver().relativeTo('.normal-container').observe('.normal', rect => {

        //   // 获取参数
        //   const {
        //     width,
        //     height
        //   } = e.detail

        //   console.log(width, height, rect.boundingClientRect.height)

        //   // 设置数据
        //   this.setData({
        //     width: `${rect.boundingClientRect.height / (height / width)}px`
        //   })
        // })

        // 计算宽度
        this.createSelectorQuery().select('.normal').boundingClientRect((rect) => {

          // 获取参数
          const {
            width,
            height
          } = e.detail

          // 设置数据
          this.setData({
            width: `${rect.height / (height / width)}px`
          })
        }).exec()
      }
    },
  },
  /**
   * 定义生命周期方法
   */
  lifetimes: {
    /**
     * 在组件实例被从页面节点树移除时执行
     */
    // detached() {
    //   console.log('detached')
    //   this.createIntersectionObserver().disconnect()
    // }
  }
})