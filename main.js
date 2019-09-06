'use strict'


//                                                                                             
//         ,--.     ,----..                                                                    
//       ,--.'|    /   /   \       ,---,         ,---,.            .---.     ,---,.     ,---,. 
//   ,--,:  : |   /   .     :    .'  .' `\     ,'  .' |           /. ./|   ,'  .' |   ,'  .' | 
//,`--.'`|  ' :  .   /   ;.  \ ,---.'     \  ,---.'   |       .--'.  ' ; ,---.'   | ,---.'   | 
//|   :  :  | | .   ;   /  ` ; |   |  .`\  | |   |   .'      /__./ \ : | |   |   .' |   |   .' 
//:   |   \ | : ;   |  ; \ ; | :   : |  '  | :   :  |-,  .--'.  '   \' . :   :  |-, :   :  |-, 
//|   : '  '; | |   :  | ; | ' |   ' '  ;  : :   |  ;/| /___/ \ |    ' ' :   |  ;/| :   |  ;/| 
//'   ' ;.    ; .   |  ' ' ' : '   | ;  .  | |   :   .' ;   \  \;      : |   :   .' |   :   .' 
//|   | | \   | '   ;  \; /  | |   | :  |  ' |   |  |-,  \   ;  `      | |   |  |-, |   |  |-, 
//'   : |  ; .'  \   \  ',  /  '   : | /  ;  '   :  ;/|   .   \    .\  ; '   :  ;/| '   :  ;/| 
//|   | '`--'     ;   :    /   |   | '` ,/   |   |    \    \   \   ' \ | |   |    \ |   |    \ 
//'   : |          \   \ .'    ;   :  .'     |   :   .'     :   '  |--"  |   :   .' |   :   .' 
//;   |.'           `---`      |   ,.'       |   | ,'        \   \ ;     |   | ,'   |   | ,'   
//'---'                        '---'         `----'           '---"      `----'     `----'     
//                                                                                             



//引用electron的模块
const { app, BrowserWindow } = require('electron');
const { ipcMain } = require('electron');
const { dialog } = require('electron');
//
const { autoUpdater } = require("electron-updater");

const updateServer = 'https://filethings.net'
const updateFeed = `${updateServer}/download/${process.platform}`
//${app.getVersion()}
autoUpdater.setFeedURL(updateFeed)
// const fs = require('fs')
// const path = require('path')
// const url = require('url')

// autoUpdater.logger = log;
// autoUpdater.logger.transports.file.level = 'info';
// log.info('App starting...');


//-------------------------------------------------------------------
// Open a window that displays the version
//
//-------------------------------------------------------------------
let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 600, height: 500,
    minWidth: 180, minHeight: 30,
    resizable: true,
    frame: false,
    icon: '/icons/source.png',
    scrollBounce: true,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // mainWindow.openDevTools(); // 打开浏览器开发工具
  mainWindow.loadFile(`./home/index.html`); //首页

  mainWindow.on('closed', function () {
    mainWindow = null
  });


  //启动后，就检查程序是否有更新
  mainWindow.on('ready-to-show', function () {
    autoUpdater.checkForUpdates();
  });
  



  updateHandle();

} //end function




// mainWindow.alwaysOnTop = true

autoUpdater.checkForUpdates();



//-------------------------------------------------------------------
// app event
//-------------------------------------------------------------------
app.on('ready', function () {
  createWindow();
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})







//
ipcMain.on("version", () => {
  mainWindow.webContents.send('version', app.getVersion())
})




//-------------------------------------------------------------------
// 窗口关闭、最小化、最大化按钮的动作执行
//-------------------------------------------------------------------
ipcMain.on('window', (event, arg) => {
  switch (arg) {
    case "min":
      mainWindow.minimize();
      break;
    case "max":
      if (mainWindow.isMaximized()) {
        mainWindow.unmaximize()
      }
      else {
        mainWindow.maximize();
      }
      break;
    case "close":
      mainWindow.close();
      break;
  }
})




//-------------------------------------------------------------------
// Updater
//-------------------------------------------------------------------
// 检测更新，在你想要检查更新的时候执行，renderer事件触发后的操作自行编写
var silentUpdate = true; //默认静默，因为自动更新不需要提示用户。用户主动更新时，设置为 false
function updateHandle() {

  let message = {
    error: '检查更新出错',
    checking: '正在检查更新……',
    updateAva: '检测到新版本，正在下载……',
    updateNotAva: '已是最新版。',
  };
  const os = require('os');


  // autoUpdater.on('error', function (error) {
  //   if (!silentUpdate) {
  //     mainWindow.webContents.send('updateError', error.toString())
  //   }
  // });
  // autoUpdater.on('checking-for-update', function () {
  //   if (!silentUpdate) {
  //     mainWindow.webContents.send('updateMsg', message.checking)
  //   }
  // });
  autoUpdater.on('update-available', function (info) {
    // if (!silentUpdate) {
    //   mainWindow.webContents.send('updateMsg', message.updateAva)
    // }
      mainWindow.webContents.send('new-version', info.version)
      console.log("---"+info.version)
  });
  // autoUpdater.on('update-not-available', function (info) {
  //   if (!silentUpdate) {
  //     mainWindow.webContents.send('updateMsg', message.updateNotAva)
  //   }
  // });

  // // 更新下载进度事件
  // autoUpdater.on('download-progress', function (progressObj) {
  //   if (!silentUpdate) {
  //     mainWindow.webContents.send('updateDownloading', progressObj)
  //   }
  // })


  // autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) => {
  //   const dialogOpts = {
  //     type: 'info',
  //     buttons: ['重启应用', '稍后'],
  //     title: '应用更新',
  //     message: process.platform === 'win32' ? releaseNotes : releaseName,
  //     detail: '新版本已准备就绪。 重启应用以更新。'
  //   }

  //   dialog.showMessageBox(dialogOpts, (response) => {
  //     if (response === 0) autoUpdater.quitAndInstall();
  //   })
  // });


  // 监听 render 发来 check for update 消息
  ipcMain.on("checkUpdate", () => {
    //用户主动要求检查更新，
    silentUpdate = false; //则不静默，给出更新状态消息
    autoUpdater.checkForUpdates();
    // autoUpdater.checkForUpdatesAndNotify()
  })
  // 监听 render 发来 check for new 消息
  ipcMain.on("checkNew", () => {
    //用户主动要求检查是否有新版本
    silentUpdate = true; //则不静默，给出更新状态消息
    autoUpdater.checkForUpdates();
    // autoUpdater.checkForUpdatesAndNotify()
  })







  // // 监听 render 发来 progress 消息
  // ipcMain.on("progress", (event, arg) => {
  //   if (typeof (arg) != "number") {
  //     arg = -1
  //   }
  //   if (arg < 0) {
  //     arg = -1
  //   }
  //   if (arg > 1) {
  //     arg = 1
  //   }
  //   mainWindow.setProgressBar(arg);
  // })


  //
  //自动检查更新
  setInterval(() => {
    autoUpdater.checkForUpdates();
  }, 3000000) //5分钟一次


}
