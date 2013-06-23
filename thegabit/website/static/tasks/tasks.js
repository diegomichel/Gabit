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
            var habit_title = $("#habit_title").val();
            if (habit_title === "") {
                alerta("Please provide the title of the habit.");
            }
            else {
                $.get("addHabit/",{title: habit_title}, function(data){
                    Tasks.reload(data);
                })
            }
        })
    },
    reload: function(data){
        var jsonObject = JSON.parse(data);
        var id = jsonObject[0].pk;
        var title = jsonObject[0].fields.title;
        var element = "<dd class='task' id='"+id+"'>\
        <ul>\
            <li class='taskHit'>\
                <button class='taskButton'>☒</button><button class='taskButton'>☑</button>\
            </li>\
            <li class='taskText'>"+title+"</li><li class='taskButtons'>\
                <button class='taskButton taskEditButton'>✎</button>\
            </li>\
        </ul>\
    </dd>";
        $("dl.listHabit dt").after(element);
    }
}