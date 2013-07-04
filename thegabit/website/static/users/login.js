var Login = {
    request: function () {
        var username = $("#id_username").val();
        var password = $("#id_password").val();
        var csrv = $("input[name=csrfmiddlewaretoken]").val();
        $.ajax({
            type: "POST",
            url: "login",
            data: {csrfmiddlewaretoken: csrv, username: username, password: password },
            error: function (request, status, error) {
                alert(request.responseText);
            }
        }).done(function (msg) {
                try {
                    var user = $.parseJSON(msg);
                    loged = true; //Ugly hacks u say
                }
                catch (e) {
                    $("div#header").css('text-align', 'center');
                    $("div#content").css('text-align', 'center');
                    $("div#header").html("<h1 id=login>Ready to Game?</h1>");
                    $("div#content").html(msg);
                    $("body").fadeIn();
                    $("button#buttonLogin").button().click(function (event) {
                        event.preventDefault();
                        response = Login.request();
                    })
                }
                if(loged) location.reload(); //Yes man ugly hacks i say
            })
    }
}