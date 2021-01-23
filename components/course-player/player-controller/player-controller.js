const
  AUDIO = getApp().globalData.audio,
  VIDEO = getApp().globalData.video,
  OBSERVE = require('../../../utils/observe')
let MediaStatus
/**
 * 播放器控制
 * 陈浩 2019/11/21
 */
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    course: {
      type: Object,
      value: {},
      observer(course, oldCourse) {

        if (AUDIO.status != 'stop' && AUDIO.data.course.id == course.id) {

          // 设置参数
          this.setData({
            status: AUDIO.status,
            currentMedia: 'audio',
            partMedia: AUDIO.data.part.list[AUDIO.data.part.index].media
          })
        }

        if (oldCourse.id) return

        // 监听视频状态
        MediaStatus = OBSERVE.subscribe('mediaStatus', media => {

          // 状态函数
          const statusFunction = {
            /**
             * 播放
             */
            play: () => {

              // 设置参数
              this.setData({
                status: 'play',
                currentMedia: media.type,
                partMedia: media.data.part.list[media.data.part.index].media
              })
            },

            /**
             * 停止
             */
            stop: () => {

              // 设置参数
              this.setData({
                status: 'stop'
              })
            },

            /**
             * 自然停止
             */
            ended: () => {

              // 设置参数
              this.setData({
                status: 'stop'
              })
            },
          }

          // 执行函数
          if (media.data.course.id == course.id)
            if (statusFunction[media.status]) statusFunction[media.status]()
        })
      },
    }, // 课程
  },

  /**
   * 组件的初始数据
   */
  data: {
    status: 'stop',
    currentMedia: '', // 媒体类型（当前媒体）
    partMedia: '', // 媒体类型（当前章节）
  },

  /**
   * 组件的方法列表
   */
  methods: {

    /**
     * 音频播放
     */
    toggle(e) {

      // 获取参数
      const {
        mode
      } = e.currentTarget.dataset
      console.log(mode)

      // 音视频切换
      if (mode == 'audio') {

        // 视频停止
        VIDEO.stop()

        // 初始化音频
        AUDIO.toggle({
          course: VIDEO.data.course,
          tutor: VIDEO.data.tutor,
          part: VIDEO.data.part,
          startTime: VIDEO.data.current
        })
      } else if (mode == 'video') {

        // 音频停止
        AUDIO.stop()

        // 初始化视频
        VIDEO.toggle({
          course: AUDIO.data.course,
          tutor: AUDIO.data.tutor,
          part: AUDIO.data.part,
          startTime: AUDIO.data.current
        })
      }
    },
  },

  /**
   * 生命周期
   */
  lifetimes: {
    detached() {
      OBSERVE.unsubscribe('mediaStatus', MediaStatus)
      MediaStatus = null
    },
    ready() {

    }
  }
})