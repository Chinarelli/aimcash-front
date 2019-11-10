novoProduto = (params) => {
    $.ajax({
        type: "POST",
        url: `/produtos/${params.codigo}`, 
        data: {
            "descricao": params.descricao,
            "descricaoCompleta": params.descricaoCompleta
        },
		success: function (response) {
            toastr.info(`Produto ${params.descricao} incluido`);

            $('#codigo').val('');
            $('#descricao').val('');
            
            console.log(response);
		}, error: function(error) {
            console.log(error);
        }
	})
}

$("#confirmar").on('click', () => {
    novoProduto({
        "codigo": $('#codigo').val(),
        "descricao": $('#descricao').val(),
        "descricaoCompleta": $('#descricao').val()
    });
});