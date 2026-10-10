# ProfissionalHub — Frontend

Aplicação para organizar a rotina de profissionais de Educação Física autônomos. A etapa atual conecta o frontend à autenticação, aos alunos, à agenda e aos locais salvos na API própria, com busca e cálculo de deslocamento pela Geoapify.

## Executar localmente

Validado com Node.js 24.15.0 e npm 11.12.1.

1. Na pasta `profissionalhub-frontend`, execute `npm ci`.
2. Copie `.env.example` para `.env`.
3. Configure `VITE_API_URL` com o endereço do backend. Por padrão, usamos `https://profissionalhub-backend.onrender.com`. Para um backend local, use `http://localhost:3000`.
4. Execute `npm run dev -- --port 5173` e abra o endereço informado. O backend precisa permitir essa origem em `ALLOWED_ORIGINS`.
5. Reinicie o Vite após alterar o `.env`.

O `.env` é ignorado pelo Git. As variáveis `VITE_` são públicas no frontend compilado: nunca coloque nelas a senha do MongoDB ou o segredo JWT. Configure `VITE_GEOAPIFY_API_KEY` para buscar locais e calcular deslocamentos. Restrinja a chave por origem no fornecedor antes da publicação. Sem a chave, a lista salva continua disponível e a busca informa a configuração ausente.

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

## Gestão de alunos

- Listagem exclusiva da conta autenticada, com carregamento, erro e nova tentativa.
- Cadastro com nome (2–60 caracteres) e WhatsApp brasileiro obrigatórios. E-mail e objetivo (até 120 caracteres) são opcionais.
- Prefixo +55 fixo e apresentação no formato +55 (11) 99999-9999. A validação confere formato de celular e DDD; não verifica se o número possui uma conta no WhatsApp.
- Edição de WhatsApp, e-mail e objetivo. O nome permanece somente para leitura e não é enviado no PATCH.
- Busca por nome/e-mail e filtros de ativos/inativos.
- Ativação e inativação confirmadas pela API. Telefones duplicados, inclusive de inativos, e aulas futuras impedindo a inativação são informados ao usuário.
- As alterações só aparecem na lista depois da resposta de sucesso do servidor. Erros no formulário preservam os dados digitados.
- Uma resposta 401 encerra a sessão e solicita novo login. Sair limpa os dados de alunos e cancela solicitações pendentes no navegador.

## Agenda e painel

- Agenda diária com consulta por data, navegação entre dias e botão Hoje no horário de Brasília.
- Cadastro de um atendimento por vez para um aluno ativo, com início, término e local.
- Local escolhido entre os salvos na API ou informado como endereço/descrição livre.
- Edição de aluno, data, horários e local de aulas agendadas, mantendo o horário futuro e o intervalo mínimo de 45 minutos. A API valida conflitos entre dias também.
- Não permite agendar no passado, término anterior/igual ao início ou aula atravessando a meia-noite.
- Registro manual de realização ou falta após o término. Esses dois resultados podem ser corrigidos entre si.
- Cancelamento de aulas agendadas com identificação de quem cancelou: profissional ou aluno. Aulas canceladas continuam no histórico e não podem ser reabertas.
- Painel com total de alunos ativos, atendimentos de hoje (exceto cancelados), horários e resultados reais.
- Carregamento, falha com nova tentativa, bloqueio de envio repetido e tratamento de sessão expirada.

## Explorar locais

- Busca de academias, parques e centros esportivos em um raio de 15 km do centro de São Paulo, com até 18 resultados exibidos de três em três.
- Seleção de dois resultados e cálculo estimado de distância e tempo de carro pela Geoapify. A estimativa não garante trânsito em tempo real nem altera automaticamente o intervalo da agenda.
- Salvamento real por conta via POST /locations; lista persistente via GET /locations e remoção via DELETE /locations/:id.
- A identificação da Geoapify (placeId) impede duplicações; o _id do MongoDB identifica a remoção e o local selecionado na agenda.
- Um local só aparece como salvo após confirmação da API. Carregamentos e erros da busca são independentes dos locais já salvos.
- Locais salvos ficam disponíveis no agendamento. Removê-los não altera o endereço dos atendimentos existentes; ao editar uma aula cujo local foi removido, o endereço é preservado como texto livre.
- Requisições de busca/trajeto são canceladas ao sair da página. Sair da conta cancela as alterações pendentes no navegador e limpa a lista.

## Pendências para entrega

Revisão completa dos fluxos, publicação do frontend e validação no domínio definitivo. Não há registros fictícios nem salvamentos temporários.

Pagamentos e reposições estão fora do escopo desta versão. Publicação do frontend e testes no domínio definitivo ainda estão pendentes.

## Rotas

| Rota      | Estado atual                        |
| --------- | ----------------------------------- |
| `/`       | Apresentação e autenticação         |
| `/painel` | Resumo real de alunos e agenda      |
| `/alunos` | Gestão de alunos integrada à API    |
| `/agenda` | Agendamento, edição e resultados    |
| `/locais` | Busca, deslocamento e locais salvos |

O servidor de hospedagem do frontend deve redirecionar essas rotas para `index.html`. A autorização dos dados é responsabilidade do backend; o componente de proteção controla a navegação da interface.

## Organização

- `src/components/App/App.jsx`: solicitações de autenticação, sessão e navegação.
- `src/components/AuthModal`: formulário compartilhado de cadastro e login.
- `src/components/Students`: listagem, busca, filtros e ações de alunos.
- `src/components/StudentForm`: cadastro e edição com validação.
- `src/components/Agenda` e `Dashboard`: agenda diária e resumo do dia.
- `src/components/SessionForm`: cadastro/edição de atendimentos.
- `src/components/SessionResult`: confirmação de resultado e de quem cancelou.
- `src/utils/sessionTime.js`: data atual e conversão de horários de Brasília.
- `src/utils/studentPhone.js`: validação e apresentação do celular brasileiro.
- `src/components/ProtectedRoute`: redirecionamento de visitantes sem sessão.
- `src/contexts/CurrentUserContext.js`: perfil retornado pela API.
- `src/utils/MainApi.js`: chamadas `fetch` de autenticação e operações de alunos e atendimentos, além da listagem, criação e remoção de locais salvos.
- `src/utils/formatters.js`: formatação de nomes, datas e valores, sem dados fictícios.
- `src/utils/ThirdPartyApi.js`: busca GET /v2/places e cálculo POST /v1/routematrix na Geoapify.

React, React Router 5, Vite, CSS com BEM, normalize.css e fonte Manrope local com `@font-face`.

## Verificação

- `npm run lint`: análise estática.
- `npm run build`: compilação de produção.
- `npm run format:check`: formatação.

Neste bloco, testes de navegador no Edge cobriram cadastro, login automático, credenciais inválidas, rota direta, recarregamento, expiração, indisponibilidade com nova tentativa, cadastro seguido de falha de login e saída. Os erros foram reproduzidos com respostas controladas. Cadastro, login, JWT, recarregamento e conta sem alunos também foram verificados com o backend Express e MongoDB locais, em banco isolado removido após o teste.

A integração de alunos foi verificada no navegador com Express e MongoDB locais: criação, edição, persistência após recarregar, nome bloqueado, duplicidade de telefone de aluno inativo, ativação/inativação, bloqueio por aula futura e isolamento entre contas. Falhas de listagem e sessão expirada foram simuladas para verificar as mensagens e a recuperação.

A agenda foi testada com Express e MongoDB locais em banco isolado: agendamento, conflitos (44 minutos recusados e 45 aceitos), edição, local salvo/livre, cancelamento, correção de resultado, persistência, painel, fuso de Brasília e isolamento de contas. Foram simuladas falhas de carregamento e sessão expirada.

Locais foram testados com Express e MongoDB locais: salvamento, persistência, duplicação, remoção, isolamento entre contas e preservação de endereço na agenda. Respostas controladas da Geoapify cobriram busca, paginação, rota, erro e nenhum resultado. A busca GET e o cálculo POST também passaram com a Geoapify real.

As larguras de 320, 390 e 1440 px foram verificadas no painel, na listagem de alunos, na agenda e em Explorar locais. Testes completos no frontend publicado ainda estão pendentes. Os scripts de validação ficam fora do repositório; não há comando `npm test` configurado.

## Créditos

Dados de locais: [Geoapify](https://www.geoapify.com/) e [OpenStreetMap contributors](https://www.openstreetmap.org/copyright). Desenvolvido por Gustavo Augusto.

Etapa atual: branch `stage-react-auth`. A entrega final será uma pull request para `main`.
