const express = require('express');
const produtosService = require('../services/produtosService');
const departamentosService = require('../services/departamentosService');
const bodyParser = require('body-parser');

const router = express.Router();
const jsonParser = bodyParser.json();

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
router.get('/notificacao', (req, res) => {
  res.render('pages/notificacao');
});

// => Página de importação
router.get('/perfil', (req, res) => {
  res.render('pages/perfil');
});

// ============================================================================================================================

module.exports = router;