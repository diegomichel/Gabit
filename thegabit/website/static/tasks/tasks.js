var Tasks = {
    load: function () {
        if (!loged) return;
        $.ajax({
            type: "GET",
            url: "gethabits",
            data: {}
        }).done(function (response) {
                $("div#content").append(response);
                $("#sortable").sortable({
                    update: function (event, ui) {
                        var newOrder = $(this).sortable('toArray').toString();
                        $.get('saveHabitsOrder/', {order: newOrder}, function (result) {
                        });
                    },
                    items: "dd:not(.wontMove)"
                });
                $("#sortable").disableSelection();
                Tasks.add();
            })
    },
    add: function () {
        $("#addNewHabit").click(function (event) {
            event.preventDefault();
            Tasks.addRequest();
        });
        $("dl.listHabit dt input").keypress(function (event) {
            if (event.which == 13) {
                event.preventDefault();
                Tasks.addRequest();
            }
        });
    },
    loadNew: function (data) {
        $("dl.listHabit dt").after(data);
        $("dl.listHabit dd:first").hide().fadeIn();
    },
    addRequest: function () {
        var habit_title = $("#habit_title").val();
        if (habit_title === "") {
            alerta("Please provide the title of the habit.");
        }
        else {
            $.get("addHabit/", {title: habit_title}, function (data) {
                Tasks.loadNew(data);
                $("dl.listHabit dt input").val("");
            })
        }
    }
}