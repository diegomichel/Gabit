$(function () {
    $('form[name=formTimerMinutes]').submit(function () {
        $("div#dialog-timer-minutes").parents('.ui-dialog').first().find('.ui-button').eq(1).click();
        return false;
    });
    $("div#dialog-timer").dialog({
        position: { my: "center top", at: "center top", of: $("#header") },
        autoOpen: false,
        width: 340,
        modal: true,
        buttons: {
            Cancel: function () {
                $(this).dialog("close");
                $("#tickSound")[0].pause();
                $("#alarmSound")[0].pause();
                $('#countdown').html();
            }
        },
        open: function (event, ui) {
            $("#tickSound")[0].play();
            $("div#dialog-timer").data("opened", true);
            $(this).append("<div id=countdown></div>");
                $('#countdown').timeTo(parseInt($("input#minutes").val()) * 60, {
                    theme: "white",
                    displayCaptions: true,
                    fontSize: 48,
                    captionSize: 14
                }, function () {
                    if($("div#dialog-timer").data("opened") == false) return; //BUG.uglyhack: This executes two times, i  guess is a bug on timeTo function...
                    $("#alarmSound")[0].play();
                    $("#tickSound")[0].pause();
                    alert("Time Out!"); //This instead of alerta because this one focuses the tab ;)
                    $("#alarmSound")[0].pause();
                    $("div#dialog-timer").dialog("close");
                    $('#countdown').remove();
                    $("div#dialog-timer").data("opened", false);
                });

        },
        close: function () {
            $(this).dialog("close");
            $('#countdown').remove();
        }
    });
    $("div#dialog-timer-minutes").dialog({
        position: { my: "center top", at: "center top", of: $("#header") },
        autoOpen: false,
        width: 'auto',
        height: 'auto',
        modal: true,
        buttons: {
            "Ok": function () {
                $(this).dialog("close");
                $("div#dialog-timer").dialog("open");
            },
            Cancel: function () {
                $(this).dialog("close");
            }
        },
        open: function (event, ui) {

        },
        close: function () {
            $(this).dialog("close");
        }
    })


    $("#timer").click(function () {
        $("div#dialog-timer-minutes").dialog("open");
    })
});