'use strict';


class FileAction {
    //actionType: rename, delete, create
    constructor(actionType, src_path, dest_path) {
        this.actionType = actionType;
        this.src_path = src_path;
        this.dest_path = dest_path;
    }
}

class FileActionBatch {
    constructor(batch_id, batch_title) {
        this.batch_id = batch_id;
        this.batch_title = batch_title;
        this.action_list = [];
    }

    addAction(act){
        this.action_list.push(act);
    }
}

var fileBatch_Count = 0;
var history_FileBatch = [];



function check_undo() {
  // console.log(history_FileBatch);
  if (history_FileBatch.length > 0) {
    $("#btn_undo").text("撤销（" + history_FileBatch.length + "）");
    var title =
      "「" + history_FileBatch[history_FileBatch.length - 1].batch_title + "」";
    $("#undo .title").text(title);
    $("#undo").removeClass("hide");
    $("#undo").show("fast");
    // console.log("show undo");
  } else {
    $("#undo").hide("fast");
  }
}

$("#btn_undo").on("click", function (e) {
  if (history_FileBatch.length > 0) {
    var file_batch = history_FileBatch.pop(); //本批次历史的提取和删除
    //恢复
    while (file_batch.action_list.length > 0) {
      var file_act = file_batch.action_list.pop();
      //actionType: rename, delete, create
      //目前只能恢复重命名（包括移动）的操作
      if (file_act.actionType == "rename") {
        //反向移动文件
        fs.renameSync(file_act.dest_path, file_act.src_path);
      }
    }

    //清空历史（目前限制只能恢复一次）
    // history_FileBatch=[];

    //消息通知
    showTip("撤销", "已撤销「" + file_batch.batch_title + "」操作");
  }

  check_undo();
});

