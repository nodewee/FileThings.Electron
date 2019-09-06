
const { shell } = require('electron');

// get version
ipcRenderer.send("version");



//-------------------------------------------------------------------
// Update message
//-------------------------------------------------------------------
ipcRenderer.on("updateError", (event, text) => {
  showTip("更新发生错误", text)
  setProgress(-1)
});
ipcRenderer.on("updateMsg", (event, text) => {
  showTip("更新应用", text)
});
//注意：“downloadProgress”事件可能存在无法触发的问题，只需要限制一下下载网速就好了
ipcRenderer.on("updateDownloading", (event, progressObj) => {
  let downloadPercent = progressObj.percent || 0;
  setProgress(downloadPercent)
  // let log_message = "Download speed: " + progressObj.bytesPerSecond;
  // log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  // log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  // showTip("更新应用", log_message);
});
//
ipcRenderer.on("new-version", (event, text) => {
  $("#version_new").attr("title","有新版本 V"+text)
  $("#version_new").tooltip()
  $("#version_new").removeClass("hide")
});






//-------------------------------------------------------------------
// get app version
//-------------------------------------------------------------------
ipcRenderer.on("version", (event, text) => {
  $("#version").text(text);
});







// footer button
//-------------------------------------------------------------------

// $('#checkUpdate').on('click', function (e) {
//   ipcRenderer.send("checkUpdate");
// })
$('#checkUpdate').on('click', function (e) {
  shell.openExternal('https://filethings.net/#download')
})


$('#gosite').on('click', function (e) {
  shell.openExternal('https://filethings.net')
})


$('#qqgroup').on('click', function (e) {
  if (is.linux()) {
    clipboard.writeText('622192273', 'selection')
  }
  else {
    clipboard.writeText('622192273')
  }

  showTip("已复制到剪贴板",clipboard.readText())
})



$('#png2ico').on('click', function (e) {
  convert_png2ico();
  console.log("click")
})





// get version
ipcRenderer.send("checkNew");