'use strict';

// Electron 中引入jQuery的正确方式：记得要安装依赖
// ' npm install jquery --save '
window.$ = window.jQuery = require('jquery');


const fs = require("fs");
const path = require("path");
const is = require("is_js");
const { clipboard } = require('electron');


//主进程与渲染进程通信
const { ipcRenderer } = require('electron');
const { remote } = require('electron');
//
const { dialog } = require('electron').remote;



//
function getUrlParams(url) {

  // 从url(可选)或window对象获取查询字符串
  var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

  // 我们把参数保存在这里
  var obj = {};

  // 如果查询字符串存在
  if (queryString) {

    // 查询字符串不包含#后面的部分，因此去掉它
    queryString = queryString.split('#')[0];

    // 把查询字符串分割成各部分
    var arr = queryString.split('&');

    for (var i=0; i<arr.length; i++) {
      // 分离出key和value
      var a = arr[i].split('=');

      // 考虑到这样的参数：list[]=thing1&list[]=thing2
      var paramNum = undefined;
      var paramName = a[0].replace(/\[\d*\]/, function(v) {
        paramNum = v.slice(1,-1);
        return '';
      });

      // 设置参数值（如果为空则设置为true）
      var paramValue = typeof(a[1])==='undefined' ? true : a[1];

      // （可选）保持大小写一致
      paramName = paramName.toLowerCase();
      paramValue = paramValue.toLowerCase();

      // 如果参数名已经存在
      if (obj[paramName]) {
        // 将值转成数组（如果还是字符串）
        if (typeof obj[paramName] === 'string') {
          obj[paramName] = [obj[paramName]];
        }
        // 如果没有指定数组索引
        if (typeof paramNum === 'undefined') {
          // 将值放到数组的末尾
          obj[paramName].push(paramValue);
        }
        // 如果指定了数组索引
        else {
          // 将值放在索引位置
          obj[paramName][paramNum] = paramValue;
        }
      }
      // 如果参数名不存在则设置它
      else {
        obj[paramName] = paramValue;
      }
    }
  }

  return obj;
} 













// ===== Tip box =====

class uiTip {
  constructor() {
      var $tipbar = $("<div class='tip'></div>");
      $(".tips").append($tipbar);
      this.bar = $tipbar;
  }

  show(info) {
      this.bar.text(info);
      // console.log(info);
      this.bar.slideDown(); //弹出
      this.bar.fadeOut(200).fadeIn(200).fadeOut(200).fadeIn(200); //闪烁

      // 延时消失
      this.bar.delay(6000).slideUp();
      var bar = $(this.bar);
      function delbar() {
          bar.remove();
      }
      setTimeout(delbar, 10000);
  }

}


function showTip(title, info) {
  var tipbar = new uiTip();
  if (title != "") {
      tipbar.show(title + "：" + info);
  }
  else {
      tipbar.show(info);
  }
tipbar = null;
}

//show sys notice
// let myNotification = new Notification(title, {
//     body: info
// });

// myNotification.onclick = () => {
//     console.log('通知被点击');
// };






function pause(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
//调用： await pause(1)







//
var cur_operate = getUrlParams() ? getUrlParams().which : ""; //default is ""
