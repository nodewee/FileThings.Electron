'use strict';



//这是模块是 disable 掉页面默认允许拖拽，避免内置浏览器打开用户拖拽的文件，原界面消失，造成的困扰。

//disable dom 元素被拖拽
$(window).on("dragstart drag dragend", function (e) {
    //屏蔽掉界面拖放
    e.stopPropagation();
    e.preventDefault();
});

//disable 拖放内容到窗口
$(window).on("dragenter dragover dragleave drop", function (e) { //必须包括所有事件。否则后续再绑定drop事件，发现无法触发
    //屏蔽掉界面拖放
    e.stopPropagation();
    e.preventDefault();
    // e.originalEvent.dataTransfer.effectAllowed = 'none'
    // e.originalEvent.dataTransfer.dropEffect = 'none'
})