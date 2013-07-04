$(function () {
    $("#buttonRegister").button().hide().click(function () {
        Register.loadForm();
         $("#buttonBack").fadeIn();
    })
     $("#buttonBack").button().hide().click(function () {
        location.reload();
    })
});
var Register = {
    loadForm: function () {
        $.ajax({
            type: "GET",
            url: "register/",
            data: {},
            error: function (request, status, error) {
                alert(request.responseText);
            }
        }).done(function (msg) {
                $("#header").hide();
                $("#buttonRegister").fadeOut();
                $("#buttonRegister").fadeOut();
                $("div#content").hide();
                $("div#content").css('text-align', 'center');
                $("div#content").html(msg);
                $("div#content").fadeIn();
                $("body").fadeIn();
                $("button#buttonLogin").button().click(function (event) {
                    event.preventDefault();
                    response = Login.request();
                })
                $("#buttonCreateAccount").button().click(function () {
                    event.preventDefault();
                    Register.request();
                });
            })
    },
    request: function () {
        var username = $("#id_username").val();
        var password = $("#id_password1").val();
        var password2 = $("#id_password2").val();
        var csrv = $("form#register input[name=csrfmiddlewaretoken]").val();

        $.ajax({
            type: "POST",
            url: "register/",
            data: {csrfmiddlewaretoken: csrv, username: username, password1: password, password2: password2 },
            error: function (request, status, error) {
                alert(request.responseText);
            }
        }).done(function (msg) {
                if(msg == "yes")
                    location.reload();
                $("#header").hide();
                $("#buttonRegister").fadeOut();
                $("#buttonRegister").fadeOut();
                $("div#content").hide();
                $("div#content").css('text-align', 'center');
                $("div#content").html(msg);
                $("div#content").fadeIn();
                $("body").fadeIn();
                $("#buttonCreateAccount").button().click(function () {
                    event.preventDefault();
                    Register.request();
                });
            })
    }
}