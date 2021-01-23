const
  COURSE_SERVICE = require('../../service/course.service'),
  USERINFO_SERVICE = require('../../service/userInfo.service'),
  OBSERVE = require('../../utils/observe'),
  UTIL = require('../../utils/util'),
  AUTH = require('../../utils/auth')
/**
 * 音频类
 */
class Audio {

  constructor() {

    // 获取管理器
    this.audio = wx.getBackgroundAudioManager()

    // 初始化状态
    this.status = 'stop'
    this.data = {
      current: 0,
      course: {},
      part: {
        list: [],
        index: -1
      }
    }

    // 监听音频播放
    this.audio.onPlay(() => {

      // 隐藏加载
      wx.hideLoading()

      // 设置状态
      this.status = 'play'

      // 推送音频播放
      OBSERVE.publish('mediaStatus', {
        status: 'play',
        type: 'audio',
        data: this.data
      })

      // 推送加载完成
      OBSERVE.publish('mediaLoad', {
        status: 'loadend',
        type: 'audio',
        data: this.data
      })
    })

    // 监听暂停
    this.audio.onPause(() => {

      // 设置状态
      this.status = 'pause'

      // 推送音频暂停
      OBSERVE.publish('mediaStatus', {
        status: 'pause',
        type: 'audio',
        data: this.data
      })
    })

    // 监听停止
    this.audio.onStop(() => {

      // 设置状态
      this.status = 'stop'

      // 推送音频停止
      OBSERVE.publish('mediaStatus', {
        status: 'stop',
        type: 'audio',
        data: this.data
      })
    })

    // 监听自然停止
    this.audio.onEnded(() => {

      // 设置状态
      this.status = 'stop'

      // 推送音频停止
      OBSERVE.publish('mediaStatus', {
        status: 'ended',
        type: 'audio',
        data: this.data
      })

      // 播放下一曲
      this.next()
    })

    // 监听加载中
    this.audio.onWaiting(() => {

      // 显示加载
      wx.showLoading({
        mask: true
      })

      // 推送加载中
      OBSERVE.publish('mediaLoad', {
        status: 'loading',
        type: 'audio',
        data: this.data
      })
    })

    // 监听加载中
    this.audio.onCanplay(() => {

      // 隐藏加载
      wx.hideLoading()

      // 推送加载完成
      OBSERVE.publish('mediaLoad', {
        status: 'loadend',
        type: 'audio',
        data: this.data
      })
    })

    // 监听下一曲
    this.audio.onNext(() => {
      this.next()
    })

    // 监听上一曲
    this.audio.onPrev(() => {
      this.prev()
    })

    // 监听进度
    this.audio.onTimeUpdate(() => {

      // 获取进度
      this.data.current = this.audio.currentTime

      // 推送音频进度
      OBSERVE.publish('mediaProgress', {
        status: 'progress',
        type: 'audio',
        data: this.data
      })
    })
  }

  /**
   * 切换
   */
  toggle(data) {

    if (this.status == 'play' && data.part.list[data.part.index].id == this.data.part.list[this.data.part.index].id) return

    // 显示加载
    wx.showLoading({
      mask: true
    })

    // 设置数据
    this.data.current = 0
    this.data.course = data.course
    this.data.part = data.part
    this.data.tutor = data.tutor

    // 音频播放器需设置微信提供的全局播放器
    this.audio.title = `${data.course.name} ${data.part.list[data.part.index].title}`
    this.audio.singer = data.tutor.name
    this.audio.coverImgUrl = data.course.top_thumb
    this.audio.src = data.part.list[data.part.index].audio
    this.audio.startTime = data.startTime || 0
  }

  /**
   * 初始化
   */
  async init(data) {

    try {

      if (this.status == 'play' && data.part.list[data.part.index].id == this.data.part.list[this.data.part.index].id) return

      // 显示加载
      wx.showLoading({
        mask: true
      })

      // 验证登录
      await AUTH.loginStatus()

      // 获取参数
      const {
        group_id,
        author_id
      } = wx.getStorageSync('userInfo')

      // 判断上线
      if (getApp().globalData.system.maincourse == 1) {

        // 当前用户的导师ID等于课程的导师ID则无条件播放
        if (author_id != data.tutor.id) {

          // 不是试听课，则进行验证，否则直接播放
          if (data.course.test_num <= data.part.index) {

            // 是否是主营课
            if (data.course.is_package == 1) {

              // 用户未拥有，则申请课程
              UTIL.check(data.course.is_own == 1, 'own:fail')
            }
            // 非主营课
            else {

              // 非主营课(即为福利课)并且用户等级低于VIP，则提示升级VIP
              UTIL.check(group_id >= 2, 'vip:fail')
            }
          }
        }

        // 发送进度
        await COURSE_SERVICE.progress(wx.getStorageSync('userInfo').id, data.course.id, data.part.list[data.part.index].id, UTIL.secondToMinute(data.part.list[data.part.index].duration))

        // 获取信息
        await USERINFO_SERVICE.get(wx.getStorageSync('userInfo').id)
      }

      // 设置数据
      this.data.current = 0
      this.data.course = data.course
      this.data.part = data.part
      this.data.tutor = data.tutor

      // 音频播放器需设置微信提供的全局播放器
      this.audio.title = `${data.course.name} ${data.part.list[data.part.index].title}`
      this.audio.singer = data.tutor.name
      this.audio.coverImgUrl = data.course.top_thumb
      this.audio.src = data.part.list[data.part.index].audio
      this.audio.startTime = 0
    } catch (e) {

      // 隐藏加载
      wx.hideLoading()

      // 推送播放错误
      OBSERVE.publish('play:fail', e.message)
    }
  }

  /**
   * 播放
   */
  play() {

    // 音频播放
    this.audio.play()
  }

  /**
   * 暂停
   */
  pause() {

    // 音频暂停
    this.audio.pause()
  }

  /**
   * 停止
   */
  stop() {

    // 音频停止
    this.audio.stop()
  }

  /**
   * 播放进度
   */
  seek(value) {

    // 显示加载
    wx.showLoading({
      mask: true
    })

    // 推送加载中
    OBSERVE.publish('mediaLoad', {
      status: 'loading',
      type: 'audio',
      data: this.data
    })

    // 跳转
    this.audio.seek(value)
  }

  /**
   * 上一曲
   */
  prev() {

    // 获取参数
    const {
      course,
      part,
      tutor
    } = this.data

    // 上一曲
    if (part.index - 1 >= 0) {
      this.init({
        course,
        tutor,
        part: {
          list: part.list,
          index: part.index - 1
        },
      })
    }
  }

  /**
   * 下一曲
   */
  next() {

    // 获取参数
    const {
      course,
      part,
      tutor
    } = this.data

    // 下一曲
    if (part.index + 1 < part.list.length) {
      this.init({
        course,
        tutor,
        part: {
          list: part.list,
          index: part.index + 1
        },
      })
    }
  }
}



/**
 * 视频
 */
class Video {

  constructor() {

    // 初始化状态
    this.status = 'stop'
    this.data = {
      current: 0,
      course: {},
      part: {
        list: [],
        index: -1
      }
    }
  }

  /**
   * 切换
   */
  toggle(data) {

    if (this.status == 'play' && data.part.list[data.part.index].id == this.data.part.list[this.data.part.index].id) return

    // 显示加载
    wx.showLoading({
      mask: true
    })

    // 设置数据
    this.data.current = data.startTime || 0
    this.data.course = data.course
    this.data.part = data.part
    this.data.tutor = data.tutor

    OBSERVE.subscribe('mediaStatus', media => {

      if (media.type == 'audio' && media.status == 'stop') {

        // 停止播放
        if (this.status != 'stop') this.stop()

        // 下一刻播放
        wx.nextTick(() => {

          // 视频播放器为单页组件，只能通过广播播放状态启动
          this.play()
        })
      }
    }, {
      once: true
    })

    // 隐藏加载
    wx.hideLoading()
  }

  /**
   * 初始化
   */
  async init(data) {

    try {

      if (this.status == 'play' && data.part.list[data.part.index].id == this.data.part.list[this.data.part.index].id) return

      // 显示加载
      wx.showLoading({
        mask: true
      })

      // 验证登录
      await AUTH.loginStatus()

      // 获取参数
      const {
        group_id,
        author_id
      } = wx.getStorageSync('userInfo')

      // 判断上线
      if (getApp().globalData.system.maincourse == 1) {

        // 当前用户的导师ID等于课程的导师ID则无条件播放
        if (author_id != data.tutor.id) {

          // 不是试听课，则进行验证，否则直接播放
          if (data.course.test_num <= data.part.index) {

            // 是否是主营课
            if (data.course.is_package == 1) {

              // 用户未拥有，则申请课程
              UTIL.check(data.course.is_own == 1, 'own:fail')
            }
            // 非主营课
            else {

              // 非主营课(即为福利课)并且用户等级低于VIP，则提示升级VIP
              UTIL.check(group_id >= 2, 'vip:fail')
            }
          }
        }

        // 发送进度
        await COURSE_SERVICE.progress(wx.getStorageSync('userInfo').id, data.course.id, data.part.list[data.part.index].id, UTIL.secondToMinute(data.part.list[data.part.index].duration))

        // 获取信息
        await USERINFO_SERVICE.get(wx.getStorageSync('userInfo').id)
      }

      // 设置数据
      // this.data.current = data.startTime || 0
      this.data.current = 0
      this.data.course = data.course
      this.data.part = data.part
      this.data.tutor = data.tutor

      // 停止播放
      if (this.status != 'stop') this.stop()

      // 下一刻播放
      wx.nextTick(() => {

        // 视频播放器为单页组件，只能通过广播播放状态启动
        this.play()
      })

      // 隐藏加载
      wx.hideLoading()
    } catch (e) {

      // 隐藏加载
      wx.hideLoading()

      // 推送播放错误
      OBSERVE.publish('play:fail', e.message)
    }
  }

  /**
   * 播放
   */
  play() {

    // 设置状态
    this.status = 'play'

    // 推送视频播放
    OBSERVE.publish('mediaStatus', {
      status: 'play',
      type: 'video',
      data: this.data
    })
  }

  /**
   * 暂停
   */
  pause() {

    // 设置状态
    this.status = 'pause'

    // 推送视频暂停
    OBSERVE.publish('mediaStatus', {
      status: 'pause',
      type: 'video',
      data: this.data
    })
  }

  /**
   * 停止
   */
  stop() {

    // 设置状态
    this.status = 'stop'

    // 推送视频暂停
    OBSERVE.publish('mediaStatus', {
      status: 'stop',
      type: 'video',
      data: this.data
    })
  }

  /**
   * 自然停止
   */
  ended() {

    // 设置状态
    this.status = 'stop'

    // 推送视频停止
    OBSERVE.publish('mediaStatus', {
      status: 'ended',
      type: 'video',
      data: this.data
    })

    // 播放下一曲
    this.next()
  }

  /**
   * 上一曲
   */
  prev() {

    // 获取参数
    const {
      course,
      part,
      tutor
    } = this.data

    // 上一曲
    if (part.index - 1 >= 0) {
      this.init({
        course,
        tutor,
        part: {
          list: part.list,
          index: part.index - 1
        },
      })
    }
  }

  /**
   * 下一曲
   */
  next() {

    // 获取参数
    const {
      course,
      part,
      tutor
    } = this.data

    // 下一曲
    if (part.index + 1 < part.list.length) {
      this.init({
        course,
        tutor,
        part: {
          list: part.list,
          index: part.index + 1
        },
      })
    }
  }
}

// 输出音频
module.exports = {
  // Media,
  Video,
  Audio
}