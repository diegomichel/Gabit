/**
 * Created with PyCharm.
 * User: diego
 * Date: 26/06/13
 * Time: 05:42 AM
 * To change this template use File | Settings | File Templates.
 */
$(function () {
    $("#trash").droppable({
        tolerance: "pointer",
        accept: ".task",
        hoverClass: "buttonHover",
        drop: function (event, ui) {
            Tasks.delete(ui.draggable.get(0));
            ui.draggable.get(0).remove();
        }
    }).hide();

    $("#completed").droppable({
        tolerance: "pointer",
        accept: ".task",
        hoverClass: "buttonHover",
        drop: function (event, ui) {
            Tasks.complete(ui.draggable.get(0));
            $(ui.draggable.get(0)).addClass("taskDone");
            console.log();
            if(parseInt($(ui.draggable.get(0)).closest("dl").attr("id")[4]) == 1)
                makeDarker($(ui.draggable.get(0)));
        }
    }).hide();

    $("#reward").droppable({
        tolerance: "pointer",
        accept: ".task",
        hoverClass: "buttonHover",
        drop: function (event, ui) {
            Tasks.buyReward(ui.draggable.get(0));
            //ui.draggable.get(0).remove();
        }
    }).hide();

});