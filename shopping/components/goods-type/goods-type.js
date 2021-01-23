// shopping/components/choice-specs/choice-specs.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 热销
    hotSaleList: {
      type: Object
    },
    // 爆品
    hotreList: {
      type: Object
    },
    // 活动
    liveList: {
      type: Array
    },
    // 推荐
    recommendList: {
      type: Array
    },
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
    // 商品详情
    goodsDetail(e) {
      let id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: '../commodity-details/commodity-details?id=' + id,
      })
    },
      // 更多
    onMore(e){
      let cid = e.currentTarget.dataset.cid
      wx.navigateTo({
        url: '../commodity-list/commodity-list?cid='+cid,
      })
    },
  }
})