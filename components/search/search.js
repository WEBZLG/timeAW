/**
 * 搜索
 * 陈浩
 * 2019/7/4
 */
Component({
  options: {
    styleIsolation: 'apply-shared'
  },
  /**
   * 组件的属性列表
   */
  properties: {
    disabled: {
      type: Boolean
    }, // 禁用
    value: {
      type: String
    }, // 值
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
     * 提交
     */
    submit(e) {
      this.triggerEvent('search', {
        keyword: e.detail.value.keyword
      })
    },
  }
})