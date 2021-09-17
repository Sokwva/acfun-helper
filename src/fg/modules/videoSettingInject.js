//----------------播放器模式（观影、网页全屏、桌面全屏）--------------------
//通过这种方式和content_script（videoSetting.js）通信，接收videoSetting.js传过来的数据
let AcFunHelperVideoFunction = (function VideoFunction() {
  let testVideo = new RegExp(
    "((http(s)?:\\/\\/www.acfun.cn\\/v\\/ac\\d+)|(http(s)?:\\/\\/www.acfun.cn\\/bangumi\\/.*))"
  ).test(window.location.href);
  if (!testVideo) {
    return;
  }

  var options = null;
  var lastdropedFrame = 0;
  var nowDropFrame = 0;

  //=======MessageHub=======//
  window.addEventListener("message", (e) => {
    if (e.data.to == "AcFunHelper_vsInject") {
      MessageCommonInvoker(e);
    }
  })
  window.addEventListener("AcFunHelperFrontend", (e) => {
    AcFunHelperFrontendEventInvoker(e);
  })

  /**
   * 消息发送器
   * @param {string} modName videoSetting父模块接收函数/模块
   * @param {MessageSwitchWindowMsgPayload} msg 消息内容 {source:string,target:string,InvkSetting: {type:"function"},params:{}|[]}
   */
  function MessagePush(payload = {}) {
    window.parent.postMessage({
      to: "AcFunHelperFrontend",
      msg: payload,
    }, "*");
  }

  /**
   * 前端调用处理
   * @param {MessageSwitchInjectRecievePayload} e 
   */
  function AcFunHelperFrontendEventInvoker(e) {
    if (e.detail.InvkSetting.type === "function" && typeof (AcFunHelperVideoFunction[e.detail.target]) === 'function') {
      AcFunHelperVideoFunction[e.detail.target].call({}, e.detail.params);
    } else {
      console.log(e.detail);
    }
  }

  /**
   * 通用调用处理器
   * @param {MessageSwitchWindowMsgRespnse} e constraint:{ data: { to: "AcFunHelper_vsInject", msg: {source:string,target:string,InvkSetting: {type:"function"},params:{}|[]} } }
   */
  function MessageCommonInvoker(e) {
    if (e.data.msg.InvkSetting.type === "function" && typeof (AcFunHelperVideoFunction[e.data.msg.target]) === 'function') {
      let paramList;
      if (Array.isArray(e.data.msg.params) == false) {
        paramList = Object.values(e.data.msg.params)
      }
      AcFunHelperVideoFunction[e.data.msg.target].apply({}, paramList);
    } else {
      console.log(e.data.msg);
    }
  }

  function loadOptionData(e) {
    const { title, msg } = e;
    options = msg;
  }

  function playerFuncAutomate() {
    switch (options.player_mode) {
      case "default":
        break;
      case "film":
        let _timer = setInterval(function () {
          let _header = document.getElementById("header");
          let _main = document.getElementById("main");
          let _vd = document.querySelector(".video-description");
          let _toolbar = document.getElementById("toolbar");
          let _rc = document.querySelector(".right-column");
          //如果不判断直接调用会报错，toolbar节点可能还没加载
          if (_header && _main && _vd && _toolbar && _rc) {
            window.player.emit("filmModeChanged", true);
            clearInterval(_timer);
          }
        }, 1000);
        break;
      case "web":
        let _timer3 = setInterval(function () {
          let _header2 = document.getElementById("header");
          let _main2 = document.getElementById("main");
          let _vd2 = document.querySelector(".video-description");
          let _toolbar2 = document.getElementById("toolbar");
          let _rc2 = document.querySelector(".right-column");
          if (_header2 && _main2 && _vd2 && _toolbar2 && _rc2) {
            window.player.emit("fullScreenChange", "web");
            clearInterval(_timer3);
          }
        }, 1000);
        break;
      case "desktop":
        //Failed to execute 'requestFullscreen' on 'Element': API can only be initiated by a user gesture.
        //此功能只能由用户触发
        //window.player.emit('fullScreenChange','screen');
        //document.getElementsByClassName('container-player')[0].requestFullscreen();
        //window.player.requestFullscreen();
        //break;

        //换另外一种方法
        let _timer2 = setInterval(function () {
          const fullscreenBtn = document.querySelector(".fullscreen-screen>.btn-fullscreen");
          if (fullscreenBtn) {
            fullscreenBtn.click();
            clearTimeout(_timer2);
          }
        }, 300)
        break;
    }

    if (options.endedAutoExitFullscreensw) {
      //自动退出观影模式、网页全屏
      try {
        document
          .getElementsByTagName("video")[0]
          .addEventListener("ended", function () {
            let nowMode =
              document.querySelector("div.btn-film-model").children[0].dataset.bindAttr == "true" ||
              document.querySelector("div.btn-fullscreen").children[0].dataset.bindAttr == "web";
            let isMultiPart = document.querySelector("#main-content > div.right-column > div.part") != null;
            if (!window.player._loop && nowMode) {
              if (isMultiPart) {
                if (document.querySelector(".control-checkbox").dataset.bindAttr == "false") {
                  window.player.emit("filmModeChanged", false);
                  window.player.emit("fullScreenChange", false);
                  if (options.endedAutoToCommentArea) {
                    _thisTimer = setTimeout(e => {
                      document.querySelector("#to-comm").click();
                      clearTimeout(_thisTimer);
                    }, 435);
                  }
                }
              } else {
                window.player.emit("filmModeChanged", false);
                window.player.emit("fullScreenChange", false);
                if (options.endedAutoToCommentArea) {
                  _thisTimer = setTimeout(e => {
                    document.querySelector("#to-comm").click();
                    clearTimeout(_thisTimer);
                  }, 435);
                }
              }
            }
          });
      } catch (error) {
        console.log("[LOG]Frontend-videoSettingInject: May not in douga Page.");
      }
    }

    if (options.endedAutoJumpRecommandFirstDougasw) {
      //自动观看“大家都在看”栏目第一个稿件
      document.getElementsByTagName("video")[0].addEventListener("ended", function () {
        document.getElementsByClassName("recommendation")[0].children[0].children[0].click();
      });
    }

    if (options.frameStepSetting.enabled) {
      //快捷键绑定
      document.body.addEventListener('keydown', (e) => {
        if (e.shiftKey && e.key === "A") {
          MessagePush({ target: "frameStep", InvkSetting: { type: "function" }, params: "b" });
        } else if (e.shiftKey && e.key === "D") {
          MessagePush({ target: "frameStep", InvkSetting: { type: "function" }, params: "f" });
        }
      })
    }

    try {
      window.parent.postMessage({
        to: "videoInfo",
        msg: `${JSON.stringify(window.player.videoInfo)}`,
      }, "*");

      window.parent.postMessage({
        to: 'authinfo_mkey',
        msg: `${JSON.stringify(window.player.mkey)}`
      }, '*');

      window.parent.postMessage({
        to: "vs_videoInfo",
        msg: `${JSON.stringify(window.player.videoInfo.videoList)}`,
      }, "*");

    } catch (error) {
      console.log("[LOG]Frontend-videoSettingInject: Warning postMessage.", error);
    }

  }


  /**
   * 评论时间播放器快速跳转 - 处理函数
   * @param {string} time string eg:"00:01"or "00:00:10" 时间
   * @param {number} part int 视频的第几p
   */
  function quickJump(time, part) {
    let v_obj = document.getElementsByTagName("video")[0];
    let url = window.location.href;
    if ($(".part .part-wrap .scroll-div .single-p").length && part) {
      if (
        !(url.split("_")[1] == part || (url.search("_") == -1 && part == 1))
      ) {
        //判断是否为当前part，符合要求直接操作进度条
        url = url.split("_")[0] + "_" + part;
        $(".part .part-wrap .scroll-div .single-p")
          .eq(part - 1)
          .trigger("click");
      }
    }
    setTimeout(() => {
      v_obj.currentTime = Duration2Seconds(time);
      console.log("[LOG]Frontend-videoSettingInject: Jump_ok");
    }, 500);
  }

  /**
   * 丢帧增量
   * @description 获取当前时间之前的丢帧增加的数量
   */
  function dropFrameIncrementAlz() {
    document
      .getElementsByTagName("video")[0]
      .addEventListener("timeupdate", function (e) {
        lastdropedFrame = nowDropFrame;
        nowDropFrame = player.$video.getVideoPlaybackQuality()
          .droppedVideoFrames;
        dropFrameIncrement = nowDropFrame - lastdropedFrame;
        console.log(dropFrameIncrement)
      });
  }

  //=======Common Functions=========
  /**
   * 时间描述转换为秒数
   * @param {string} time string eg:"00:01"or "00:00:10" 时间
   * @returns int seconds
   */
  function Duration2Seconds(time) {
    let str = time;
    let arr = str.split(":");
    if (arr.length == 2) {
      let Tm = Number(arr[0]) * 60;
      let Ts = Number(arr[1]);
      let seconds = Tm + Ts;
      return seconds;
    } else if (arr.length == 3) {
      let Ts = Number(arr[2]);
      let Tm = Number(arr[1]) * 60;
      let Th = Number(arr[0]) * 60 * 60;
      let seconds = Th + Tm + Ts;
      return seconds;
    }
  }

  return {
    quickJump,
    dropFrameIncrementAlz,
    MessagePush, loadOptionData, playerFuncAutomate
  };
})();
let {
  quickJump,
  dropFrameIncrementAlz,
  MessagePush, loadOptionData, playerFuncAutomate
} = { ...AcFunHelperVideoFunction };
