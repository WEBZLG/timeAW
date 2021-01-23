/**
 * 自定义radio
 * 陈浩
 * 2019/4/28
 */
Component({
  behaviors: ['wx://form-field'],
  /**
   * 组件的属性列表
   */
  properties: {
    name: {
      type: String
    },
    value: {
      type: Boolean,
      value: false,
    },
    readonly: {
      type: Boolean,
      value: false,
    } // 只读
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
     * 
     */
    checked() {
      
      // 获取点击状态
      const value = !this.data.value;

      // 获取只读状态
      const readonly = this.data.readonly

      if (!readonly){

        // 设置点击状态
        this.setData({ value })

        // 弹出事件
        this.triggerEvent('change', { value })
      }
    }
  }
})
