class AcFunHelperFrontend extends AcFunHelperFgFrame {
	constructor() {
		super();
		globalThis.runtimeData = this.runtimeData;
		/**@type {runtimeDataFg} */
		this.runtime = globalThis.runtimeData;
		this.runtime.href = window.location.href;
		this.href = this.runtime.href;

		this.MessageRouterFg = new MessageSwitch("fg");
		this.runtime.dataset.core.status.messageSwitch = true;
		this.div = new Div(); //右侧助手
		this.runtime.dataset.core.status.helperFgPop = true;
		this.block = new Block(); //up主过滤
		this.runtime.dataset.core.status.block = true;
		this.pageBeautify = new PageBeautify(); //界面美化
		this.runtime.dataset.core.status.pageBeautify = true;
		this.videoPageBeautify = new videoPageBeautify();//视频页界面美化
		this.runtime.dataset.core.status.videoPageBeautify = true;
		this.livePageBeautify = new LivePageButfy(); //生放送界面美化
		this.runtime.dataset.core.status.livePageBeautify = true;
		this.ce = new CommentEnhance(); //评论区增强
		this.runtime.dataset.core.status.comments = true;
		this.download = new Download(); //下载(视频、封面)
		this.runtime.dataset.core.status.download = true;
		this.live = new Live(); //直播
		this.runtime.dataset.core.status.live = true;
		this.authInfo = new AuthInfoFg(); //必要信息获取
		this.runtime.dataset.core.status.authInfo = true;
		this.banana = new Banana(); //自动投蕉
		this.runtime.dataset.core.status.banana = true;
		this.videoSetting = new VideoSetting(); //视频播放设置：自定义倍速、观影模式等
		this.runtime.dataset.core.status.videoSetting = true;
		this.danmaku = new Danmaku(); //弹幕服务
		this.runtime.dataset.core.status.danmaku = true;
		this.danmusearch = new Search();//弹幕列表搜索
		this.runtime.dataset.core.status.danmakuSearch = true;
		this.luckyTurntab = new LuckyTtab(); //幸运轮盘（抽奖）
		this.runtime.dataset.core.status.luckyTurntab = true;
		this.reader = new Reader(); //文章区阅读模式
		this.runtime.dataset.core.status.readMore = true;
		this.funcUrlParam = new FunctionalUrlParam(); //URLParam指令
		this.runtime.dataset.core.status.urlparams = true;


		chrome.runtime.onMessage.addListener(this.MessageRouterFg.FrontendMessageSwitch.bind(this)); //接收来自后台的消息
		window.addEventListener("message", this.MessageRouterFg.FrontendIframeMsgHandler.bind(this)); //接收来自iframe的消息
		window.addEventListener("AcFunHelperFrontend", this.MessageRouterFg.FrontendMsgEventsHandler.bind(this, this.MessageRouterFg));

		this.loading();
		this.runtime.dataset.core.status.core = true;

		//监听storage变化,可用于数据云同步
		// chrome.storage.onChanged.addListener(function (changes, areaName) {
		// });
	}

	/**
	 * 全局样式
	 */
	addStyle() {
		let str =
			//<a>标签柔和动画
			"a {transition: color .2s ease, background-color .2s ease;}\n" +
			//AcFun助手-前台Popup按钮样式
			"#acfun-helper-div { font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif; box-shadow: 0px 0px 5px #949494; border-radius: 5px 0px 0px 5px; right: -10px !important; transition: all .2s ease; }" +
			"#acfun-helper-div:hover { transition: all .2s ease; right: 0px !important; }";
		str += this.pageBeautify.globalLiteAnimation();
		createElementStyle(str, document.head, "AcFunHelper_Frontend");
		this.ce.onLoad();
	}

	async loading() {
		this.runtime.options = await optionsLoad();
		this.options = this.runtime.options;
		this.dataset = this.runtime.dataset;
		this.dataset.core.browserType = ToolBox.thisBrowser();

		if (!this.options.enabled || !this.options.permission) {
			return
		}
		const XHRProxyLib = document.createElement("script");
		XHRProxyLib.src = chrome.runtime.getURL("common/xhr-proxy.js");
		(document.head || document.documentElement).appendChild(XHRProxyLib);
		XHRProxyLib.addEventListener("load", () => {
			if (this.options.filter) {
				const xhrDriver = document.createElement("script");
				xhrDriver.src = chrome.runtime.getURL("fg/acfunxhr.js");
				(document.head || document.documentElement).appendChild(xhrDriver);
				xhrDriver.addEventListener('load', () => {
					MessageSwitch.sendEventMsgToInject(window, { "target": "AcFunHelperFrontendXHRDriver", "InvkSetting": { "type": "function" }, "params": { params: {}, target: "start" } });
				});
			}
		});
		this.runtime.dataset.core.status.xhrProxy = true;
		//页面未加载完成式执行的方法 (提前注入的css/dom..)
		//this.unLoad()
		//页面的全部资源加载完后才会执行 包括 图片 视频等
		window.addEventListener("load", (e) => {
			this.onLoad(e);
			!this.options.krnl_videossEarly && this.onACPlayerLoaded(e);
		});
		//Dom 渲染完即可执行 此时图片视频还可能没加载完
		document.addEventListener("DOMContentLoaded", (e) => {
			this.onDomContentLoaded(e);
			this.options.krnl_videossEarly && this.onACPlayerLoaded(e);
		});
		//整个页面URL改变之后的方法
		// window.addEventListener("popstate", function(e){
		// 	this.onPagechanged();
		// });
	}

	onACPlayerLoaded(e) {
		if (REG.videoAndBangumi.test(this.href)) {
			let isLogined = false;
			var playerChecker = setInterval(() => {
				let elem = document.querySelector("#ACPlayer .control-bar-top .box-right")
				if (elem != null) {
					if (ToolBox.isLogin("video")) {
						isLogined = true;
					}
					//在视频播放页面监听播放器状态(是否全屏)，控制助手按钮是否显示
					//FIXME:页面onload执行前打开全屏，导致助手按钮首次显示不会被隐藏
					this.videoSetting.monitorFullScreen();
					//自定义倍速
					this.options.custom_rate && this.videoSetting.customPlaybackRate();
					//倍速切换的快捷键
					this.options.PlaybackRateKeysw && this.videoSetting.PlaybackRateKeyCode(this.options.custom_rate_keyCode)
					//AB回放
					this.options.ABPlaysw && this.videoSetting.addABPlayUI();
					//画中画
					this.options.PictureInPictureModeUI && this.videoSetting.callPicktureInPictureMode();
					//全局进度条
					this.options.ProgressBarsw && this.videoSetting.flexProgressBar(this.options.ProgressBarStyle);
					//画质策略
					this.videoSetting.videoQuality(isLogined);
					//自动点赞
					this.options.LikeHeart && this.banana.LikeHeartFront("video", isLogined);
					//弹幕操作栏状态
					this.options.hideDanmakuOperator.UI && this.videoSetting.hideDanmakuOperatorUI();
					this.videoSetting.hideDanmakuOperator(this.options.hideDanmakuOperator.defaultMode, this.options.hideDanmakuOperator.maskSw);
					//播放器帧步进
					this.options.frameStepSetting.enabled && this.videoSetting.frameStepFwdMain(this.options.frameStepSetting.controlUI)
					//后台自动暂停
					this.videoSetting.getSomeSleepFront(this.options.sleepPause.defaultMode, this.options.sleepPause.UI);
					clearInterval(playerChecker);
				}
			}, 1000);

			this.onPlayerUrlChange();
		}
		this.deferWorks();
	}

	onDomContentLoaded(e) {
		// console.log("options",this.options);
		//历史观看记录-本地获取
		// this.authInfo.historyView();
		let href = this.href;
		//添加自定义样式
		this.addStyle();
		this.options.Dev_thinScrollbar && this.pageBeautify.thinScrollBar();
		//屏蔽功能
		this.options.filter && this.block.injectScript();
		if (!REG.live.test(href) && !REG.liveIndex.test(href)) {
			//首页个人资料弹框 (未完成)
			this.options.beautify_personal && getAsyncDom('#header .header-guide .guide-item', () => {
				this.pageBeautify.addMouseAnimation()
				this.pageBeautify.personBeautify();
			})
		}
		//首页
		if (REG.index.test(href)) {
			window.onload = () => {
				//开启右侧导航
				this.options.beautify_nav && this.pageBeautify.navBeautify();
			}
			//隐藏ad
			this.options.hideAd && this.pageBeautify.hideAds();
			//首页nav高斯模糊
			this.options.Dev_indexBlurSW && this.pageBeautify.indexBeautify(false);
			return
		}
		//分区首页
		if (REG.partIndex.test(href) || REG.articleDetail.test(href)) {
			//隐藏ad
			this.options.hideAd && this.pageBeautify.hideAds();
			//分区首页nav高斯模糊
			this.options.Dev_indexBlurSW && this.pageBeautify.indexBeautify(true);
			//快捷键翻页
			this.options.pageTransKeyBind && this.pageBeautify.pageTransKeyBind("depList");
			return
		}
		//视频
		if (REG.video.test(href)) {
			//播放器和弹幕功能
			this.options.autoOpenVideoDescsw && this.videoPageBeautify.openVideoDesc();
			this.options.autoJumpLastWatchSw && this.videoSetting.jumpLastWatchTime();
			//隐藏ad
			this.options.hideAd && this.pageBeautify.hideAds();
			this.options.playerRecommendHide && this.pageBeautify.simplifiyPlayerRecm();
			//历史排行榜成就
			this.options.videoAchievement && this.videoSetting.historocalAchieve();
			return
		}
		if (REG.liveIndex.test(href) && !REG.live.test(href)) {
			//直播ad屏蔽
			this.options.liveHideAd && this.livePageBeautify.LivehideAds(this.options.liveHideAdType, this.options.liveHideAdMute);
		}
		//直播
		if (REG.live.test(href)) {
			// this.options.liveCommentTimeTag && 
			this.livePageBeautify.onLoad();
			//直播站功能
			if (this.options.livePlayerEnhc) {
				let timer = setInterval(() => {
					let checknode = $('div.box-right');
					if (checknode.length > 0) {
						this.livePageBeautify.appendWidePlayer();
						this.livePageBeautify.simplifyDanmu();
						this.live.liveDanmakuPiPUi();
						if (this.options.LiveWatchTimeRec_popup) {
							this.live.watchTimeRecord();
						}
						clearInterval(timer);
					}
				}, 3000)
			}
			return
		}
		//个人中心首页
		if (REG.userHome.test(href)) {
			this.options.userCenterBeautify && this.pageBeautify.userCenterBeautify();
			this.options.widenUCVideoList && this.pageBeautify.widenUCVideoList();
			this.options.Dev_indexBlurSW && this.pageBeautify.indexBeautify(false, true);
			this.options.pageTransKeyBind && this.pageBeautify.pageTransKeyBind("uc");
			this.options.userPageTimeline && this.pageBeautify.userPageTimeline();
		}
	}

	async onLoad(e) {
		let href = this.href;
		this.authInfo.cookInfo();
		this.authInfo.uidInfo();
		//开启屏蔽功能
		this.options.filter && this.block.block();
		if (REG.video.test(href)) {
			if (!this.fetchPageInfo()) {
				return;
			}
			let isUp = adjustVideoUp();
			this.div.show(this.dataset.dougaInfo, this.options, 'video', isUp);
			this.options.commentPageEasyTrans && this.onCommentAreaLoaded();
			//自动投蕉
			this.banana.throwBanana({ "key": REG.acVid.exec(href)[2] });
		}
		//视频与番剧页面功能
		if (REG.videoAndBangumi.test(href)) {
			if (!this.fetchPageInfo()) {
				return;
			}
			//弹幕列表
			getAsyncDom('.list-title', () => {
				//弹幕列表搜索
				this.options.PlayerDamakuSearchSw && this.danmusearch.inject()
				//弹幕列表前往Acer个人主页
				this.options.danmuSearchListToUsersw && this.videoSetting.danmuSearchListToUser()
				this.options.wheelToChangeVolume && this.videoSetting.wheelToChangeVolume(true);
			})
			//分P列表扩展
			this.options.multiPartListSpread && this.pageBeautify.multiPartListSpread()
			//倍率扩大音量
			this.options.audioGain && this.videoSetting.audioNodeGain();
			//快捷键评论发送
			this.options.quickCommentSubmit && this.pageBeautify.quickCommentSubmit();
			//MediaSession
			this.options.videoMediaSession && this.videoSetting.videoMediaSession(this.dataset.dougaInfo);
			//简单CC字幕
			this.options.simpleCC && this.danmaku.simpleCC();
			return
		}
		//文章
		if (REG.article.test(href)) {
			let isUp = adjustArticleUp();
			this.div.show(this.dataset.dougaInfo, this.options, 'article', isUp);
			this.options.picDrag && this.reader.picDrag(this.options.picRotate);
			this.options.LikeHeart && this.banana.LikeHeartFront("article");
			this.options.uddPopUp && this.ce.uddPopUp(Number(this.options.uddPopUptype));
			this.options.articleReadMode && this.reader.lightReadMode();
			if (this.options.articleBanana) {
				setTimeout(() => {
					this.banana.articleBanana({ key: REG.acAid.exec(href)[2] })
				}, 1000);
			}
			this.options.commentPageEasyTrans && this.onCommentAreaLoaded();
			this.options.pageTransKeyBind && this.pageBeautify.pageTransKeyBind("depList");
			this.options.quickCommentSubmit && this.pageBeautify.quickCommentSubmit();
			return
		}
		//直播
		if (REG.live.test(href)) {
			$(".open-app-confirm").hide();
			this.div.show(this.dataset.dougaInfo, this.options, 'live', '');
			this.options.LiveUserFocus && this.livePageBeautify.followMe();
			this.options.liveMediaSession && this.live.liveMediaSession(href);
			//直播画中画模式
			this.runtime.dataset.core.browserType == "Chrome" && this.livePageBeautify.callPicktureInPictureModeForLive();
			this.options.quickCommentSubmit && this.pageBeautify.quickCommentSubmit("live");
			this.options.liveVolumeMild && this.videoSetting.liveVolumeMild();
			this.options.wheelToChangeVolume && this.videoSetting.wheelToChangeVolume(false);
			this.options.beautify_personal && GetAsyncDomUtil.getAsyncDomClassic('#header #nav #nav-parent .header-guide .guide-user p', () => {
				this.pageBeautify.addMouseAnimation()
				this.pageBeautify.personBeautify();
			})
			return
		}
		//直播首页
		if (REG.liveIndex.test(href) && !REG.live.test(href)) {
			this.pageBeautify.pageTransKeyBind("depList");
			//直播站主页数量标号
			this.options.liveIndexRankNum && this.livePageBeautify.listCountFront();
			//直播站首页用户屏蔽
			this.options.liveBansw && this.block.liveUserBlock();
			this.options.beautify_personal && GetAsyncDomUtil.getAsyncDomClassic('#header #nav #nav-parent .header-guide .guide-user p', () => {
				this.pageBeautify.addMouseAnimation()
				this.pageBeautify.personBeautify();
			})
			return
		}
		if (REG.userCenter.index.test(href)) {
			this.options.userBatchManage && this.pageBeautify.userBatchManage();
			this.options.pageTransKeyBind && this.pageBeautify.pageTransKeyBind("myFav");
		}
	}

	onCommentAreaLoaded(e) {
		getAsyncDom(".ac-pc-comment", () => {
			this.options.commentPageEasyTrans && this.pageBeautify.commentPageEasyTrans();
			this.options.pageTransKeyBind && this.pageBeautify.pageTransKeyBind("depList");
		}, 3000)
	}

	/**
	 * 播放器地址切换监听
	 * @description 换分P、点击推荐等等会让播放器地址会被切换。
	 * @todo 我觉得还是使用URL监听使用的开销少。
	 * @config childList：子节点的变动（指新增，删除或者更改）。
		attributes：属性的变动。
		characterData：节点内容或节点文本的变动。
		subtree：布尔值，表示是否将该观察器应用于该节点的所有后代节点。
		attributeOldValue ：布尔值，表示观察attributes变动时，是否需要记录变动前的属性值。
		characterDataOldValue：布尔值，表示观察characterData变动时，是否需要记录变动前的值。
		attributeFilter：数组，表示需要观察的特定属性（比如['class','src']）。
	 */
	onPlayerUrlChange() {
		//观察器的配置
		var config = { attributes: true, attributeOldValue: true };
		//观察对象
		var playerUrlChangeObserver = document.querySelector("video");
		//观察器
		var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
		//观察器回调
		var obsrvcall = (mutations) => {
			if (mutations[0].oldValue != null && REG.videoPlayerSrc.test(mutations[0].oldValue)) {
				// console.log(mutations)
				this.reattachFrontMods();
			}
		}
		//给观察器绑定回调
		var observer = new MutationObserver(obsrvcall);
		//开始观察
		observer.observe(playerUrlChangeObserver, config);
	}

	/**
	 * 刷新部分前台模块
	 * @description 用于在切换分P或者点击大家都在看、推荐视频之后的模块数据刷新。
	 */
	reattachFrontMods() {
		//切换了分P和投稿
		this.href = window.location.href;
		this.fetchPageInfo();
		let isLogined = false;
		if (ToolBox.isLogin("video")) {
			isLogined = true;
		}
		if (this.videoSetting.mediaSessionJudgeChangeVideo()) {
			//只切换了投稿
			this.videoSetting.mediaSessionReAttach();
			this.options.autoJumpLastWatchSw && this.videoSetting.jumpLastWatchTime();
			this.videoSetting.videoQuality(isLogined);
		}
		this.options.autoOpenVideoDescsw && this.videoPageBeautify.openVideoDesc();
		this.options.LikeHeart && this.banana.LikeHeartFront("video", isLogined);
		this.div.reloadIframe(this.options, this.runtime.dataset.dougaInfo, "video", adjustVideoUp());
	}

	fetchPageInfo() {
		var div = document.createElement('div');
		div.style.display = "none";
		let uuid = uuidBuild();
		div.id = uuid;
		document.body.appendChild(div);
		div.setAttribute('onclick', "document.getElementById('" + uuid + "').innerText=JSON.stringify(window.pageInfo)");
		div.click();
		this.dataset.dougaInfo = JSON.parse(document.getElementById(uuid).innerText);
		this.dataset.sessionuuid = uuid;
		document.body.removeChild(div);
		let currentVideoInfo = this.dataset.dougaInfo.currentVideoInfo;
		if (currentVideoInfo == undefined || currentVideoInfo == "" || currentVideoInfo == null) {
			return false;
		}
		return true;
	}

	deferWorks() {
		fgConsole("Frontend", "deferWorks", "Loaded.", 1, false);
		this.funcUrlParam.onLoad();
	}

	//抽奖
	async api_lottery(params) {
		let { number, follow } = params;
		let href = window.location.href;
		let reg = /ac(\d+)/;
		let acId = reg.exec(href)[1];
		console.log(await this.luckyTurntab.RollOut(acId, number, follow));
	}
	async api_lottery2nd(params) {
		let { number, follow } = params;
		let href = window.location.href;
		let reg = /ac(\d+)/;
		let acId = reg.exec(href)[1];
		console.log(await this.luckyTurntab.RollOutExp(acId, number, follow));
	}
	//下载封面
	api_downloadCover(params) {
		this.download.downloadCover(params);
	}
	//下载弹幕
	api_downloadDanmaku() {
		this.download.downloadDanmaku(this.dataset.dougaInfo);
	}
	api_playerTimeJumpUrlGenDiv() {
		const timeText = document.querySelector(".time-label").children[0].innerText;
		if (timeText) {
			const ResultUrl = FunctionalUrlParam.playerTimeJumpUrlGen(timeText);
			var aux = document.createElement("input");
			aux.setAttribute("value", ResultUrl);
			document.body.appendChild(aux);
			aux.select();
			document.execCommand("copy");
			document.body.removeChild(aux);
			MessageSwitch.sendMessage('fg', { target: "notice", params: { title: "播放器时间跳转链接", msg: "跳转到现在播放时间的链接已经复制到剪贴板了。", }, InvkSetting: { type: "function" } })
		}
	}
	api_assDanmaku() {
		this.danmaku.sanitizeJsonDanmakuToAss(this.dataset.dougaInfo);
	}
	api_notice(params) {
		MessageSwitch.sendMessage('fg', { target: "notice", params: params, InvkSetting: { type: "function" } })
	}
	//视频下载
	async api_download(params) {
		this.download.downloadVideo(params);
	}
	api_mark(params) {
		let { value } = params;
		this.options.mark = value;
		optionsSave(this.options);
		if (value) {
			this.ce.renderMark();
		} else {
			this.ce.clearMark();
		}
	}
	api_timelineDotsMain(params) {
		let { massText, url } = params;
		this.options.timelineDots && this.videoSetting.timelineDotsMain(massText);
	}
	api_scan(params) {
		let { value } = params;
		this.options.scan = value;
		//保存配置信息到插件配置存储
		optionsSave(this.options);
		if (value) {
			this.ce.renderScan();
			this.ce.renderScanForUp();
		} else {
			this.ce.clearScan();
		}
	}
	api_lightReadMode(params) {
		let { value } = params;
		this.options.articleReadMode = value;
		if (value) {
			this.reader.lightReadMode(true);
		} else {
			this.reader.lightReadMode(false);
		}
	}
	//直播m3u8 url赋值到前台页面
	async api_renderLive(params) {
		if (REG.live.test(this.href)) {
			this.live.renderLive(params);
		}
	}
	//评论区折叠部分的标记渲染入口
	api_renderSub(params) {
		let { url, rootCommentId } = params;
		if (this.options.mark) {
			this.ce.renderSubMark(rootCommentId);
		}
		if (this.options.scan) {
			this.ce.renderSubScan(rootCommentId);
		}
		if (this.options.upHighlight) {
			this.ce.renderSubScanForUp(rootCommentId);
		}
		if (this.options.PlayerTimeCommentEasyJump) {
			//评论空降
			REG.videoAndBangumi.test(this.href) && this.ce.searchScanForPlayerTime();
		}
	}
	//评论区整体部分的标记渲染入口 ()
	api_renderList(params) {
		let { url } = params.url;
		if (this.options.mark) {
			this.ce.renderMark();
		}
		if (this.options.scan) {
			this.ce.renderScan();
		}
		if (this.options.upHighlight) {
			this.ce.renderScanForUp();
		}
		if (this.options.PlayerTimeCommentEasyJump) {
			REG.videoAndBangumi.test(this.href) && this.ce.searchScanForPlayerTime();
		}
		//跳转链接弹框
		this.options.uddPopUp && this.ce.uddPopUp(Number(this.options.uddPopUptype));
		if (REG.videoAndBangumi.test(this.href)) {
			//快捷键空降 TODO:全功能快捷键！
			if (this.options.easySearchScanForPlayerTimesw) {
				getAsyncDom('.ac-pc-comment', () => {
					this.ce.easySearchScanForPlayerTime(this.options.custom_easy_jump_keyCode)
				});
			}
		}
	}

}

window.AcFunHelperFrontend = new AcFunHelperFrontend();
