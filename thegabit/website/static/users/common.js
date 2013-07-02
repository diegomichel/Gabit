/**
 * Created with PyCharm.
 * User: diego
 * Date: 21/06/13
 * Time: 07:13 PM
 * To change this template use File | Settings | File Templates.
 */
function alerta(output_msg, title_msg) {
    if (!title_msg)
        title_msg = 'Alerta';

    if (!output_msg)
        output_msg = 'No Message to Display.';

    $("<div></div>").html("<center>" + output_msg + "</center>").dialog({
        title: title_msg,
        resizable: false,
        modal: true,
        show: {
            effect: "explode",
            duration: 1000
        },
        hide: {
            effect: "explode",
            duration: 1000
        },
        buttons: {
            "Ok": function () {
                $(this).dialog("close");
            }
        }
    });
}
function initDialogs() {
    $("#dialog-confirm-todo").dialog({
        autoOpen: false,
        resizable: false,
        width: 'auto',
        height: 'auto',
        modal: true,
        buttons: {
            "Accept": function () {
                Tasks.complete($(this).data("ui"));
                $(this).data("ui").remove();
                $(this).dialog("close");
            },
            Cancel: function () {
                $(this).dialog("close");
            }
        }
    });

    $("div#dialogAddTask").dialog({
        position: { my: "center top", at: "center top", of: $("#header") },
        autoOpen: false,
        minWidth: 320,
        modal: true,
        buttons: {
            "Add Task": function () {
                Tasks.addTask($(this).data('type'), $(this).data('habit_title'), $("#dialogAddTask form fieldset input#value").val());
                $('div#dialogAddTask').dialog('close');
                $("dt input").val("");
                return false;
            },
            Cancel: function () {
                $(this).dialog("close");
                $("dt input").val("");
            }
        },
        open: function (event, ui) {
            $("div#dialogAddTask dl dd ul li").html($(this).data('habit_title'));
            $("div#dialogAddTask form fieldset input#value").val("10");
            $("div#dialogAddTask form fieldset input#value").select();

            if (parseInt($(this).data('type')) == 4) {
                $("div#dialogAddTask form fieldset label").html("Cost");
            }
        },
        close: function () {
            $(this).dialog("close");
            $("div#dialogAddTask form fieldset label").html("Gain");
            $("dt input").val("");
        }
    });
    $('form[name=formDialogAddTask]').submit(function () {
        $("div#dialogAddTask").parents('.ui-dialog').first().find('.ui-button').eq(1).click();
        return false;
    });
}
function makeDarker(obj) {
    var tmpString = obj.css("background-color").substring(4, 17);
    var values = tmpString.split(",");
    var red = parseInt(parseInt(values[0]) * 1.20);
    var green = parseInt(parseInt(values[1]) * 1.20);
    var blue = parseInt(parseInt(values[2]) * 1.20);
    obj.css("background-color", "rgb(" + red + "," + green + "," + blue + ")");
}

function extraCreditsEffect(credits) {
    $("#xEffect").delay(666).fadeIn('slow').effect('pulsate', 'slow').fadeOut('slow');
    $("#textEffect").html("You won " + credits + " extra credits!");
    fx($("#textEffect"));
}

function fx(o) {
    var $o = $(o);
    $o.html($o.text().replace(/([\S])/g, '<span>$1</span>'));
    $o.css('position', 'relative');
    $('span', $o).stop().css({position: 'relative',
        opacity: 0,
        fontSize: 84,
        top: function (i) {
            return Math.floor(Math.random() * 500) * ((i % 2) ? 1 : -1);
        },
        left: function (i) {
            return Math.floor(Math.random() * 500) * ((i % 2) ? 1 : -1);
        }

    }).animate({opacity: 1, top: 0, left: 0}, 1000);

}