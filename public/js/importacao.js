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
		}, error: function(error) {
            console.log(error);
        }
	})
}

$("#confirmar").on('click', () => {
    $.getJSON("json/importacao.json", function(json) {
        for(i = 0; i < json.length; i++) {
            novoProduto({
                "codigo": json[i].codigo,
                "descricao": json[i].descricao,
                "descricaoCompleta": json[i].descricaoCompleta
            });
        }
    });
});