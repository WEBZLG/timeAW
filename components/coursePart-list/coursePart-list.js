const
  OBSERVE = require('../../utils/observe'),
  AUDIO = getApp().globalData.audio,
  VIDEO = getApp().globalData.video,
  COURSE_SERVICE = require('../../service/course.service')
let
  MEDIA_STATUS

/**
 * 课程小节-列表
 * 陈浩
 * 2019/7/31
 */
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tutor: {
      type: Object,
      value: {}
    }, // 导师
    part: {
      type: Array,
      value: []
    }, // 章节
    course: {
      type: Object,
      value: {},
      observer(course, oldCourse) {

        if (oldCourse.id) return

        // 监听播放
        MEDIA_STATUS = OBSERVE.subscribe('mediaStatus', media => {

          // 状态函数
          const statusFunction = {
            /**
             * 播放
             */
            play: () => {

              // 设置下标
              this.setData({
                index: media.data.part.index,
              })
            },

            /**
             * 暂停
             */
            pause: () => {

              // 设置下标
              this.setData({
                index: media.data.part.index,
              })
            },

            /**
             * 停止
             */
            stop: () => {

              // 设置下标
              this.setData({
                index: -1
              })
            },

            /**
             * 自然停止
             */
            ended: () => {

              // 设置下标
              this.setData({
                index: -1
              })
            },
          }

          // 执行函数
          if (statusFunction[media.status])
            if (course.id == media.data.course.id) statusFunction[media.status]()
        }, {
          proxy: true
        })
      },
    } // 课程
  },

  /**
   * 组件的初始数据
   */
  data: {
    index: -1, // 下标
    mainCourse: false // 公开课
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 初始化数据
     */
    init() {

    },

    /**
     * 点击小节
     */
    part(e) {
      // 获取参数
      const {index} = e.currentTarget.dataset, {
        course,
        tutor,
        part: list
      } = this.data

      if (list[index].media == 'audio') {

        // 停止视频
        VIDEO.stop()

        // 初始化媒体并播放
        AUDIO.init({
          course,
          tutor,
          part: {
            list,
            index
          }
        })
      } else if (list[index].media == 'video') {

        // 停止音频
        AUDIO.stop()

        // 初始化媒体并播放
        VIDEO.init({
          course,
          tutor,
          part: {
            list,
            index
          }
        })
      }
    }
  },

  /**
   * 生命周期
   */
  lifetimes: {
    detached() {

      // 停止监听状态
      OBSERVE.unsubscribe('mediaStatus', MEDIA_STATUS)
    },
    ready() {

      // 获取公开课信息
      this.setData({
        mainCourse: getApp().globalData.system.maincourse == 1
      })
    }
  }
})