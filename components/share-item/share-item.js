const
  AUTH = require('../../utils/auth'),
  UTIL = require('../../utils/util'),
  SHARE_SERVICE = require('../../service/share.service')

/**
 * 分享-元素
 * 陈浩
 * 2019/7/17
 */
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type: {
      type: String,
      value: 'list'
    }, // 类型，列表（list）或者我的（my）
    share: {
      type: Object,
      value: {},
    } // 分享数据
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

    /**
     * 预览
     */
    preview(e) {
      // 获取地址
      console.log(e)
      const url = e.currentTarget.dataset.preview

      // 预览
      wx.previewImage({
        urls: [url],
        current: url
      })
    },

    /**
     * 导师详情
     */
    tutorDetail(e) {

      // 获取数据
      const share = this.data.share
      // 如果是导师，则跳转导师详情
      // if (share.is_author) {

      //   // 跳转
      //   wx.navigateTo({
      //     url: `/pages/tutor-home/tutor-home?id=${share.is_author}`,
      //   })
      // }else {
      //   // 跳转
      //   wx.navigateTo({
      //     // url: `/pages/tutor-home/tutor-home?id=${share.is_author}`,
      //     url: `/pages/material/material`
      //   })
      // }
    },

    /**
     * 复制文字
     */
    copy(e) {

      // 获取文本
      const content = this.data.share.share_content

      // 设置剪贴板
      wx.setClipboardData({
        data: content
      })
    },

    /**
     * 加入收藏
     */
    async favorite(e) {

      try {

        // 显示加载
        wx.showLoading({
          mask: true
        })

        // 获取参数
        const share = this.data.share

        // 获取数据
        share.is_collect ? await SHARE_SERVICE.unfavorite(wx.getStorageSync('userInfo').id, share.id) : await SHARE_SERVICE.favorite(wx.getStorageSync('userInfo').id, share.id)

        // 隐藏提示
        wx.hideLoading()

        // 显示提示
        wx.showToast({
          title: share.is_collect ? '取消成功' : '收藏成功',
        })

        // 设置数据
        this.setData({
          'share.is_collect': share.is_collect ^ 1
        })

        // 弹出收藏
        this.triggerEvent('favorite', {
          id: share.id,
          status: false
        })
      } catch (e) {

        // 隐藏提示
        wx.hideLoading()

        // 弹出提示
        wx.showToast({
          title: e.message,
          icon: 'none'
        })
      }
    },

    /**
     * 视频下载
     */
    async saveVideo(e) {

      try {

        // 显示加载
        wx.showLoading({
          mask: true,
        })

        // 获取视频信息
        const video = this.data.share.video

        // 获取权限
        await AUTH.getAuth('writePhotosAlbum')

        // 获取文件路径
        const filePath = await UTIL.downloadFile(video)

        // 保存文件
        await UTIL.saveVideoToPhotosAlbum(filePath.tempFilePath)

        // 隐藏加载
        wx.hideLoading()

        // 提示
        wx.showToast({
          title: '下载成功',
        })
      } catch (e) {

        // 隐藏加载
        wx.hideLoading()

        if (e.message == 1) {

          // 如果未授权
          wx.showModal({
            content: '未授权下载权限',
            confirmText: '授权',
            success: res => {
              if (res.confirm) wx.openSetting()
            },
          })
        } else {

          // 提示
          wx.showModal({
            content: e.message,
            showCancel: false,
          })
        }
      }
    },

    /**
     * 图片下载
     */
    async saveImage(e) {

      try {

        // 显示加载
        wx.showLoading({
          mask: true,
        })

        // 获取图片信息
        const imageList = this.data.share.share_images

        // 获取权限
        await AUTH.getAuth('writePhotosAlbum')

        // 循环下载
        for (const [index, item] of imageList.entries()) {

          // 提示进度
          wx.showLoading({
            mask: true,
            title: `${index} / ${imageList.length}`,
          })

          // 获取文件路径
          const filePath = await UTIL.downloadFile(item)

          // 保存文件
          await UTIL.saveImageToPhotosAlbum(filePath.tempFilePath)
        }

        // 隐藏加载
        wx.hideLoading()

        // 提示
        wx.showToast({
          title: '下载成功',
        })
      } catch (e) {

        // 隐藏加载
        wx.hideLoading()

        if (e.message == 'auth:fail') {

          // 提示
          wx.showModal({
            content: '未授权下载权限',
            confirmText: '授权',
            success: res => {
              if (res.confirm) wx.openSetting()
            },
          })
        } else {

          // 提示
          wx.showModal({
            content: e.message,
            showCancel: false,
          })
        }
      }
    },
  }
})