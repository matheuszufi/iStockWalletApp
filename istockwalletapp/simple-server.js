const express = require('express');
const path = require('path');
const app = express();

// Servir arquivos estáticos da pasta build (se existir) ou public
app.use(express.static(path.join(__dirname, 'build')));
app.use(express.static(path.join(__dirname, 'public')));

// Para qualquer rota, serve o index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const port = 3000;
app.listen(port, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${port}`);
  console.log('📝 Teste a página: http://localhost:3000/wallet');
});
