const UTIL = require('../../utils/util')
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		datas: "",
		list_arr:[]
	},
	//下拉刷新
	onPullDownRefresh: function () {
		wx.showNavigationBarLoading();//在标题栏中显示加载
		//加载数据
		this.data_fuc();
		this.list_fuc();

		setTimeout(function () {

			wx.hideNavigationBarLoading();//完成停止加载

			wx.stopPullDownRefresh();//停止下拉刷新

		}, 1500);
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.data_fuc();
		this.list_fuc();
	},
	//加载初始数据
	data_fuc: function () {
		var th = this;
		wx.request({
			url: getApp().globalData.url.host + 'api/course/shop_background',
			method: 'post',
			data: {

			},
			header: {
				'content-type': 'application/json'
			},
			success(res) {
				//console.log(res.data.data);
				var result = res.data.data;
				th.setData({
					datas: result,
				})
			}
		})
	},
	list_fuc: function () {
		var th = this;
		var uid = wx.getStorageSync('userInfo').id;
		wx.request({
			url: getApp().globalData.url.host + 'api/course/shop_list',
			method: 'post',
			data: {
				uid: uid
			},
			header: {
				'content-type': 'application/json'
			},
			success(res) {
				//console.log(res.data.data);
				var result = res.data.data;
				th.setData({
					list_arr: result,
				})
			}
		})
	},
	goDetails: function (e) {
		var id = e.currentTarget.dataset.id;
		var group_id = app.globalData.group_id;
		console.log(group_id);
		if (group_id > id) {
			wx.showToast({
				title: '您已开通更高级别',
				icon: 'loading',
				duration: 1000
			})
			return false;
		}
		if (group_id == id) {
			wx.showToast({
				title: '您已经是此级别1',
				icon: 'loading',
				duration: 1000
			})
			return false;
		}
		wx.navigateTo({
			url: '/pages/agent/details?id='+id
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