var wx = require('weixin-js-sdk')

let wechatConfigCache = null

function loadWechatConfig () {
	if (wechatConfigCache) {
		return Promise.resolve(wechatConfigCache)
	}
	return fetch('/api/wechat-sign-signature')
		.then(response => response.json())
		.then(data => {
			wechatConfigCache = data.config
			wx.config({
				debug: true,
				appId: 'wxc4cf8e62667f92ea',
				timestamp: wechatConfigCache.timestamp,
				nonceStr: wechatConfigCache.nonceStr,
				signature: wechatConfigCache.signature,
				jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline']
			})
			return wechatConfigCache
		})
}

export function updatePageInfo (title, desc, imgUrl) {
	loadWechatConfig()
		.then(() => {
			wx.ready(function () {
				let data = {
					title,
					desc,
					link: location.href,
					imgUrl
				}
				wx.onMenuShareAppMessage(data)
				wx.onMenuShareTimeline(data)
			})
		})
}