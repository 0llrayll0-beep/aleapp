<div align="center">

# AleApp

### Aplicação React Native + Expo para a Escola Fortec

<img src="https://img.shields.io/badge/React_Native-Framework-blue?style=for-the-badge&logo=react" />
<img src="https://img.shields.io/badge/Expo-Latest-black?style=for-the-badge&logo=expo" />
<img src="https://img.shields.io/badge/TypeScript-Enabled-blue?style=for-the-badge&logo=typescript" />
<img src="https://img.shields.io/badge/Status-Development-success?style=for-the-badge" />

---

projeto para a aula de desenvolvimento mobile

</div>

---

## Sobre o Projeto

projeto de escola protótipo

---

## Funcionalidades

* Autenticação de usuários
* Navegação entre telas
* Compatibilidade com Android e Web
* Estrutura modular para expansão futura
* Interface responsiva

---

## Tecnologias

| Tecnologia       | Finalidade                  |
| ---------------- | --------------------------- |
| React Native     | Desenvolvimento Mobile      |
| Expo             | Ambiente de desenvolvimento |
| TypeScript       | Tipagem estática            |
| Node.js          | Runtime JavaScript          |
| Express          | Backend                     |
| React Navigation | Navegação                   |

---

## Pré-requisitos

Antes de iniciar, certifique-se de possuir:

* Node.js 20 ou superior
* Git
* NPM

Verifique as versões instaladas:

```bash
node -v
npm -v
git --version
```

---

## Instalação

### Clonar o repositório

```bash
git clone https://github.com/0llrayll0-beep/aleapp.git
```

### Acessar a pasta do projeto

```bash
cd aleapp
```

### Instalar dependências

```bash
npm install
```

### Instalar dependências para execução Web

```bash
npx expo install react-dom react-native-web @expo/metro-runtime
```

---

## Execução

Inicie o ambiente de desenvolvimento:

```bash
npx expo start
```

### Atalhos disponíveis

| Tecla | Ação                  |
| ----- | --------------------- |
| a     | Executar no Android   |
| w     | Executar no navegador |
| r     | Recarregar aplicação  |
| m     | Abrir menu do Expo    |

---

### Estrutura do Projeto
aleapp/
│
├── app/
│   ├── pages/
│   │   ├── cars/
│   │   │   ├── id1.png
│   │   │   ├── id2.png
│   │   │   ├── ...
│   │   │   └── placeholder.png
│   │   │
│   │   ├── banco.json
│   │   ├── Cadastro.tsx
│   │   ├── direct.tsx
│   │   ├── login.tsx
│   │   ├── mainpage.tsx
│   │   └── Sobre.tsx
│   │
│   └── index.tsx
├── server.js

---

## Solução de Problemas

### Erro de dependências corrompidas

Caso apareçam erros semelhantes a:

```text
SyntaxError: Invalid or unexpected token
```

ou referências a arquivos dentro de:

```text
node_modules
```

Execute os comandos abaixo.

### Windows

```cmd
rmdir /s /q node_modules
del package-lock.json

npm cache clean --force
npm install
```

### Linux

```bash
rm -rf node_modules
rm package-lock.json

npm cache clean --force
npm install
```

---

## Verificação do Ambiente

Verifique dependências incompatíveis:

```bash
npx expo-doctor
```

Corrija automaticamente:

```bash
npx expo install --fix
```

---

## Build

### Android

```bash
npx expo run:android
```

### Web

```bash
npx expo start --web
```

---

## Contribuição

Criar uma nova branch:

```bash
git checkout -b feature/nova-funcionalidade
```

Registrar alterações:

```bash
git commit -m "Descrição da alteração"
```

Enviar para o repositório:

```bash
git push origin feature/nova-funcionalidade
```

Após isso, abra um Pull Request.

---

## Licença

Este projeto foi desenvolvido com os fins educacionais aprendido na aula.

---

<div align="center">

AleApp • React Native • Expo • TypeScript

</div>
