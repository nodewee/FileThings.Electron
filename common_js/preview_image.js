"use strict";

function Preview_Images(files) {
    //进度
    var thisHolder = $("#preview_images");
    thisHolder.addClass("progress-wait");
    sleep(100);

    var previewDiv = $("#preview_images");

    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        if (!file.type.match('image/jpeg.*')) {
            continue;
        }

        var reader = new FileReader();
        reader.onload = function (e) {
            var exif = piexif.load(e.target.result);
            var image = new Image();
            image.onload = function () {
                var orientation = exif["0th"][piexif.ImageIFD.Orientation];

                var canvas = document.createElement("canvas");
                canvas.width = image.width;
                canvas.height = image.height;
                var ctx = canvas.getContext("2d");
                var x = 0;
                var y = 0;
                ctx.save();
                if (orientation == 2) {
                    x = -canvas.width;
                    ctx.scale(-1, 1);
                } else if (orientation == 3) {
                    x = -canvas.width;
                    y = -canvas.height;
                    ctx.scale(-1, -1);
                } else if (orientation == 3) {
                    x = -canvas.width;
                    y = -canvas.height;
                    ctx.scale(-1, -1);
                } else if (orientation == 4) {
                    y = -canvas.height;
                    ctx.scale(1, -1);
                } else if (orientation == 5) {
                    canvas.width = image.height;
                    canvas.height = image.width;
                    ctx.translate(canvas.width, canvas.height / canvas.width);
                    ctx.rotate(Math.PI / 2);
                    y = -canvas.width;
                    ctx.scale(1, -1);
                } else if (orientation == 6) {
                    canvas.width = image.height;
                    canvas.height = image.width;
                    ctx.translate(canvas.width, canvas.height / canvas.width);
                    ctx.rotate(Math.PI / 2);
                } else if (orientation == 7) {
                    canvas.width = image.height;
                    canvas.height = image.width;
                    ctx.translate(canvas.width, canvas.height / canvas.width);
                    ctx.rotate(Math.PI / 2);
                    x = -canvas.height;
                    ctx.scale(-1, 1);
                } else if (orientation == 8) {
                    canvas.width = image.height;
                    canvas.height = image.width;
                    ctx.translate(canvas.width, canvas.height / canvas.width);
                    ctx.rotate(Math.PI / 2);
                    x = -canvas.height;
                    y = -canvas.width;
                    ctx.scale(-1, -1);
                }
                ctx.drawImage(image, x, y);
                ctx.restore();

                var dataURL = canvas.toDataURL("image/jpeg", 1.0);
                var jpegBinary = atob(dataURL.split(",")[1]);

                var div = $("<div></div>");
                div.append(canvas);
                previewDiv.prepend(div)
            };
            image.src = e.target.result;
        };

        reader.readAsDataURL(file);
    }

    //进度-隐藏
    thisHolder.removeClass("progress-wait");
}