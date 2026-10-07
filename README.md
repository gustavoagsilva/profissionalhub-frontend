# ProfissionalHub — Frontend

Aplicação para organizar a rotina de profissionais de Educação Física autônomos. A etapa atual conecta o frontend à autenticação da API própria.

## Executar localmente

Validado com Node.js 24.15.0 e npm 11.12.1.

1. Na pasta `profissionalhub-frontend`, execute `npm ci`.
2. Copie `.env.example` para `.env`.
3. Configure `VITE_API_URL` com o endereço do backend. Por padrão, usamos `https://profissionalhub-backend.onrender.com`. Para um backend local, use `http://localhost:3000`.
4. Execute `npm run dev -- --port 5173` e abra o endereço informado. O backend precisa permitir essa origem em `ALLOWED_ORIGINS`.
5. Reinicie o Vite após alterar o `.env`.

O `.env` é ignorado pelo Git. As variáveis `VITE_` são públicas no frontend compilado: nunca coloque nelas a senha do MongoDB ou o segredo JWT. `VITE_GEOAPIFY_API_KEY` será usada quando a área de locais for conectada novamente; restrinja a chave por origem no fornecedor antes da publicação.

## Disponível nesta etapa

- Apresentação pública responsiva, sem acesso demonstrativo.
- Cadastro real, seguido de login automático.
- Login com validação, senha visível/oculta, carregamento e erros do servidor.
- JWT no `localStorage`, com perfil validado por `GET /users/me` ao abrir ou recarregar o aplicativo.
- Rotas protegidas: o acesso sem sessão abre o login e preserva o destino após autenticação.
- Logout com limpeza do token e do perfil.
- Sessão inválida removida; falha temporária de conexão mantém o token e oferece nova tentativa.
- Cadastro bem-sucedido seguido de falha no login encaminha para uma nova tentativa de entrada, sem solicitar outro cadastro.

A API gratuita pode levar cerca de um minuto para responder no primeiro acesso.

## Próximos blocos de integração

**Alunos, agenda e locais estão temporariamente indisponíveis na interface.** Os componentes existentes foram preservados para integração posterior, mas não há operações locais simulando persistência nem registros fictícios. O painel apresenta uma mensagem de disponibilidade, sem inventar contagens para dados ainda não carregados.

Pagamentos e reposições estão fora do escopo desta versão. Publicação do frontend e testes no domínio definitivo ainda estão pendentes.

## Rotas

| Rota      | Estado atual                       |
| --------- | ---------------------------------- |
| `/`       | Apresentação e autenticação        |
| `/painel` | Identificação da conta autenticada |
| `/alunos` | Protegida, aguardando integração   |
| `/agenda` | Protegida, aguardando integração   |
| `/locais` | Protegida, aguardando integração   |

O servidor de hospedagem do frontend deve redirecionar essas rotas para `index.html`. A autorização dos dados é responsabilidade do backend; o componente de proteção controla a navegação da interface.

## Organização

- `src/components/App/App.jsx`: solicitações de autenticação, sessão e navegação.
- `src/components/AuthModal`: formulário compartilhado de cadastro e login.
- `src/components/ProtectedRoute`: redirecionamento de visitantes sem sessão.
- `src/contexts/CurrentUserContext.js`: perfil retornado pela API.
- `src/utils/MainApi.js`: chamadas `fetch` para `/signup`, `/signin` e `/users/me`.
- `src/utils/formatters.js`: formatação de nomes, datas e valores, sem dados fictícios.
- `src/utils/ThirdPartyApi.js`: integração Geoapify preservada para o próximo bloco.

React, React Router 5, Vite, CSS com BEM, normalize.css e fonte Manrope local com `@font-face`.

## Verificação

- `npm run lint`: análise estática.
- `npm run build`: compilação de produção.
- `npm run format:check`: formatação.

Neste bloco, testes de navegador no Edge cobriram cadastro, login automático, credenciais inválidas, rota direta, recarregamento, expiração, indisponibilidade com nova tentativa, cadastro seguido de falha de login e saída. Os erros foram reproduzidos com respostas controladas. Cadastro, login, JWT, recarregamento e conta sem alunos também foram verificados com o backend Express e MongoDB locais, em banco isolado removido após o teste.

As larguras de 320, 390 e 1440 px foram verificadas no painel. Testes completos no frontend publicado ainda estão pendentes. Os scripts de validação ficam fora do repositório; não há comando `npm test` configurado.

## Créditos

Dados de locais: [Geoapify](https://www.geoapify.com/) e [OpenStreetMap contributors](https://www.openstreetmap.org/copyright). Desenvolvido por Gustavo Augusto.

Etapa atual: branch `stage-react-auth`. A entrega final será uma pull request para `main`.
