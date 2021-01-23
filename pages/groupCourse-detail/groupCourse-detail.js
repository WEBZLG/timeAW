const app = getApp()
import {formatTime, countDown, clearTimeOut} from '../../utils/common.js';
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		remainTime:60,
		clock:formatTime(60),
		jigsaw_id: 0,
		team_id: 0,
		data_arr: [],
		nowtime: "",
		userInfo: app.globalData.userInfo,
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		wx.hideShareMenu();//隐藏右上角转发
		var jigsaw_id = options.jigsaw_id;
		//var jigsaw_id=4;
		this.setData({
			jigsaw_id: jigsaw_id,
		})
		this.course_info_fuc(jigsaw_id);
	},
	//初始数据
	course_info_fuc: function (jigsaw_id) {
		var th = this;
    var uid = wx.getStorageSync('userInfo').id;
		wx.request({
			//url: app.globalData.apiUrl + 'api/course/jigsaw_course_info',
      url: getApp().globalData.url.host + 'api/course/ready_jigsaw',
			method: 'post',
			data: {
				jigsaw_id: jigsaw_id,
				uid: uid
			},
			header: {
				'content-type': 'application/json'
			},
			success(res) {
				console.log(res.data.data);
				var result = res.data.data;
				var endtime = res.data.data.jigsaw.deadline;
				var nowtime = res.data.time;
				if (endtime > nowtime) {
					var overtime = endtime - nowtime;
				} else {
					var overtime = 0;
				}
				//console.log(overtime);
				th.setData({
					data_arr: result,
					nowtime: res.data.time,
					remainTime: overtime,
					clock: formatTime(overtime),
				})
				clearTimeout();
				if (th.data.remainTime) {
					countDown(th);
				}
			}
		})
	},
	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		/*clearTimeout();
		if(this.data.remainTime){
			countDown(this);
		}*/
	},
	//分享
	onShareAppMessage: function (e) {
		/*return {
			title: '邀请您一块来拼课，好课免费领',
			path: '/pages/pincourse/details?team_id=' + 13,
			imageUrl: 'https://cm.chineseglory.cn/images/share.jpg'
		}
		return false;*/
		var th = this;
		var course_id = th.data.data_arr.course.id;
		let nickname = th.data.data_arr.author.name;
    var uid = wx.getStorageSync('userInfo').id;
		if (e.from === 'button') {
			//区别按钮
			var type= e.target.dataset.type;
			if(type==1){
				//开启拼团
				wx.request({
          url: getApp().globalData.url.host + 'api/course/jigsaw_open',
					method: 'post',
					data: {
						uid: uid,
						course_id: course_id
					},
					header: {
						'content-type': 'application/json'
					},
					success(res) {
						let team_id = res.data.data;
						th.setData({
							team_id: team_id
						})
					}
				})
				let team_id = th.data.team_id;
				//分享
				return {
					title: nickname + '邀请您一块来拼课，好课免费领',
					path: '/pages/pincourse/share_details?team_id=' + team_id,
					imageUrl: 'https://cm.chineseglory.cn/images/share.jpg'
				}
			}else{
				//邀请拼团
				return {
					title: '我是' + nickname + ',在这个小程序里，知识能赚钱',
					//path: '/pages/share/share?id='+app.globalData.userInfo.data.id,
					path: '/pages/index/index?parent_id=' + uid,
					imageUrl: 'https://qianyao.chineseglory.cn/images/share.png'
				}
			}
		}else{
			//非按钮分享
			return {
				title: '我是' + nickname + ',在这个小程序里，知识能赚钱',
				//path: '/pages/share/share?id='+app.globalData.userInfo.data.id,
				path: '/pages/index/index?parent_id=' + uid,
				imageUrl: 'https://qianyao.chineseglory.cn/images/share.png'
			}
		}
		/*return {
			title: '社交新零售平台展示',
			//path: '/pages/share/share?id='+app.globalData.userInfo.data.id,
			path: '/pages/index/index?id=' + app.globalData.userInfo.data.id,
			imageUrl: 'https://qianyao.chineseglory.cn/images/share.png'
		}*/
	}
})