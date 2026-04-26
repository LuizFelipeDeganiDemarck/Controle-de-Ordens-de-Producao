
# 📦 Sistema de Controle de Ordens de Produção

Aplicação full stack desenvolvida como avaliação técnica para vaga de Desenvolvedor Fullstack Júnior.

O sistema permite cadastro de produtos, criação de ordens de produção, registro de apontamentos (GOOD e SCRAP) e visualização de indicadores de produção.

---

# 🚀 Tecnologias Utilizadas

## Backend

* Node.js
* Express
* PostgreSQL
* SQL (queries manuais)

## Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* Axios
* React Router DOM

---

# ⚙️ Funcionalidades

## 📦 Produtos

* Cadastro de produtos
* Listagem de produtos
* SKU único

## 📋 Ordens de Produção

* Criação de ordens
* Listagem de ordens
* Filtro por status, produto e número
* Alteração de status (OPEN, IN_PROGRESS, FINISHED)

## 🏭 Produção

* Registro de apontamentos:

  * GOOD (produção válida)
  * SCRAP (refugo)
* Histórico de apontamentos por ordem

## 📊 Dashboard

* Total de ordens
* Ordens abertas
* Ordens finalizadas
* Quantidade produzida (GOOD)
* Quantidade refugada (SCRAP)

---

# 📁 Estrutura do Projeto

```
backend/
 ├── src/
 │    ├── routes/
 │    ├── controllers/
 │    ├── db.js
 │    └── index.js

frontend/
 ├── src/
 │    ├── api/
 │    ├── components/
 │    ├── pages/
 │    ├── types/
 │    ├── App.tsx
 │    └── main.tsx
```

---

# 🔧 Como executar o projeto

## 📌 Pré-requisitos

* Node.js instalado
* PostgreSQL rodando
* NPM ou Yarn

---

## 🔙 Backend

```bash
cd backend
npm install
```

### Configurar banco de dados

Criar banco no PostgreSQL e configurar conexão no arquivo:

```
src/db.js
```

Exemplo:

```js
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "producao",
  password: "senha",
  port: 5432,
});
```

### Rodar backend

```bash
npm run dev
```

Servidor disponível em:

```
http://localhost:3000
```

---

## 🔜 Frontend

```bash
cd frontend
npm install
npm run dev
```

Aplicação disponível em:

```
http://localhost:5173
```

---

# 🔗 Endpoints da API

## Produtos

* GET `/api/products`
* POST `/api/products`

## Ordens

* GET `/api/orders`
* POST `/api/orders`
* GET `/api/orders/:id`
* PATCH `/api/orders/:id/status`

## Produção

* POST `/api/orders/:id/records`

## Dashboard

* GET `/api/dashboard/production`

---

# 📌 Regras de Negócio Implementadas

* SKU único para produtos
* Número da ordem único
* Quantidade planejada > 0
* Quantidade de apontamento > 0
* Ordem finalizada não aceita novos apontamentos
* Quantidade GOOD não ultrapassa a planejada
* Status: OPEN, IN_PROGRESS, FINISHED

---

# ⚠️ Limitações

* Não possui autenticação
* Não possui paginação
* Validações básicas
* Layout simples (foco funcional)

---

# 🚀 Melhorias Futuras

* Autenticação de usuários
* Paginação e ordenação
* Testes automatizados
* Melhorias de UI/UX
* Dashboard com gráficos
* Dockerização do projeto

---

# 🧠 Decisões Técnicas

* Uso de React com Vite para simplicidade e performance
* Separação de responsabilidades entre frontend e backend
* Uso de TypeScript no frontend para maior segurança
* API REST simples e clara

---

# 📷 Demonstração

(Opcional: adicionar prints da aplicação)

---

# ✅ Conclusão

A aplicação atende todos os requisitos mínimos propostos, com foco em organização, clareza de código e funcionamento completo do fluxo de produção.