$(document).ready(function (){
    // Svg save hotkey
    $(document).bind("keydown", function(event) {
        if (event.ctrlKey || event.metaKey) {
            switch (String.fromCharCode(event.which).toLowerCase()) {
                case 'x':
                    easel.save();
            }
        }
    });
})