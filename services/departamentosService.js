const pg = require('../helpers/database');

findAll = () => {
    return new Promise((resolve, reject) => {
        pg.query(`SELECT dpt_nome FROM departamentos WHERE dpt_nome IS NOT NULL AND dpt_codigo IS NOT NULL ORDER BY dpt_nome`).then((response) => {
            resolve(response.rows);
        }).catch((error) => {
            console.log(error);
            
            reject(error);
        });
    });
}

count = () => {
    return new Promise((resolve, reject) => {
        pg.query(`SELECT count(*) FROM departamentos`).then((response) => {
            resolve(response.rows[0].count);
        }).catch((error) => {
            console.log(error);

            reject(error);
        });
    })
}

insert = (params) => {
    return new Promise((resolve, reject) => {
        pg.query(`INSERT INTO departamentos(dpt_codigo, dpt_nome) VALUES((SELECT COALESCE(MAX(CAST(dpt_codigo AS int)) + 1, 1) FROM departamentos), $1) RETURNING dpt_codigo`, [params.nome]).then((response) => {
            console.log(response.rows);
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