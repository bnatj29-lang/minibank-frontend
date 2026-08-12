# minibank-frontend

Frontend do projeto minibank, feito em React (com Vite).

## Funcionalidade implementada nesta etapa
- Tela de cadastro, que consome `POST /usuarios/cadastro` no backend

---

## 1. Verificando se Node está instalado

```bash
node -v
npm -v
```
Deve mostrar as versões instaladas (Node 18+ recomendado). Se der erro de "comando não encontrado", é preciso instalar o Node.js.

## 2. Pré-requisitos
- Node.js 18+
- O backend (`minibank-backend`) rodando em `http://localhost:8080`

## 3. Como rodar
```bash
npm install
npm run dev
```
A aplicação sobe normalmente em `http://localhost:5173`

## 4. Estrutura de pastas
```
src/
├── pages/       telas completas (ex: CadastroPage.jsx)
├── components/  peças reutilizáveis de tela
├── services/    comunicação com a API (api.js, usuarioService.js)
├── App.jsx
└── main.jsx
```

---

## 5. Comandos Git — subindo este projeto pro GitHub

1. Crie um repositório vazio no GitHub chamado `minibank-frontend` (sem README, sem .gitignore, pra não dar conflito)
2. Dentro desta pasta, rode:

```bash
git init
git add .
git commit -m "Tela de cadastro consumindo a API"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/minibank-frontend.git
git push -u origin main
```

### Comandos do dia a dia, depois do primeiro push
```bash
git status                        # ver o que mudou
git add .                         # selecionar tudo que mudou
git commit -m "mensagem clara"    # registrar as mudanças
git push                          # enviar pro GitHub
git pull                          # trazer atualizações do GitHub
```

### Trabalhando em equipe com branches (recomendado para o time)
```bash
git checkout -b feature/tela-login    # cria e muda para uma nova branch
git push -u origin feature/tela-login # sobe essa branch pro GitHub
# depois, abrir um Pull Request no GitHub para revisar antes de juntar na main
```
