prepararDados = () => {
    $.ajax({
        type: "PATCH",
		url: `/brain`, 
		success: function (response) {
            console.log(response);
		}, error: function(error) {
            console.log(error);
        }
	});
}

treinarRNA = () => {
    $.ajax({
        type: "POST",
		url: `/brain`, 
		success: function (response) {
            console.log(response);
		}, error: function(error) {
            console.log(error);
        }
	});
}

buscar = (produto) => {
    $.ajax({
        type: "GET",
		url: `/brain?produto=${produto}`, 
		success: function (response) {
            $('#resultado').val(Object.keys(response).reduce((a, b) => response[a] > response[b] ? a : b));
		}, error: function (error) {
            console.log(error);
        }
	});
}

$("#preparar").on('click', () => {
    toastr.info('Os dados estão sendo preparados');
    prepararDados();
});

$("#treinar").on('click', () => {
    toastr.info('Treinamento iniciado, isso pode demorar um pouco');
    treinarRNA();
});

$("#testar").on('click', () => {
    buscar($('#produto').val());
});
