const {
  html2json
} = require('./libs/html2json.js')

/**
 * 富文本
 * 陈浩
 * 2018/12/20
 */
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    content: {
      type: String,
      observer(value) {

        this.setData({
          status: true,
          _content: html2json(value)
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    /**
     * 转化后文本
     */
    _content: {},
    /**
     * 状态
     */
    status: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    
  }
})