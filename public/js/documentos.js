$("#analisar").on('click', () => {
    console.log('Analisar');
    $.ajax({
        type: "GET",
        url: `/ocr`, 
		success: function (response) {
            // toastr.info(`Produto ${params.descricao} incluido`);
            $('#valor').val(response.valor);
            $('#nome').val(response.nome);
            $('#descricao').val(response.descricao);

            console.log(response);
		}, error: function(error) {
            console.log(error);
        }
	})
});

