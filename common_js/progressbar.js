'use strict';

const { BrowserWindow } = require('electron')
const barwindow = new BrowserWindow()





function setProgress(percent){
    el_progress = $("#progressbar")
    if (percent<0){
        setProgress.hide();
    }
    barwindow.setProgressBar(percent)
    el_progress.css("width",(percent*100).toString() +"%")
    el_progress.show();
}

// class progressBar {
//     constructor(parent_elem) {
//         this.parent = parent_elem;
//         var $bar = $("<div class='progress'><div class='progress-bar'></div></div>");
//         $("body").append($bar);
//         this.bar = $bar[0];
//         this.progress = this.bar.getElementsByClassName('progress-bar')[0];
//         //
//         this.max=1;
//         this.val=0;
//     }

//     refreshRect(){
//         this.bar.style.left = this.parent.offsetLeft + "px";
//         this.bar.style.top = this.parent.offsetTop + "px";
//         this.bar.style.width = this.parent.scrollWidth + "px";
//         this.bar.style.height = this.parent.scrollHeight + "px";
//         this.progress.style.height = this.parent.scrollHeight + "px";
//         this.progress.style.width = Math.round(this.max/this.val * this.bar.scrollWidth) + "px";
//     }

//     show() {
//         this.refreshRect();
//         $(this.bar).show().delay(0).fadeIn();
//         // this.element.style.visibility="visible";
//     }
//     hide() {
//         this.refreshRect();
//         $(this.bar).delay(1000).hide().fadeOut();
//         // this.element.style.visibility="hidden";
//     }

//     remove() {
//         this.hide();
        
//         // $(this.bar).delay(3000).remove();
//         // window.setTimeout("delbar()", 3000);
//     }
// }





