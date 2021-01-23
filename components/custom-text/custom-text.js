const
  UTIL = require('../../utils/util')

/**
 * 自定义文本
 * 陈浩
 * 2019/7/16
 */
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showText: {
      type: String,
      value: '显示全文',
    }, // 显示文字
    hideText: {
      type: String,
      value: '收起',
    }, // 隐藏文字
    text: {
      type: String,
      value: '',
    }, // 文本内容
    lineHeight: {
      type: String,
      value: '40rpx'
    },
    line: {
      type: Number,
      value: 5
    }, // 行数
  },

  observers: {
    'text, lineHeight, line'(text, lineHeight, line) {

      // 等待渲染
      wx.nextTick(async () => {

        // 获取行高
        lineHeight = lineHeight.replace(/rpx/, '')

        // 获取矩形
        const rect = await this.getRect('.custom-text-content')

        // 设置状态
        this.setData({
          status: rect.height > UTIL.rpx(lineHeight * line) ? 'hide' : 'none'
        })
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    status: 'none' // 隐藏状态 show/hide/none/default
  },

  /**
   * 组件的方法列表
   */
  methods: {

    /**
     * 显示
     */
    show() {
      this.setData({
        status: 'show'
      })
    },

    /**
     * 隐藏
     */
    hide() {
      this.setData({
        status: 'hide'
      })
    },

    /**
     * 获取信息
     */
    getRect(selector) {
      return new Promise((resolve, reject) => {
        this.createSelectorQuery().select(selector).boundingClientRect((rect) => {
          resolve(rect)
        }).exec()
      })
    }
  },
})