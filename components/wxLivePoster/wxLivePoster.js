const
  UTIL = require('../../utils/util')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    options: {
      type: Object
    },
    data: {
      type: Array,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    src: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 渲染绘图
     */
    async draw() {
      
      // 获取canvas
      const ctx = wx.createCanvasContext('poster', this)

      // 循环显示元素
      for (let item of this.data.data) {

        // 处理图片
        if (item.type == "image") {

          // 获取图片路径
          const itemInfo = await UTIL.getImageInfo(item.src)

          // 获取参数
          const options = []
          const reg = /(http|https|wxfile):\/\/([\w.]+\/?)\S*/ig
          options.push(itemInfo.path.match(reg) ? itemInfo.path : `/${itemInfo.path}`)
          options.push(item.sx)
          options.push(item.sy)

          if (item.mode == "poster") {
            options.push(item.sWidth)
            options.push(item.sWidth / itemInfo.width * itemInfo.height)
          } else {
            options.push(item.sWidth)
            options.push(item.sWidth)
          }
          console.log(options)
          ctx.drawImage(...options)
        } else if (item.type == "text") {
          ctx.font = 'sans-serif'
          // ctx.setFillStyle('#FFFFFF')
          if (item.fontSize) ctx.setFontSize(item.fontSize)
          if (item.align) ctx.setTextAlign(item.align)
          if (item.baseline) ctx.setTextBaseline(item.baseline)
          ctx.fillText(item.content, item.sx, item.sy)
          1
        }
      }

      // 绘制画布
      ctx.draw(false, () => {

        // 导出地址
        wx.canvasToTempFilePath({
          canvasId: 'poster',
          fileType: 'jpg',
          quality: 1,
          success: (res) => {
            this.setData({
              src: res.tempFilePath
            })
          },
        }, this)
      })
    }
  }
})