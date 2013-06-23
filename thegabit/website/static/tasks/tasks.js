var Tasks = {
    loadHelper: function (id) {
        $.ajax({
            type: "GET",
            url: "gettasks",
            data: { type: id}
        }).done(function (response) {
                $("div#content").append(response);

                $("dl").sortable({
                    update: function (event, ui) {
                        var newOrder = $(this).sortable('toArray').toString();
                        $.get('saveTasksOrder/', {order: newOrder}, function (result) {
                        });
                    },
                    items: "dd:not(.wontMove)"
                });
                $("dl").disableSelection();
                if (id == 1)
                    Tasks.loadHelper(0);
                if (id == 0)
                    Tasks.loadHelper(2);
                if (id == 2) {
                    Tasks.add();
                    return;
                }
            })
    },
    load: function () {
        if (!loged) return;
        Tasks.loadHelper(1);
    },
    add: function () {
        $("#addNewHabit").click(function (event) {
            event.preventDefault();
            var id = $(this).closest("dl").attr("id");
            Tasks.addRequest(id[4]);
        });
        $("dl.listHabit dt input").keypress(function (event) {
            if (event.which == 13) {
                event.preventDefault();
                var id = $(this).closest("dl").attr("id");
                Tasks.addRequest(id[4]);
            }
        });
    },
    loadNew: function (data, type) {
        $("#list"+type+" dt").after(data);
        $("#list"+type+" dd:first").hide().fadeIn();
    },
    addRequest: function (type) {
        var habit_title = $("#habit_title"+type).val();
        if (habit_title === "") {
            alerta("Please provide the title of the habit.");
        }
        else {
            $.get("addHabit/", {title: habit_title, type: type}, function (data) {
                Tasks.loadNew(data, type);
                $("dl.listHabit dt input").val("");
            })
        }
    }
}