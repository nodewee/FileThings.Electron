'use strict';





function getLocalTime(nS) {
  return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
}

// 自动前缀补0
function PrefillZero(num, length) {
  return (Array(length).join('0') + num).slice(-length);
}


function Time2SerialString(inDate) {
  return inDate.getFullYear().toString().slice(-2) + PrefillZero((inDate.getMonth() + 1), 2) + PrefillZero(inDate.getDate(), 2) + '-' + PrefillZero(inDate.getHours(), 2) + PrefillZero(inDate.getMinutes(), 2) + PrefillZero(inDate.getSeconds(), 2);// + '-' + PrefillZero(inDate.getMilliseconds(), 3);
}
function getCurTimeSerial() {
  var curDate = new Date();
  return Time2SerialString(curDate);
}


//
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds) {
      break;
    }
  }
}





// ---- String -----
function bytesSize_forHumanRead(size) {
  // console.log(size)
  if (size === 0) return '0 B';
  let k = 1024;
  let units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  let i = Math.floor(Math.log(size) / Math.log(k));
  return (size / Math.pow(k, i)).toPrecision(3) + ' ' + units[i];
}







//  ----- About File  -----  

function giveNoRepeatFilename(dirpath, filename) {
  var new_name = path.parse(filename).name;
  var file_ext = path.parse(filename).ext;
  var new_basename = filename;
  var count = 0;
  while (fs.existsSync(path.join(dirpath, new_basename))) {
    count += 1;
    new_basename = new_name + "(" + count.toString() + ")" + file_ext;
  }
  return new_basename;
}






//遍历获得所有文件和文件夹路径（包含子文件夹）
function get_AllContain_paths(parent_path) {
  if (!fs.existsSync(parent_path)) {
    //路径不存在，则结束遍历。
    return null;
  }

  //
  let all_paths = new Object();
  all_paths.file = []
  all_paths.folder = []

  //
  let path_stat = fs.statSync(parent_path);
  if (path_stat.isFile()) {
    all_paths.file.push(parent_path)
  }
  else if (path_stat.isDirectory()) {
    all_paths.folder.push(parent_path)

    let sub_file_list = fs.readdirSync(parent_path)

    sub_file_list.forEach(file_name => {
      let sub_path = path.join(parent_path, file_name);
      let result2 = get_AllContain_paths(sub_path)
      if (result2) {
        all_paths.file = all_paths.file.concat(result2.file)
        all_paths.folder = all_paths.folder.concat(result2.folder)
      }
    });
  }

  return all_paths
}




//获取所有文件路径（不含文件夹）
function get_AllDocPaths_inThesePaths(path_lists) {
  let all_doc_paths = [];

  for (let path_item of path_lists) {

    let result = get_AllContain_paths(path_item)
    if (result) {
      all_doc_paths = all_doc_paths.concat(result.file)
    }

  }

  return all_doc_paths
}







//获取文件夹下所有文件与目录信息（包含路径、路径层数、文件大小等）
function get_AllFileAndDirInfo_inThisFolder(folder_path) {
  let walk_result = new Object();
  walk_result.files = []; //文件列表
  walk_result.folders = []; //文件夹列表
  walk_result.max_level = 0; //路径最大层级
  walkFile(folder_path, walk_result);
  return walk_result;
}
//遍历读取文件
function walkFile(folder_path, walk_result) {
  // console.log("walk file:" + folder_path);
  let files = fs.readdirSync(folder_path); //需要用到同步读取
  files.forEach(walk);

  function walk(file) {
    // console.log(file);
    let file_path = path.join(folder_path, file);
    if (!fs.existsSync(file_path)) {
      //路径不存在，则退出本函数。（否则处理到 替身/快捷方式 时会出错
      return false;
    }

    // if (counts.progress % counts.progres_step == 0) {
    // setProgress(counts.progress / counts.progress_max * 100)
    // }
    //
    let states = fs.statSync(file_path);
    if (states.isDirectory()) {
      //创建一个对象保存信息
      let obj = new Object();
      obj.name = file; //文件名
      obj.dir = folder_path; //所在目录
      obj.path = file_path; //文件完整路径
      obj.level = file_path.split(path.sep).length;
      if (obj.level > walk_result.max_level) {
        //最大路径层级
        walk_result.max_level = obj.level;
      }
      // //mac 下的包，其实是文件夹，但当作文件处理。（但是不知道如何判断是包，目前仅以已知的后缀名来识别改文件夹是包
      // let package_exts = [".app", ".qvlibrary", ".download"];
      // if (package_exts.indexOf(path.parse(file).ext) > -1) {
      //   //文件扩展名属于包文件夹扩展名
      //   //mac 的包文件夹 当作是文件
      //   walk_result.files.push(obj);
      // } else {
      walk_result.folders.push(obj);
      walkFile(file_path, walk_result);
      // }
    } else { //file
      //创建一个对象保存信息
      let obj = new Object();
      obj.size = states.size; //文件大小，以字节为单位
      obj.blksize = states.blksize; //文件大小，以字节为单位
      obj.blocks = states.blocks;
      // console.log(obj)
      obj.name = file; //文件名
      obj.dir = folder_path; //所在目录
      obj.path = file_path; //文件完整路径
      obj.level = file_path.split(path.sep).length;
      if (obj.level > walk_result.max_level) {
        //最大路径层级
        walk_result.max_level = obj.level;
      }
      walk_result.files.push(obj);
    }
  }
}


















// ===== Window buttons =====
if (is.windows()) {
  $("#window_buttons_on_right").removeClass("hide");
  $("#top_back_bar_on_left").removeClass("hide");
}
else {
  $("#window_buttons_on_left").removeClass("hide");
  $("#top_back_bar_on_right").removeClass("hide");
}



$('.window_min').on('click', function (e) {
  ipcRenderer.send("window", "min")
});
$('.window_max').on('click', function (e) {
  ipcRenderer.send("window", "max")
});
$('.window_close').on('click', function (e) {
  ipcRenderer.send("window", "close")
});











//-------------------------------------------------------------------
// clear ipc linsteners
//-------------------------------------------------------------------
window.onbeforeunload = function (event) {
  ipcRenderer.removeAllListeners(); //为避免多次切换页面造成监听的滥用，切换页面前移除监听事件
}






//-------------------------------------------------------------------
// Progress Bar
//-------------------------------------------------------------------
async function setProgress(percent) {
  let elm_progress_box = $("#progress_box")
  let elm_progressbar = $("#progress_bar")

  percent = Math.round(percent, 0);
  console.log(percent + '%')

  ipcRenderer.send("progress", percent / 100);

  if (percent >= 0) {
    if (percent < 100) {
      // elm_progressbar.width(elm_progress_box.width() * percent / 100);
      elm_progressbar.width(elm_progress_box.width() * percent / 100 + "%")
    }
    else {
      // elm_progressbar.width(elm_progress_box.width());
      elm_progressbar.width("100%")
    }

    if (!elm_progress_box.is(":visible")) {
      elm_progress_box.removeClass("hide");
      elm_progress_box.fadeIn("fast");
      await pause(200)
    }

  }
  else { //percent<0
    elm_progress_box.fadeOut("fast", function () {
      elm_progressbar.width('0%')
    });
  }

  // console.log(percent)

  await pause(1)
}

function resetProgress() {
  setProgress(-1)
}











//-------------------------------------------------------------------
// Tooltip
//--------------------
// How to Use:
//  tag add attribution: data-toggle="tooltip" 
//-------------------------------------------------------------------
function activeTooltip() {
  $('[data-toggle="tooltip"]').tooltip()
}
//
$(document).ready(function () {
  activeTooltip();
})
