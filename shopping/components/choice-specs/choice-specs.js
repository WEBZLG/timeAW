// shopping/components/choice-specs/choice-specs.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    specs: {
      type: Array
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    active: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleSpecsClick(event) {
      // console.log(event.currentTarget.dataset.specs)
      const specsId = event.currentTarget.dataset.specs.id
      const index = event.currentTarget.dataset.index
      this.setData({
        active: index
      })
      this.triggerEvent('choiceSpecs', specsId)
    }
  }
})