### Visão geral rápida

- Projeto dividido em duas partes principais: `backend/` (API Express + Supabase) e `frontend/` (React, SPA). O backend expõe endpoints REST simples (ex.: `/auth/*`, `/messages`, `/settings/:userId`) e usa o Supabase diretamente via `@supabase/supabase-js`.
- Comunicação frontend → backend: fetch simples para `https://canal-oficial-app.onrender.com/*` (ver `frontend/src/App.js` para exemplos de chamadas a `/messages` e `/settings`).

### Arquitetura e responsabilidades

- `backend/`: Entrypoint `src/server.js` — servidor Express com rotas inline e alguns handlers. Há também `src/controllers/authController.js` e `src/routes/authRoutes.js` (padrão controller/router).
- `backend/src/config/supabaseClient.js`: cliente Supabase central (observe que contém URL/chave hardcoded no repositório; em produção esperar variáveis de ambiente). Preferir usar `process.env` em novas alterações.
- `frontend/src`: SPA React. `App.js` contém a lógica de navegação entre telas (login, chat, home, settings, agreements) e demonstra os principais fluxos: envio de mensagens, carregamento de `settings`, geração de orçamentos.

### Pontos críticos para agentes/codificação automática

- Integrações: comportamento esperado do backend depende do esquema Supabase (tabelas `users`, `messages`, `business_settings`). Ao modificar endpoints, garanta compatibilidade com consultas feitas em `frontend/src/App.js`.
- Autenticação: `authController` usa `bcryptjs` e `jsonwebtoken`. Novas rotas devem seguir o padrão de gerar `token` via `JWT_SECRET` (lido de `process.env`).
- Persistência: muitos endpoints usam `supabase.from(...).select()/insert()/update()` diretamente. Mantenha tratamento de erro semelhante (ver `server.js` e controllers) — mensagens e códigos HTTP já definidos (ex.: 401, 400, 500).

### Convenções de código e padrões do projeto

- Frontend: componentes funcionais React com hooks; estado local para usuário e mensagens em `App.js`. Componentes reutilizáveis estão em `frontend/src/components/` (ex.: `CreateAcordoModal.jsx`, `HomeScreen.jsx`).
- Estilo: classes utilitárias (Tailwind-like) são usadas nos componentes; preserve classes CSS ao editar JSX.
- Nomes/IDs: IDs fictícios como `pro1`/`cli1` aparecem como usuários de demonstração — cuidado ao substituir por dados reais.

### Comandos úteis (backend)

- Instalar dependências e rodar em dev (nodemon):

  - `cd backend`
  - `npm install`
  - `npm run dev` (usa `nodemon src/server.js`)

- Produção: `npm start` (executa `node src/server.js`).

Observação: `supabaseClient.js` atualmente contém chave/URL — para deploy usar variáveis `SUPABASE_URL`, `SUPABASE_KEY` e `JWT_SECRET` no ambiente.

### Exemplos concretos (busca de mensagens / envio)

- Busca de mensagens (backend): `GET /messages/:contactId` → implementado em `backend/src/server.js` (ordena por `created_at`).
- Envio de mensagens (frontend): `fetch('https://canal-oficial-app.onrender.com/messages', { method: 'POST', body: JSON.stringify({ content, sender, contact_id }) })` (ver `frontend/src/App.js` function `sendMessage`).

### Ao modificar ou adicionar endpoints

- Atualize ambos locais: a rota no `backend` e os pontos de consumo no `frontend/src/App.js` (ou no componente que consome). Busque por ocorrências de URL base `https://canal-oficial-app.onrender.com` no frontend.
- Siga o padrão de erro atual: retornar JSON com `{ error: 'mensagem' }` e status HTTP apropriado.

### Segurança e segredos

- Remover chaves sensíveis do repositório (`backend/src/config/supabaseClient.js`) e usar `process.env` + `.env` local (não commitar `.env`).

### Arquivos importantes para referência rápida

- Backend: [backend/src/server.js](backend/src/server.js#L1-L120), [backend/src/controllers/authController.js](backend/src/controllers/authController.js#L1-L80), [backend/src/config/supabaseClient.js](backend/src/config/supabaseClient.js#L1-L40)
- Frontend: [frontend/src/App.js](frontend/src/App.js#L1-L80), [frontend/src/components/CreateAcordoModal.jsx](frontend/src/components/CreateAcordoModal.jsx#L1-L60), [frontend/src/components/HomeScreen.jsx](frontend/src/components/HomeScreen.jsx#L1-L40)

### O que pedir ao humano quando algo estiver incerto

- Se uma nova API mudar o shape de objetos (ex.: `messages`, `business_settings`), peça exemplos de linhas da tabela Supabase ou schema SQL.
- Pergunte sobre a estratégia de deploy para obter valores reais de `SUPABASE_URL/SUPABASE_KEY` e `JWT_SECRET`.

Se quiser, eu mesclo isso com algum arquivo existente ou adapta o tom/idioma. Deseja alterações específicas?
