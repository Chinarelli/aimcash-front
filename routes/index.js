const express = require('express');
const produtosService = require('../services/produtosService');
const departamentosService = require('../services/departamentosService');
const normalizados = require('../../../worker/brain/data');
const resumo = require('../worker/brain/resumo')
const brain = require('../worker/brain/brain');
const ocr = require('../worker/ocr/index');
const bodyParser = require('body-parser');

const router = express.Router();
const jsonParser = bodyParser.json();

// ============================================================================================================================

// => Retorna todos os dados normalizados até o momento
router.get('/normalizado', jsonParser, (req, res) => {
  res.status(200);
  res.send(normalizados);
});

// => Retorna valores de resumo para exibição
router.get('/resumo', jsonParser, (req, res) => {
  produtosService.count().then((produtos) => {
    departamentosService.count().then((departamentos) => {
      res.status(200);
      res.send({
        "normalizados": normalizados.length,
        "produtos": produtos,
        "departamentos": departamentos,
        "erros": resumo.error
      });
    }).catch((error) => {
      console.log(error);

      res.status(500);
      res.send(error);
    });
  }).catch((error) => {
    console.log(error);

    res.status(500);
    res.send(error);
  });
});

// => Prepara os dados para treinamento da rede neural
router.patch('/brain', jsonParser, (req, res) => {
  brain.prepare().then((response) => {
    res.status(200);
    res.send(response);
  }).catch((error) => {
    console.log(error);

    res.status(500);
    res.send(error);
  });
});

// => Treina a rede neural com os dados preparados
router.post('/brain', jsonParser, (req, res) => {
  brain.train().then((response) => {
    res.status(200);
    res.send(response);
  }).catch((error) => {
    console.log(error);

    res.status(500);
    res.send(error);
  });
});

// => Realiza teste na rede neural
router.get('/brain', jsonParser, (req, res) => {
  if(req.query && req.query.produto) {
    res.status(200);
    res.send(brain.get(req.query.produto));
  } else {
    res.status(406);
    res.send(`Parâmetro "produto" obrigatório`);
  }
});

router.get('/ocr', jsonParser, (req, res) => {
  ocr.reconhecer().then((response) => {
    let lines = response.split('\n');
    let json = {
      valor: '',
      nome: '',
      descricao: ''
    }

    // let valor = '';
    // let nome = '';
    // let data = '';
    // let descricao = '';

    for(let i = 0; i < lines.length; i++) {
      if((lines[i].toLowerCase()).includes('valor:')) {
        json.valor = (lines[i].substring(lines[i].indexOf(`VALOR: `) + 7, lines[i].length)).trim();

        console.log(`Valor: ${(lines[i].substring(lines[i].indexOf(`VALOR: `) + 7, lines[i].length)).trim()}`);
      }

      if((lines[i].toLowerCase()).includes('recebilemos) de — ')) {
        json.nome = (lines[i].substring(lines[i].indexOf(`Recebilemos) de — `) + 17, lines[i].length)).trim();
        console.log(`Nome: ${(lines[i].substring(lines[i].indexOf(`Recebilemos) de — `) + 17, lines[i].length)).trim()}`);
      }

      if((lines[i].toLowerCase()).includes('referente a ')) {
        json.descricao = (lines[i].substring(lines[i].indexOf(`referente a `) + 12, lines[i].length)).trim();
        console.log(`Descrição: ${(lines[i].substring(lines[i].indexOf(`referente a `) + 12, lines[i].length)).trim()}`);
      }

      // if() {

      // }
    }
    // console.log(`Valor: ${response.substring(response.indexOf(`VALOR: `) + 7, response.indexOf(`\n`))}`);
    // console.log(`Nome: ${response.substring(response.indexOf(`Recebilemos) de —`) + 15, response.indexOf(`\n`))}`);
    // console.log(`Nome: `)
    // Recebilemos) de
    res.status(200);
    res.send(json);
  }).catch((error) => {
    console.log(error);

    res.status(500);
    res.send(error);
  });
});

// => Novo produto
router.post('/produtos/:codigo', jsonParser, (req, res) => {
  if(req.params && req.params.codigo) {
    let departamento = brain.get(req.body.descricaoCompleta);
    departamento = Object.keys(departamento).reduce((a, b) => departamento[a] > departamento[b] ? a : b)

    departamentosService.insert({nome: departamento}).then((departamentos) => {
      produtosService.insert({codigo: req.params.codigo, descricao: req.body.descricao, descricaoCompleta: req.body.descricaoCompleta, departamento: departamentos[0].dpt_codigo}).then((response) => {
        res.status(200);
        res.send(response);
      }).catch((error) => {
        console.log(error);

        res.status(500);
        res.send(error);
      });
    }).catch((error) => {
      console.log(error);

      res.status(500);
      res.send(error);
    });
  } else {
    res.status(406);
    res.send(`Parâmetro "produto" obrigatório`);
  }
});

// ============================================================================================================================

// => Index
router.get('/', (req, res) => {
  res.render('pages/login');
});

// => Registrar
router.get('/registrar', (req, res) => {
  res.render('pages/registrar');
});

// => Dashboard
router.get('/dashboard', (req, res) => {
  res.render('pages/dashboard');
});

// => Página principal de treinamento
router.get('/gerenciamento', (req, res) => {
  res.render('pages/gerenciamento');
});

// => Página de produtos
router.get('/notificacoes', (req, res) => {
  res.render('pages/produtos');
});

// => Página de importação
router.get('/perfil', (req, res) => {
  res.render('pages/importacao');
});

// ============================================================================================================================

module.exports = router;