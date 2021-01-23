const
  UTIL = require('../../utils/util'),
  SHARE_SERVICE = require('../../service/share.service')

/**
 * 素材发布
 * 陈浩 2019/12/2
 * 于家辉 2019/11/31
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: '', // 文本内容
    tag: {
      list: [], // 列表
      max: 2 // 最大选中
    }, // 标签
    picture: {
      list: [], // 列表
      max: 9 // 最大
    }, // 图片
    video: {
      max: 1, // 最大数量
      list: [] // 列表
    }, // 视频
  },

  /**
   * 选择
   */
  choose(e) {
    wx.showActionSheet({
      itemList: ['添加图片', '添加视频'],
      success: res => {

        // 选项
        const select = [() => {
          wx.chooseImage({
            success: res => {
              this.setData({
                'picture.list': res.tempFilePaths
              })
            },
          })
        }, () => {
          wx.chooseVideo({
            maxDuration: 15,
            compressed: false,
            success: res => {
              try {

                // 验证
                UTIL.check(res.duration < 15, '上传的视频不能大于15秒')

                // 设置数据
                this.setData({
                  'video.list': [res.tempFilePath]
                })
              } catch (e) {

                // 提示
                wx.showModal({
                  content: e.message,
                  showCancel: false
                })
              }
            }
          })
        }]

        // 执行选项
        select[res.tapIndex]()
      },
    })
  },

  /**
   * 添加素材
   */
  post(e) {

    // 设置数据
    const select = {
      picture: () => {
        this.setData({
          'picture.list': e.detail.value
        })
      },
      video: () => {
        this.setData({
          'video.list': e.detail.value
        })
      }
    }

    // 执行函数
    select[e.currentTarget.dataset.type]()
  },

  /**
   * 删除素材
   */
  delete(e) {

    // 设置数据
    const select = {
      picture: () => {
        this.setData({
          'picture.list': e.detail.value
        })
      },
      video: () => {
        this.setData({
          'video.list': e.detail.value
        })
      }
    }

    // 执行函数
    select[e.currentTarget.dataset.type]()
  },

  /**
   * 提交
   */
  async submit(e) {

    console.log(e)

    try {

      // 获取数据
      const
        tag = e.detail.value.tag,
        description = e.detail.value.description,
        picture = e.detail.value.picture,
        video = e.detail.value.video,
        originalPicture = [],
        previewPicture = [],
        originalVideo = {
          file: [],
          cover: []
        }

      // 获取标签
      const tagParams = tag.reduce((result, item) => {
        result.push(this.data.tag.list[item].id)
        return result
      }, [])

      // 验证表单
      UTIL.check(tag.length, '请选择分类')
      UTIL.check(picture || video, '请上传素材')
      UTIL.check(description.length, '请填写素材描述')

      // 显示提示
      wx.showLoading({
        mask: true,
      })

      // 判断图片
      if (picture) {

        // 循环上传
        for (const [index, item] of picture.entries()) {

          // 提示进度
          wx.showLoading({
            mask: true,
            title: `${index + 1} / ${picture.length}`,
          })

          // 上传图片
          const result = await SHARE_SERVICE.uploadImage(item)

          // 添加原图路径
          originalPicture.push(result.data.file)

          // 添加预览图路径
          previewPicture.push(result.data.img_thumb)
        }

        // 发布
        await SHARE_SERVICE.postImage(wx.getStorageSync('userInfo').id, tagParams.join(), originalPicture.join(), previewPicture.join(), description)
      }
      // 判断视频
      else if (video) {

        // 循环上传
        for (const item of video) {

          // 上传视频
          const result = await SHARE_SERVICE.uploadVideo(item)

          // 上传视频
          originalVideo.file.push(result.data.file)
          originalVideo.cover.push(result.data.video_fm)
        }

        // 发布
        await SHARE_SERVICE.postVideo(wx.getStorageSync('userInfo').id, tagParams.join(), originalVideo.file.join(), originalVideo.cover.join(), description)
      }

      // 隐藏提示
      wx.hideLoading()

      // 显示提示
      this.selectComponent('#form-Success').open()

      // 清空
      this.setData({
        content: ''
      })
    } catch (e) {

      // 隐藏提示
      wx.hideLoading()

      // 提示错误
      wx.showToast({
        title: e.message,
        icon: 'none'
      })
    }
  },

  /**
   * 弹窗点击继续按钮
   */
  goOn() {
    wx.redirectTo({
      url: '/pages/share-post/share-post',
    })
  },

  /**
   * 弹窗点击完成按钮
   */
  finish() {
    wx.navigateBack()
  },

  /**
   * 初始化数据
   */
  async init() {

    // 获取容器
    const container = this.selectComponent('#container')

    try {

      // 获取数据
      const result = await SHARE_SERVICE.tag()

      // 设置数据
      this.setData({
        'tag.list': result.data.slice(1, result.data.length)
      })

      // 设置状态
      container.status('default')
    } catch (e) {

      // 设置状态
      container.status('error', e.message)
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

    // 初始化数据
    this.init()
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