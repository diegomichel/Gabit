var Tasks = {
    delete: function (id) {
        $.get("deleteTask/", {id: id}).fail(function () {
            location.reload();
        })
    },
    loadHelper: function (id) {
        $.ajax({
            type: "GET",
            url: "gettasks",
            data: { type: id}
        }).done(function (response) {
                $("div#content").append(response);

                $("dl").sortable({
                    activate: function (event, ui) {
                        $("div#trash").fadeIn();
                    },
                    deactivate: function (event, ui) {
                        $("div#trash").fadeOut();
                    },
                    update: function (event, ui) {
                        var newOrder = $(this).sortable('toArray').toString();
                        if (newOrder == "") return;

                        $.get('saveTasksOrder/', {order: newOrder},function (result) {
                        }).fail(function () {
                                location.reload();
                            });
                    },
                    items: "dd:not(.wontMove)"
                });
                $("dl#list" + id).disableSelection().hide().fadeIn();
                if (id == 1)
                    Tasks.loadHelper(2);
                if (id == 2)
                    Tasks.loadHelper(0);
                if (id == 0) {
                    Tasks.add();
                    return;
                }
            })
    },
    load: function () {
        if (!loged) return;
        Tasks.loadHelper(1);
    },
    /*
        This does not add on call, but add the handler for the events of the buttons that add new tasks.
     */
    add: function () {
        $("button.add").click(function (event) {
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
        $("#list" + type + " dt").after(data);
        $("#list" + type + " dd:first").hide().fadeIn();
    },
    addRequest: function (type) {
        var habit_title = $("#habit_title" + type).val();
        if (habit_title === "") {
            alerta("Write the title of the task");
        }
        else {
            $.get("addTask/",
                {
                    title: habit_title,
                    type: type
                },
                function (data) {
                    Tasks.loadNew(data, type);
                    $("dl.listHabit dt input").val("");
                }).fail(function () {
                    location.reload();
                })
        }
    }
}