// wxLive/components/live-card/live-card.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    detail: {
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
    nav() {
      wx.navigateTo({
        url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${this.data.detail.roomid}`
      })
    },
    share() {
      this.triggerEvent("share")
    },
  }
})