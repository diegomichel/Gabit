var Tasks = {
    delete: function (id) {
        var parentId = $(id).closest("dl").attr("id");
        if (parentId[4] == 4) {
            $.get("deleteReward/", {id: id.id}).fail(function () {
                location.reload();
            })
        }
        else {
            $.get("deleteTask/", {id: id.id}).fail(function () {
                location.reload();
            })
        }
        $("body").effect('highlight', 'slow');
    },

    complete: function (id) {
        $.get("completeTask/",
            {id: id.id},
            function (data) {
                var values = $.parseJSON(data);
                originalCredits = parseInt($("#credits span").html());

                var numCompletedTimes = parseInt($("#"+id.id+" span#numCompletedTimes").html());
                $("#"+id.id+" span#numCompletedTimes").html(numCompletedTimes + 1);

                $("#credits span").html(values.credits);
                $("#hp span").html(values.hp);
                $("#credits").effect('bounce', {}, 500);
                $(id).effect('highlight', 'slow');
                $("#creditsEffect").html("+".concat(parseInt(values.credits) - originalCredits));
                $("#creditsEffect").fadeIn().effect('puff', {'percent': 400}, 1000);
                if (parseInt(values.extra_credits) > 0)
                    extraCreditsEffect(parseInt(values.extra_credits));
            }
        ).fail(function () {
                location.reload();
            })
    },
    buyReward: function (id) {
        var credits = parseInt($("#credits span").html());
        var cost = parseInt($("dd#" + id.id + " ul li span").html());
        if (cost > credits) {
            alerta("You dont have enougth credit's, try completing some habit's");
            return;
        }
        if (id.id == 1 && parseInt($("#hp span").html()) == 100) {
            alerta("You'r hp is full");
            return;
        }
        $.get("buyReward/",
            {id: id.id},
            function (data) {
                var values = $.parseJSON(data);
                $("#credits span").html(values.credits);
                $("#hp span").html(values.hp);
                $("#credits").effect('bounce', 'slow');
                $(id).effect('highlight', 'slow');
            }
        ).fail(function () {
                location.reload();
            })
    },
    loadRewards: function () {
        $.ajax({
            type: "GET",
            url: "getRewards",
            data: {}
        }).done(function (response) {
                $("div#content").append(response);

                $("dl#list4").sortable({
                    activate: function (event, ui) {
                        $("#trash").fadeIn();
                        $("#reward").fadeIn();
                        $(this).data('out', 0);
                        $(this).css("padding-bottom","2em");
                    },
                    deactivate: function (event, ui) {
                        $("#trash").fadeOut();
                        $("#reward").fadeOut();
                    },
                    update: function (event, ui) {
                        var newOrder = $(this).sortable('toArray').toString();
                        if (newOrder == "") return;


                        if ($(this).data('out') == 1) {
                            $("dl#list4").sortable("cancel");
                            return;
                        }

                        $.get('saveRewardsOrder/', {order: newOrder},function (result) {
                        }).fail(function () {
                                location.reload();
                            });
                    },
                    out: function (event, ui) {
                        //alert("element out of the list.");
                        $(this).data('out', 1);
                        $(this).css("padding-bottom","1em");
                    },
                    items: "dd:not(.wontMove)"
                });

                $("#habit_title" + 4).on("keyup", function () {
                    var text = $(this).val().toLowerCase();
                    $("dl#list" + 4 + " > dd").each(function () {
                        if ($(this).text().toLowerCase().indexOf(text) == -1)
                            $(this).hide();
                        else
                            $(this).show();
                    });
                });

                $("dl#list" + 4 + " dd").on("mouseup", function () {
                    $("#habit_title" + 4).val("");
                    $("dl#list" + 4 + " > dd").each(function () {
                        $(this).show();
                    });
                })

                $("dl#list4").disableSelection().hide().fadeIn();
                Tasks.add();
            })
    },
    loadHelper: function (id) {
        $.ajax({
            type: "GET",
            url: "gettasks",
            data: { type: id}
        }).done(function (response) {
                $("div#content").append(response);

                $("dl#list"+id).sortable({
                    activate: function (event, ui) {
                        $("#trash").fadeIn();
                        $("#completed").fadeIn();
                        $("dl#list"+id).data('out', 0);
                        $("dl#list"+id).css("padding-bottom","2em");
                    },
                    deactivate: function (event, ui) {
                        $("#trash").fadeOut();
                        $("#completed").fadeOut();
                    },
                    update: function (event, ui) {
                        var newOrder = $(this).sortable('toArray').toString();
                        if (newOrder == "") return;

                        if ($(this).data('out') == 1) {
                            $("dl#list"+id).sortable("cancel");
                            return;
                        }

                        $.get('saveTasksOrder/', {order: newOrder},function (result) {
                        }).fail(function () {
                                location.reload();
                            });
                    },
                    out: function (event, ui) {
                        //alert("element out of the list.");
                        $("dl#list"+id).data('out', 1);
                        $("dl#list"+id).css("padding-bottom","1em");
                    },
                    items: "dd"
                });


                $("#habit_title" + id).on("keyup", function () {
                    var text = $(this).val().toLowerCase();
                    $("dl#list" + id + " > dd").each(function () {
                        if ($(this).text().toLowerCase().indexOf(text) == -1)
                            $(this).hide();
                        else
                            $(this).show();
                    });
                });

                $("dl#list" + id + " dd").on("mouseup", function () {
                    $("#habit_title" + id).val("");
                    $("dl#list" + id + " > dd").each(function () {
                        $(this).show();
                    });
                })


                $("dl#list" + id).disableSelection().hide().fadeIn();
                if (id == 1)
                    Tasks.loadHelper(2);
                if (id == 2)
                    Tasks.loadHelper(0);
                if (id == 0) {
                    Tasks.loadRewards();
                    return;
                }
            })
    },
    load: function () {
        if (!loged) return;
        Tasks.loadHelper(1);
        $("body").fadeIn();
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
        $("dl.list_habit dt input, dl.list_reward dt input").keypress(function (event) {
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
    addTask: function (type, title, gain) {
        if (type == 4) {
            var url = "addReward/";
        }
        else {
            var url = "addTask/";
        }

        $.get(url,
            {
                title: title,
                type: type,
                gain: gain
            },
            function (data) {
                Tasks.loadNew(data, type);
                $("dl.listHabit dt input").val("");
            }).fail(function () {
                location.reload();
            })

    },
    addRequest: function (type) {
        var habit_title = $("#habit_title" + type).val();
        if (habit_title === "") {
            alerta("Please write something.");
        }
        else {
            $("div#dialogAddTask").data('type', type).data('habit_title', habit_title).dialog("open");
        }
    }
}