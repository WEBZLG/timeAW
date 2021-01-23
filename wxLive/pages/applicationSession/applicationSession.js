const
  UTIL = require('../../../utils/util'),
  LIVE_SERVICE = require('../../../service/live.service')
/**
 * 申请场次
 * 2020/9/28
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    step: {
      list: [
        "基本信息",
        "直播间配置",
        "直播间分享设置",
      ],
      value: 0
    },
    form: {
      type: {
        value: 0,
        list: [{
          title: "手机直播",
          value: 0,
          intro: "通过“小程序直播”小程序开播"
        }, {
          title: "推流设备直播",
          value: 1,
          intro: "通过第三方推流设备发起直播，请自行定义画面宽高比",
          tip: `
            横屏画面：适用于宽高比为 “16：9、4：3、1.85：1” 的视频
            竖屏画面: 适用于宽高比为 “9：16、2：3” 的视频
          `
        }]
      },
      official: {
        value: 0,
        list: [{
          title: "开启",
          value: 0
        }, {
          title: "关闭",
          value: 1
        }]
      },
      screen: {
        value: 0,
        list: [{
          title: "竖屏",
          value: 0
        }, {
          title: "横屏",
          value: 1
        }]
      },
      like: true,
      goods: true,
      comment: true,
      share: true,
      playback: true,
      service:true,
      title: "",
      nickname: "",
      wxcode: "",
      subwxcode: "",
      beginTime: "",
      endTime: "",
      coverImage: {
        value: "",
        temp: ""
      },
      showImage: {
        value: "",
        temp: ""
      },
      shareImage: {
        value: "",
        temp: ""
      },
      channelImage: {
        value: "",
        temp: ""
      }
    } //表单
  },

  /**
   * 图片更改
   */
  async imageChange(e) {

    try {

      // 选择图片
      const tempImage = await wx.chooseImage({
        count: 1,
      })

      // 加载
      wx.showLoading()

      // 获取参数
      const form = this.data.form

      // 上传图像
      const result = await LIVE_SERVICE.upload(tempImage.tempFilePaths[0],e.currentTarget.dataset.name)
      console.log(result)

      // 设置参数
      form[e.currentTarget.dataset.name].temp = tempImage.tempFilePaths[0]
      form[e.currentTarget.dataset.name].value = result.data

      // 设置数据
      this.setData({
        form
      })
    } catch (e) {
      console.log(e)
      // 显示提示
      wx.showModal({
        content: e.message,
        showCancel: false,
      })
    } finally {

      // 隐藏加载
      wx.hideLoading()
    }
  },

  /**
   * 单选更改
   */
  radioChange(e) {
    // 获取参数
    const form = this.data.form

    // 设置参数
    form[e.currentTarget.dataset.name].value = e.currentTarget.dataset.value

    // 设置数据
    this.setData({
      form
    })
  },

  /**
   * 开关更改
   */
  switchChange(e) {

    // 获取参数
    const form = this.data.form

    // 设置参数
    form[e.currentTarget.dataset.name] = e.detail.value

    // 设置数据
    this.setData({
      form
    })
  },

  /**
   * 输入
   */
  onInput(e) {
    // 获取参数
    const form = this.data.form

    // 设置参数
    form[e.currentTarget.dataset.name] = e.detail.value

    // 设置数据
    this.setData({
      form
    })
  },

  beginOpen() {
    this.selectComponent("#begin").open()
  },

  endOpen() {
    this.selectComponent("#end").open()
  },

  beginChange(e) {

    // 获取参数
    const {
      date: {
        year,
        month,
        day
      },
      time: {
        hour,
        minute
      }
    } = e.detail

    // 设置数据
    this.setData({
      "form.beginTime": `${year}-${month}-${day} ${hour}:${minute}`
    })
  },

  endChange(e) {

    // 获取参数
    const {
      date: {
        year,
        month,
        day
      },
      time: {
        hour,
        minute
      }
    } = e.detail

    // 设置数据
    this.setData({
      "form.endTime": `${year}-${month}-${day} ${hour}:${minute}`
    })
  },

  /**
   * 打开提示
   */
  tipOpen(e) {
    wx.showModal({
      content: e.currentTarget.dataset.content,
      showCancel: false
    })
  },

  /**
   * 上一步
   */
  back() {
    this.setData({
      'step.value': this.data.step.value - 1
    })

    wx.nextTick(() => {
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 0
      })
    })
  },

  /**
   * 下一步
   */
  next() {
    try {

      // 获取数据
      const {
        type: {
          value: type
        },
        title,
        nickname,
        wxcode,
        subwxcode,
        beginTime,
        endTime,
        coverImage,
        // showImage,
        shareImage,
        channelImage,
      } = this.data.form

      if (this.data.step.value == 0) {
        UTIL.check(title, '请填写直播间标题')
        UTIL.check(title, '直播间标题不得包含特殊符号，并且长度在3-14个字范围内', /^[\u4e00-\u9fa5_a-zA-Z0-9]{3,14}$/)
        UTIL.check(nickname, '请填写主播昵称')
        UTIL.check(nickname, '主播昵称不得包含特殊符号', /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/)
        UTIL.check(wxcode, '请填写正确的主播微信账号', /^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$/)
        if (type==0 && subwxcode) UTIL.check(subwxcode, '请填写正确的副播微信账号', /^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$/)
        UTIL.check(beginTime, '请选择开始时间')
        UTIL.check(endTime, '请选择结束时间')
        UTIL.check(new Date(beginTime.replace(/-/g, "/")).getTime() > new Date().getTime() + 1800000, '开始时间必须在当前时间30分钟后')
        let m = new Date()
        let newm = m.setMonth(m.getMonth() + 3)
        UTIL.check(new Date(beginTime.replace(/-/g, "/")).getTime() < newm, '开始时间不能在3个月后')
        UTIL.check(new Date(endTime.replace(/-/g, "/")).getTime() > new Date(beginTime.replace(/-/g, "/")).getTime(), '结束时间必须大于开始时间')
        if(this.getHour(beginTime,endTime)>12){
          wx.showToast({
            title: '直播时间间隔不得超过12小时',
            icon:'none'
          })
          return false;
        }else if(this.getHour(beginTime,endTime)<0.5){
          wx.showToast({
            title: '开播时间和结束时间间隔不得短于30分钟',
            icon:'none'
          })
          return false;
        }
      } else if (this.data.step.value == 1) {
        UTIL.check(coverImage.value, '请上传直播间背景墙图片')
      } else {
        UTIL.check(shareImage.value, '请上传直播间分享图片')
        UTIL.check(channelImage.value, '请上传购物直播频道图片')
        // UTIL.check(showImage.value, '请上传直播间展示图片')
      }

      this.setData({
        'step.value': this.data.step.value + 1
      })

      wx.nextTick(() => {
        wx.pageScrollTo({
          scrollTop: 0,
          duration: 0
        })
      })
    } catch (e) {
      console.log(e)
      // 显示提示
      wx.showModal({
        content: e.message,
        showCancel: false,
      })
    }
  },

  getTimestamp(time) { //把时间日期转成时间戳
    return (new Date(time)).getTime() / 1000
    },
  getHour(s1,s2) {
      s1 = new Date(s1.replace(/-/g, '/'));
      s2 = new Date(s2.replace(/-/g, '/'));
      var ms = Math.abs(s1.getTime() - s2.getTime());
      return ms / 1000 / 60 / 60;
  },
  /**
   * 提交
   */
  async onSubmit() {
    try {

      // 显示加载
      wx.showLoading()

      // 获取数据
      const {
        type: {
          value: type
        },
        official: {
          value: official
        },
        like,
        goods,
        comment,
        share,
        playback,
        service,
        title,
        nickname,
        wxcode,
        subwxcode,
        beginTime,
        endTime,
        coverImage,
        // showImage,
        shareImage,
        channelImage
      } = this.data.form

      UTIL.check(title, '请填写直播间标题')
      UTIL.check(title, '直播间标题不得包含特殊符号，并且长度在3-14个字范围内', /^[\u4e00-\u9fa5_a-zA-Z0-9]{3,14}$/)
      UTIL.check(nickname, '请填写主播昵称')
      UTIL.check(nickname, '主播昵称不得包含特殊符号', /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/)
      UTIL.check(wxcode, '请填写正确的主播微信账号', /^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$/)
      if (type==0 && subwxcode) UTIL.check(subwxcode, '请填写正确的副播微信账号', /^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$/)
      UTIL.check(beginTime, '请选择开始时间')
      UTIL.check(endTime, '请选择结束时间')
      UTIL.check(new Date(beginTime.replace(/-/g, "/")).getTime() > new Date().getTime() + 1800000, '开始时间必须在当前时间30分钟后')
      UTIL.check(new Date(endTime.replace(/-/g, "/")).getTime() > new Date(beginTime.replace(/-/g, "/")).getTime(), '结束时间必须大于开始时间')
      UTIL.check(coverImage.value, '请上传直播间背景墙图片')
      UTIL.check(shareImage.value, '请上传直播间分享图片')
      UTIL.check(channelImage.value, '请上传购物直播频道图片')
      // UTIL.check(showImage.value, '请上传直播间展示图片')
      let startTime = this.getTimestamp(beginTime)
      let stopTime = this.getTimestamp(endTime)
      // 申请
      await LIVE_SERVICE.sessionNew({
        name: title,
        coverImg: coverImage.value,
        startTime: startTime,
        endTime: stopTime,
        anchorName: nickname,
        anchorWechat: wxcode,
        subAnchorWechat: subwxcode,
        createrWechat:wxcode,
        shareImg: shareImage.value,
        feedsImg: channelImage.value,
        isFeedsPublic:Number(!official),
        type: type,
        closeLike: Number(!like),
        closeGoods: Number(!goods),
        closeComment: Number(!comment),
        closeReplay: Number(!playback),
        closeShare: Number(!share),
        closeKf: Number(!service),
        // name: title,
        // cover_image: coverImage.value,
        // show_image: showImage.value,
        // share_image: shareImage.value,
        // channel_image: channelImage.value,
        // start_time: beginTime,
        // end_time: endTime,
        // anchor_name: nickname,
        // anchor_wechat: wxcode,
        // helper_wechat: subwxcode,
        // type: type,
        // close_like: Number(!like),
        // close_goods: Number(!goods),
        // close_comment: Number(!comment),
        // close_official: official,
        // share: Number(share),
        // replay: Number(playback),
        // user_id: wx.getStorageSync('userInfo').id
      })

      // 触发刷新
      this.getOpenerEventChannel().emit('init')

      wx.showModal({
        content: "提交成功",
        showCancel: false,
        success: () => {

          // 后退
          wx.navigateBack()
        },
      })
    } catch (e) {

      // 显示提示
      wx.showModal({
        content: e.message,
        showCancel: false,
      })
    } finally {

      // 隐藏加载
      wx.hideLoading()
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

    // 分享
    return UTIL.share()
  }
})