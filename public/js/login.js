$(document).ready(function(){
    $('#login').on('submit', function(e){
        console.log(e);
        $.ajax({
            type: "POST",
            url: `http://localhost:8080/auth/accesstoken`, 
            beforeSend: function(request) {
                request.setRequestHeader("username", email.value);
                request.setRequestHeader("password", senha.value);
            },
            success: function (response) {
                localStorage.setItem("token", response.token);
                window.location.replace("/dashboard");
                console.log(response);
            }, error: function(error) {
                console.log(error);
            }
        });

        e.preventDefault();
    });
});