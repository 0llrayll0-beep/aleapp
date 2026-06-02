// server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Caminho do banco.json
const BANCO_PATH = path.join(__dirname, 'pages', 'banco.json');

// Rota para ler usuários
app.get('/api/usuarios', (req, res) => {
  try {
    const dados = fs.readFileSync(BANCO_PATH, 'utf-8');
    res.json(JSON.parse(dados));
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao ler banco de dados' });
  }
});

// Rota para adicionar usuário (COM DELAY SIMULADO)
app.post('/api/usuarios', (req, res) => {
  const novoUsuario = req.body;
  
  // Simular delay de processamento (1.5 segundos)
  setTimeout(() => {
    try {
      // Ler banco atual
      const dados = fs.readFileSync(BANCO_PATH, 'utf-8');
      const banco = JSON.parse(dados);
      
      // Verificar se email já existe
      const emailExiste = banco.usuarios.some(u => u.email === novoUsuario.email);
      if (emailExiste) {
        return res.status(400).json({ 
          sucesso: false, 
          erro: 'Este e-mail já está cadastrado.' 
        });
      }
      
      // Adicionar novo usuário
      banco.usuarios.push(novoUsuario);
      
      // Salvar no arquivo
      fs.writeFileSync(BANCO_PATH, JSON.stringify(banco, null, 2), 'utf-8');
      
      console.log(' Usuário adicionado:', novoUsuario.email);
      console.log(' Total de usuários:', banco.usuarios.length);
      
      res.json({ 
        sucesso: true, 
        mensagem: 'Usuário cadastrado com sucesso!',
        usuario: novoUsuario,
        total: banco.usuarios.length
      });
      
    } catch (erro) {
      console.error('❌ Erro ao salvar:', erro);
      res.status(500).json({ 
        sucesso: false, 
        erro: 'Erro ao salvar no banco de dados.' 
      });
    }
  }, 1500); // 1.5 segundos de delay (simula processamento e rede lenta e profissionalismo kkkk)
});

app.listen(PORT, () => {
  console.log(` hehehe Servidor rodando em http://localhost:${PORT}`);
  console.log(` Banco de dados: ${BANCO_PATH}`);
});