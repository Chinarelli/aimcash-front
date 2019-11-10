const pg = require('../helpers/database');

findAll = () => {
    return new Promise((resolve, reject) => {
        pg.query(`SELECT t.ite_descricaocompleta AS input, d.dpt_nome AS output FROM tabitens t, departamentos d WHERE t.ite_cod_dpto = d.dpt_codigo AND t.ite_descricaocompleta IS NOT NULL AND d.dpt_nome IS NOT NULL AND t.ite_cod_dpto IS NOT NULL AND d.dpt_codigo IS NOT NULL ORDER BY ite_descricaocompleta`).then((response) => {
            resolve(response.rows);
        }).catch((error) => {
            console.log(error);
            
            reject(error);
        });
    });
}

count = () => {
    return new Promise((resolve, reject) => {
        pg.query(`SELECT count(*) FROM tabitens`).then((response) => {
            resolve(response.rows[0].count);
        }).catch((error) => {
            console.log(error);

            reject(error);
        });
    })
}

insert = (params) => {
    return new Promise((resolve, reject) => {
        pg.query(`INSERT INTO tabitens(ite_cod_interno, ite_descricao, ite_descricaocompleta, ite_cod_dpto) VALUES($1, $2, $3, $4)`, [params.codigo, params.descricao, params.descricaoCompleta, params.departamento]).then((response) => {
            resolve(response.rows);
        }).catch((error) => {
            console.log(error);

            reject(error);
        });
    })
}

module.exports = {
    insert: insert,
    findAll: findAll,
    count: count
}