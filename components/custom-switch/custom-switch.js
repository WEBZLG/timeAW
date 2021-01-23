// components/custom-switch/custom-switch.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    checked: {
      type: Boolean,
      value: false
    },
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
    change() {
      this.setData({
        checked: !this.data.checked
      })
      this.triggerEvent("change", {
        value: this.data.checked
      })
    },
  }
})