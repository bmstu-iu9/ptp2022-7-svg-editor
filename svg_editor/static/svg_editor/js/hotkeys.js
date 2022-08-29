/**
 * @author Kabane-UN
 * @author AngelicHedgehog
 **/

// Hotkeys for editor page
$(document).ready(function (){
    // Svg save hotkey
    $(document).bind("keydown", function(event) {
        if (event.ctrlKey || event.metaKey) {
            switch (String.fromCharCode(event.which).toLowerCase()) {
                case 'x':
                    breakDrawing();
                    easel.save();
                    break;
            }
        }
    });
    /* перезват нажания сочитаний клавиш ctrl-z и ctrl-shift-z
    для передвиженя по истории рисования */
    $(document).bind('keypress', function (event) {
        if (event.which === 26 && event.ctrlKey) {
            if (event.shiftKey) {
                historyUndo();
            } else {
                historyBack();
            }
        }
    });

    // выход из режима рисования путём нажатия клавишы escape
    $(document).bind('keydown', function (event) {
        if (event.key === 'Escape') breakDrawing();
    });
})