// components/dynamic-item/dynamic-item.js
const
  AUTH = require('../../utils/auth'),
  UTIL = require('../../utils/util'),
  SHARE_SERVICE = require('../../service/share.service')
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
    }, // 分享数据
  },
  attached() {
    let that = this
    try {
      var value = wx.getStorageSync('noTips')
      if (value) {
        that.setData({
          noTips: value
        })
      }
    } catch (e) {
      // Do something when catch error
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    releaseTime: '2小时前', // 创建时间
    current: '1', // 当前轮播图位置
  },

  /**
   * 组件的方法列表
   */
  methods: {
    errImg() {
      // console.log('err')
    },
    handleShareClick() {
      let that = this
      wx.request({
        url: `${getApp().globalData.url.host}/api/share/share_times_add`,
        data: {
          share_id: this.data.share.id
        },
        success: (res) => {
          console.log(res)
        }
      })
    },
    //  点击预览
    previewImg: function (e) {
      console.log(e)
      var currentUrl = e.currentTarget.dataset.currenturl
      var previewUrls = e.currentTarget.dataset.previewurl
      try {
        wx.setStorageSync('a', JSON.stringify(true))
      } catch (error) {

      }
      wx.previewImage({
        current: currentUrl, //必须是http图片，本地图片无效
        urls: previewUrls, //必须是http图片，本地图片无效
      })
    },
    handleChange(event) {
      this.setData({
        current: event.detail.current + 1
      })
    },
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
    handleSaveClick(event) {
      if(event.currentTarget.dataset.istips) {
        this.handleShareClick()
      }
      let that = this
      // 一建复制
      wx.setClipboardData({
        data: event.currentTarget.dataset.content,
        success: function (res) {
          // 提示复制成功
          if (that.data.noTips == false) {
            // wx.showToast({
            //   title: '复制成功',
            // });
          }
        },
        fail: () => {
          wx.showToast({
            title: '复制失败，请重试',
          });
        }
      });
      // 判断视频还是图片
      if (event.currentTarget.dataset.isvideo == '1') {
        this.saveVideo(event)
      } else if (event.currentTarget.dataset.isvideo == '2') {
        this.saveImage(event)
      }
    },
    // 不再提示
    saveTips() {
      wx.showModal({
        title: '',
        content: '文案已自动复制，图片（视频）已保存到手机相册',
        showCancel: true,//是否显示取消按钮
        cancelText: "取消",//默认是“取消”
        confirmText: "不再提示",//默认是“确定”
        success: function (res) {
          if (res.confirm) {
            try {
              wx.setStorageSync('noTips', JSON.stringify(true))
            } catch (error) { }
          }
        },
        fail: function (res) { },//接口调用失败的回调函数
        complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
      })
    },
    // 保存图片
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
          console.log(filePath)
          if(filePath.statusCode === 404) {
            wx.showToast({
              title: '下载失败！请联系管理员',
              icon: 'none',
              duration: 2000
            })
          }
          // 保存文件
          await UTIL.saveImageToPhotosAlbum(filePath.tempFilePath)
          wx.showToast({
            title: '图片保存成功',
          })
        }

        // 隐藏加载
        // wx.hideLoading()

        // 提示
        if (e.currentTarget.dataset.istips) {
          try {
            let value = wx.getStorageSync('noTips')
            if (!value) {
              this.saveTips()
            } else {
              wx.showToast({
                title: '下载成功',
              })
            }
          } catch (error) {

          }
        }

      } catch (e) {
        if(e == 'Error: writePhotosAlbum:reject') {
          wx.hideLoading()
          wx.showModal({
            content: '不允许获取相册权限，将无法保存图片到手机相册，是否打开相册权限',
            confirmText: '去设置',
            cancelText: '取消',
            success: (res) => {
              if (res.confirm) wx.openSetting()
            },
            fail: () => {
  
            }
          })
        } else if(e.errMsg == 'saveImageToPhotosAlbum:fail cancel') {
          // console.log(e.errMsg)
          wx.hideLoading()
        } 
      }
    },
    // 保存视频
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

        if (e.currentTarget.dataset.istips) {
          try {
            let value = wx.getStorageSync('noTips')
            if (!value) {
              this.saveTips()
            } else {
              wx.showToast({
                title: '下载成功',
              })
            }
          } catch (error) {

          }
        }
        wx.showToast({
          title: '视频保存成功',
        })

      } catch (e) {
        console.log(e)
        // 隐藏加载
        wx.hideLoading()

        if(e == 'Error: writePhotosAlbum:reject') {
          wx.hideLoading()
          wx.showModal({
            content: '不允许获取相册权限，将无法保存图片到手机相册，是否打开相册权限',
            confirmText: '去设置',
            cancelText: '取消',
            success: (res) => {
              if (res.confirm) wx.openSetting()
            },
            fail: () => {
  
            }
          })
        } else if(e.errMsg == 'saveVideoToPhotosAlbum:fail cancel') {
          // console.log(e.errMsg)
          wx.hideLoading()
        } 
      }
    },
  }
})
