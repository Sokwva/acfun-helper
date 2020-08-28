/* global odhback, localizeHtmlPage, utilAsync, optionsLoad, optionsSave updateVersionIcon*/
import {
  renderMomentCircleHtml,
  renderPushInnerHtml,
  renderLives
} from "./renderList.js";
import {
  openUpdateLog,
  openIntroduce,
  openSetting,
  watchLive,
  onOptionChanged,
  titleToHome,
  clickToTop,
  hideToTopButton,
  fetchDougaInfo
} from "./popupEvent.js";

import unKnownCode from "./unKnownCode.js";
unKnownCode(); //不明代码

function fetchPushContent() {
  chrome.storage.local.get(["AcpushList"], function (data) {
    console.log(data);
    $("#pop-push").append(data.AcpushList);
  });
}

async function onReady() {
  localizeHtmlPage(); //global function
  updateVersionIcon(); //更新提醒
  let options = await optionsLoad(); //global function
  //fetchPushContent();
  renderPushInnerHtml(); //稿件动态列表加载
  renderMomentCircleHtml(); //更多数据
  renderLives(); //生放送列表加载
  $("#extends-enbaled").prop("checked", options.enabled);
  $("#extends-enbaled").change(onOptionChanged);
  $("#pop-update-log").click(openUpdateLog);
  $("#pop-introduce").click(openIntroduce);
  $("#pop-setting").click(openSetting);
  $("#go-live").click(watchLive);
  $("#pop-title .letter").click(titleToHome);
  $(document).scroll(hideToTopButton);
  $(".toTop").click(clickToTop);
  $("#dougaInfoAcidbtn").click(fetchDougaInfo);
}

document.addEventListener("DOMContentLoaded", function (e) {
  //处理pop页面宽度
  let browser = myBrowser();
  if (browser == "FF") {
    document.getElementById("pop-push").style.width = "95%";
  }
});

$(document).ready(utilAsync(onReady));


//============Common Functions================//
// 将时间转为最近
function getTimeSinceNow(date) {
  let currentDate = new Date();
  let publishTime = new Date(date);
  let oneDay = 3600 * 24 * 1000;
  let oneWeek = oneDay * 7;
  let oneMinute = 60 * 1000;
  let oneHour = oneMinute * 60;
  let during = currentDate.getTime() - publishTime.getTime();
  if (during < oneMinute) {
    return Math.floor(during / 1000) + "秒前发布";
  } else if (during >= oneMinute && during < oneHour) {
    return Math.floor(during / oneMinute) + "分前发布";
  } else if (during > oneHour && during < oneDay) {
    return Math.floor(during / oneHour) + "小时前发布";
  } else if (during >= oneDay && during < oneWeek) {
    return Math.floor(during / oneDay) + "天前发布";
  } else if (during >= oneWeek) {
    return `发布于${publishTime.getFullYear()}-${
      publishTime.getMonth + 1
    }-${publishTime.getDate()}`;
  }
}

