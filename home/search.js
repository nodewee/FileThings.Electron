"use strict";


$('#search_input').on('input', function (e) {
    var search_text = $('#search_input').val();
    var can_search_elems = $("[searchTag]");

    if (search_text.trim() == "") {
        $(can_search_elems).show();
    }
    else {
        var search_words = search_text.split(" ");

        for (var elem of can_search_elems) {
            var searchTag = $(elem).attr("searchTag");
            var has_word = true;

            for (var word of search_words) {
                if (searchTag.search(word) <0) {
                    has_word = false;
                    break;
                }
            }
            if (has_word) {
                $(elem).show();
            }
            else {
                $(elem).hide();
            }

        }
    }
});


// $('#search_input').on('keydown', function (e) {
//     if ((e.metaKey || e.ctrlKey) && e.keyCode == 65) { 　 //ctrl+a or command+a
//         var search_input = $('#search_input');

//         if (search_input.val() == "") { //文本框内容为空时，忽略
//             return;
//         }

//         search_input.focus();
//         search_input.select();

//         clipboard.writeText(search_input.val());
//         var copied_text = clipboard.readText();

//         // console.log(copied_text);
//         search_input.val("");
//         search_input.trigger("input");
//         //
//         showTip("内容已存到剪贴板", copied_text)
//     }
// })