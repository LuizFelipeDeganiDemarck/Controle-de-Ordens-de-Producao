# Sistema de Controle de Ordens de Producao

Aplicacao full stack desenvolvida como avaliacao tecnica para a vaga de Desenvolvedor Fullstack Junior.

O sistema permite cadastrar produtos, criar ordens de producao, registrar apontamentos de quantidades boas e refugadas, acompanhar o progresso de cada ordem e visualizar indicadores gerais no dashboard.

---

## Tecnologias utilizadas

**Backend**

- Node.js com Express
- Prisma ORM
- PostgreSQL
- dotenv para configuracao de ambiente

**Frontend**

- React com TypeScript
- Vite
- Tailwind CSS
- Axios
- React Router DOM

---

## Estrutura do projeto

```
backend/
  prisma/
    schema.prisma
  src/
    index.js
    routes.js
  .env.example

frontend/
  src/
    api/
      api.ts
    components/
      OrderForm.tsx
      ProductForm.tsx
      RecordForm.tsx
      StatusBadge.tsx
    pages/
      Dashboard.tsx
      OrderDetail.tsx
      Orders.tsx
      Products.tsx
    types/
      index.ts
    App.tsx
    main.tsx
```

---

## Pre-requisitos

- Node.js 18 ou superior
- PostgreSQL rodando localmente
- npm

---

## Como executar o projeto

### 1. Backend

Entre na pasta do backend e instale as dependencias:

```bash
cd backend
npm install
```

Crie o arquivo `.env` a partir do exemplo:

```bash
cp .env.example .env
```

Abra o arquivo `.env` e configure a variavel `DATABASE_URL` com as credenciais do seu banco:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/producao?schema=public"
PORT=3000
```

Execute as migrations para criar as tabelas no banco de dados:

```bash
npx prisma migrate dev --name init
```

Inicie o servidor:

```bash
npm run dev
```

O backend ficara disponivel em `http://localhost:3000`.

---

### 2. Frontend

Em outro terminal, entre na pasta do frontend e instale as dependencias:

```bash
cd frontend
npm install
npm run dev
```

A aplicacao ficara disponivel em `http://localhost:5173`.

---

## Endpoints da API

| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | /api/products | Lista todos os produtos |
| POST | /api/products | Cadastra um produto |
| GET | /api/orders | Lista ordens (com filtros opcionais) |
| POST | /api/orders | Cria uma ordem de producao |
| GET | /api/orders/:id | Detalha uma ordem com progresso e apontamentos |
| PATCH | /api/orders/:id/status | Altera o status da ordem |
| POST | /api/orders/:id/records | Registra um apontamento GOOD ou SCRAP |
| GET | /api/dashboard/production | Retorna resumo geral da producao |

---

## Regras de negocio implementadas

- SKU do produto deve ser unico.
- Numero da ordem deve ser unico.
- Quantidade planejada da ordem deve ser maior que zero.
- Quantidade informada em um apontamento deve ser maior que zero.
- Ordens finalizadas nao aceitam novos apontamentos.
- A quantidade GOOD acumulada nao pode ultrapassar a quantidade planejada da ordem.
- Status aceitos: OPEN, IN_PROGRESS e FINISHED.
- Ao registrar o primeiro apontamento de uma ordem OPEN, o sistema altera automaticamente o status para IN_PROGRESS.
- Ao registrar um apontamento GOOD que completa a quantidade planejada, o status e alterado automaticamente para FINISHED e a data de finalizacao e registrada.
- A alteracao manual de status via PATCH tambem registra a data de finalizacao quando o status e FINISHED.

---

## Decisoes tecnicas

- O backend foi escrito em JavaScript puro (sem TypeScript) por simplicidade, mas o Prisma ja fornece tipagem nos modelos. O frontend utiliza TypeScript com tipos proprios definidos em `src/types/index.ts`.
- A porta do servidor e configuravel via variavel de ambiente `PORT` no arquivo `.env`. O valor padrao e 3000.
- A listagem de ordens no frontend faz paginacao no lado do cliente com 15 itens por pagina. Em um ambiente de producao com grande volume de dados, o ideal seria implementar paginacao no backend.
- O dashboard busca os apontamentos em memoria para calcular os totais. Para volumes maiores, o uso de agregacoes no Prisma seria mais eficiente.
- A autenticacao nao foi implementada conforme orientacao do enunciado.

---

## Limitacoes conhecidas

- Sem autenticacao ou controle de acesso.
- Paginacao de ordens e feita no cliente, nao no servidor.
- Sem testes automatizados.
- Sem Docker Compose para subir o ambiente completo.
- A busca de ordens nao inclui filtro por nome do produto ou SKU, apenas por numero da ordem e status.

---

## Melhorias futuras

- Adicionar paginacao e ordenacao no backend com parametros de query.
- Filtro de ordens por nome do produto e SKU via query no banco de dados.
- Validacao de entrada com Zod no backend.
- Testes automatizados para as regras de negocio principais.
- Docker Compose para facilitar a execucao do ambiente.
- Dashboard com graficos de progresso por periodo.



## Fotos de Demonstração 

<img width="1440" height="900" alt="image" src="https://github.com/user-attachments/assets/3ed48268-f489-487f-83d1-efd996c1c445" />
<img width="1440" height="900" alt="image" src="https://github.com/user-attachments/assets/9c6c3972-9857-4f9a-a221-ae3788503711" />
<img width="1440" height="900" alt="image" src="https://github.com/user-attachments/assets/eb67099c-fdee-4bcc-bc77-1f6e7ed575a8" />
