(function() {
    $.ajax({
        type: "GET",
		url: `/resumo`, 
		success: function (response) {
            $('#normalizados').text(response.normalizados || 0);
            $('#produtos').text(response.produtos || 0);
            $('#departamentos').text(response.departamentos || 0);
            $('#erros').text(Math.round((response.erros || 0) * 100000) / 100000);
		}
	})
})();

(function() {
    $.ajax({
        type: "GET",
		url: `/normalizado`, 
		success: function (response) {
            response = response.slice(-5);

            for (let i = 0; i < response.length; i++){
                $('#ultimos-produtos').append(`
                    <tr>
                        <th scope="row">${response[i].input}</th>
                        <th scope="row">${Object.keys(response[i].output)}</th>
                    </tr>
                `);
            }
		}
	})
})();

(function() {
	$.ajax({
        type: "GET",
		url: `/normalizado`, 
		success: function (response) {
			var departamentos = [];

			for(var i = 0; i < response.length; i++) {
				var dpt = Object.keys(response[i].output);
				
				departamentos[dpt] == null ? departamentos[dpt] = 1 : departamentos[dpt] += 1;
			}

			var $chart = $('#chart-sales');

			var salesChart = new Chart($chart, {
				type: 'line',
				options: {
					scales: {
						yAxes: [{
							gridLines: {
							color: '#32325d',
							zeroLineColor: '#32325d'
							}
						}]
					},
					tooltips: {
						callbacks: {
							label: function(item, data) {
							var label = data.datasets[item.datasetIndex].label || '';
							var yLabel = item.yLabel;
							var content = '';

							if (data.datasets.length > 1) {
								content += `<span class="popover-body-label mr-auto">${label}</span>`;
							}

							content += `<span class="popover-body-value">${yLabel}</span>`;
								return content;
							}
						}
					}
				},
				data: {
					labels: Object.keys(departamentos),
					datasets: [{
						label: 'Performance',
						data: Object.values(departamentos)
					}]
				}
			});

			$chart.data('chart', salesChart);
		}
	})
})();