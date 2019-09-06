
class progressBar {
    constructor() {
        var $bar = $("<div class='progress'><div class='progress-bar'></div></div>");
        $("body").append($bar);
        this.element = $bar[0];
    }

    setRect(x,y,w,h){
        this.element.style.left = x + "px";
        this.element.style.top = y + "px";
        this.element.style.width = w + "px";
        this.element.style.height = h + "px";

        var progress = this.element.getElementsByClassName('progress-bar')[0];
        progress.style.height = h + "px";

        // console.log(x+','+y+','+w+','+h);
    }

    setPercent(percent){
        var progress = this.element.getElementsByClassName('progress-bar')[0];
        progress.style.width = Math.round(this.element.scrollWidth * percent) + "px";
        // console.log(progress);
        // console.log(progress.scrollWidth);
    }

    show() {
        $(this.element).show().delay(0).fadeIn();
        // this.element.style.visibility="visible";
    }
    hide() {
        $(this.element).hide().delay(1000).fadeOut();
        // this.element.style.visibility="hidden";
    }
    remove() {
        this.element.remove();
    }
  }



  var pbar = new progressBar();


