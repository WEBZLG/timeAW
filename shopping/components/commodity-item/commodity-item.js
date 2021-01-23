// shopping/components/commodity-item/commodity-item.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    info: {
      type: Object
    }
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
    handleItemClick(event) {
      const id = event.currentTarget.dataset.id
      wx.navigateTo({
        url: `../../pages/commodity-details/commodity-details?id=${id}`
      })
    }
  }
})