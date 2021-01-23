const
  VIDEO = getApp().globalData.video,
  OBSERVE = require('../../../utils/observe')
let
  MEDIA_STATUS
/**
 * 视频播放器
 */
Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    course: {}, // 课程信息
    part: {}, // 章节信息
    loading: false, // 加载状态
    status: 'stop', // 播放状态
    startTime: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {

    /**
     * 视频跳转
     */
    seek(current) {

      // 获取参数
      const video = wx.createVideoContext('player-video', this)

      // 播放
      video.seek(current)
    },

    /**
     * 自然停止
     */
    ended() {

      // 视频自然停止
      VIDEO.ended()
    },

    /**
     * 视频播放
     */
    play() {

      // 获取参数
      const video = wx.createVideoContext('player-video', this)

      // 播放
      video.play()
    },

    /**
     * 视频暂停
     */
    pause() {

      // 获取参数
      const video = wx.createVideoContext('player-video', this)

      // 暂停
      video.pause()
    },

    /**
     * 视频停止
     */
    stop() {

      // 获取参数
      const video = wx.createVideoContext('player-video', this)

      // 停止
      video.stop()
    },

    /**
     * 记录进度
     */
    timeupdate(e) {

      // 记录当前时间
      VIDEO.data.current = e.detail.currentTime
    },

    /**
     * 当视频加载
     */
    onWaiting() {
      this.setData({
        loading: true
      })
    },

    onProgress(e) {

      // 如果当前状态为加载状态，则取消加载状态
      if (this.data.loading == true) {
        this.setData({
          loading: false
        })
      }
    },
  },

  /**
   * 生命周期
   */
  lifetimes: {
    detached() {

      // 停止视频
      if (VIDEO.status != 'stop') VIDEO.stop()

      // 停止监听状态
      MEDIA_STATUS = OBSERVE.unsubscribe('mediaStatus', MEDIA_STATUS)
    },
    ready() {

      // 监听状态
      MEDIA_STATUS = OBSERVE.subscribe('mediaStatus', media => {
        
        // 状态函数
        const statusFunction = {
          /**
           * 播放
           */
          play: () => {

            // 设置状态
            this.setData({
              status: 'play',
              part: media.data.part,
            }, () => {

              // 播放
              this.play()

              // 跳转
              if (media.data.current > 0) this.seek(media.data.current)
            })
          },

          /**
           * 暂停
           */
          pause: () => {

            // 设置状态
            this.setData({
              status: 'pause',
            })

            // 播放视频
            this.pause()
          },

          /**
           * 停止
           */
          stop: () => {

            // 设置状态
            this.setData({
              status: 'stop'
            })

            // 停止视频
            this.stop()
          },

          /**
           * 自然停止
           */
          ended: () => {

            // 设置状态
            this.setData({
              status: 'stop'
            })

            // 停止视频
            this.stop()
          },
        }

        // 执行函数
        if (media.type == 'video')
          if (statusFunction[media.status]) statusFunction[media.status]()
      })
    }
  },
})