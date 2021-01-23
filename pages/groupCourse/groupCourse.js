const UTIL = require('../../utils/util')
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		data_arr:[]
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.mydata_fuc();
	},
	//加载初始用户数据
	mydata_fuc: function () {
		var th = this;
    var uid = wx.getStorageSync('userInfo').id;
		wx.request({
      url: getApp().globalData.url.host + '/api/course/jigsaw_list',
			method: 'post',
			data: {
				uid: uid
			},
			header: {
				'content-type': 'application/json'
			},
			success(res) {
				console.log(res.data.data);
				var result = res.data.data;
				th.setData({
					data_arr: result,
				})
			}
		})
	},
	//跳转拼课详情
	goPinKeDetails:function(e){
		var jigsaw_id = e.currentTarget.dataset.id;
		wx.navigateTo({
      url: '/pages/groupCourse-detail/groupCourse-detail?jigsaw_id=' + jigsaw_id
		})
	},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

    // 分享
    return UTIL.share()
  }
})