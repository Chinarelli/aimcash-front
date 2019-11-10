$(document).ready(function(){
    $('#registrar').on('submit', function(e){
        console.log(e);
        $.ajax({
            type: "POST",
            url: `http://localhost:8080/usuarios`, 
            contentType: "application/json",
            data: JSON.stringify({
                nome: nome.value,
                sobrenome: sobrenome.value,
                email: email.value,
                senha: senha.value
            }),
            success: function (response) {
                window.location.replace("/");
                console.log(response);
            }, error: function(error) {
                console.log(error);
            }
        });

        e.preventDefault();
    });
});