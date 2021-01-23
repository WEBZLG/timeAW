const OBSERVE = require('../../utils/observe')
/**
 * 自定义视频
 * 陈浩 2019/5/14
 */
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    src: {
      type: String
    }, // 视频源
    cover: {
      type: String
    } // 封面图片
  },

  /**
   * 组件的初始数据
   */
  data: {
    videoObserve: '',
    status: 'stop'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 播放视频
     */
    play() {

      // 推送播放
      OBSERVE.publish('custom-video', this.data.src)
    },

    /**
     * 监听播放
     */
    onPlay() {
      // // 获取
      // const audio = getApp().globalData.audio

      // // 
      // if (audio.status != 'pause') audio.pause()
    },

    /**
     * 监听停止
     */
    onStop() {
      this.setData({
        status: 'stop'
      })
    }
  },

  /**
   * 生命周期
   */
  lifetimes: {
    /**
     * 在组件在视图层布局完成后执行
     */
    ready() {

      // 订阅播放
      const videoObserve = OBSERVE.subscribe('custom-video', src => {

        // 获取视频实例
        const video = wx.createVideoContext(`video`, this)

        // 停止视频
        this.setData({
          status: 'stop'
        }, () => {

          // 判断是否当前图片
          if (src == this.data.src) {

            // 播放视频
            this.setData({
              status: 'play'
            })

            // 获取音频
            const audio = getApp().globalData.audio

            // 暂停音频
            if (audio.status != 'pause') audio.pause()
          }
        })
      })

      this.setData({
        videoObserve
      })
    },
    /**
     * 在组件实例被从页面节点树移除时执行
     */
    detached() {
      OBSERVE.unsubscribe('custom-video', this.data.videoObserve)
    }
  },
})