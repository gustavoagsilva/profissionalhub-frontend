# ProfissionalHub — Frontend

Aplicação para organizar a rotina de profissionais de Educação Física autônomos. A etapa atual conecta o frontend à autenticação, aos alunos, à agenda e aos locais salvos na API própria, com busca e cálculo de deslocamento pela Geoapify.

## Acessar o projeto

- [Frontend publicado na Vercel](https://profissionalhub-frontend-one.vercel.app).
- [API publicada no Render](https://profissionalhub-backend.onrender.com).
- [Repositório do backend](https://github.com/gustavoagsilva/profissionalhub-backend).

Crie uma conta pelo site para utilizar alunos, agenda e locais salvos. Cada conta acessa seus próprios dados; não há conta demonstrativa. O endereço da API serve às requisições do aplicativo, não a uma interface visual.

## Publicação

O frontend é publicado na Vercel a partir da branch `stage-react-auth`, com preset Vite, diretório raiz `./`, instalação `npm ci`, compilação `npm run build` e saída `dist`. O arquivo `vercel.json` encaminha as rotas para `index.html`, permitindo abrir e atualizar páginas internas diretamente.

Variáveis na Vercel (tipo Config, ambientes Production e Preview):

| Variável | Valor |
| --- | --- |
| `VITE_API_URL` | `https://profissionalhub-backend.onrender.com` |
| `VITE_GEOAPIFY_API_KEY` | Chave do projeto Geoapify, configurada no painel e nunca incluída neste repositório |

Após alterar uma variável, faça uma nova implantação para recompilar o frontend. No Render, `ALLOWED_ORIGINS` precisa incluir `https://profissionalhub-frontend-one.vercel.app`; múltiplos endereços são separados por vírgula.

Na Geoapify, os filtros Allowed HTTP Origins permitem o endereço publicado e os endereços locais `http://localhost:5173`, `http://127.0.0.1:5173`, `http://localhost:5175` e `http://127.0.0.1:5175`. O campo CORS response origin permanece como `*`. Esses filtros verificam a origem informada; não tornam a chave privada nem impedem todos os usos fora de um navegador.

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

Frontend e backend publicados em HTTPS nos subdomínios dos provedores. A revisão local dos fluxos foi concluída em 10/10/2026 e as verificações de publicação estão descritas abaixo. Ainda falta concluir a conferência manual completa dos fluxos no ambiente publicado e enviar a pull request de `stage-react-auth` para `main`.

Não há domínio próprio registrado. O enunciado menciona domínio registrado do servidor; é necessário confirmar se os subdomínios dos provedores atendem a esse critério da entrega.

Pagamentos e reposições estão fora do escopo desta versão. Não há registros fictícios nem salvamentos temporários.

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
- `src/utils/formatters.js`: iniciais dos nomes exibidas nos avatares.
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

## Revisão local de 10/10/2026

Foram repetidos os testes integrados de alunos, agenda e locais com Express e MongoDB em banco isolado. Testes de navegador verificaram autenticação, falhas temporárias, sessão expirada, navegação direta e páginas em 320, 390, 768 e 1440 px. Esses testes locais não substituem a conferência dos fluxos no site publicado.

Correções da revisão: sincronização da sessão entre abas (a aba é recarregada ao trocar o token ou sair em outra aba), fechamento do menu móvel por Escape e destino do atalho de conteúdo na página 404. O formulário antigo EntryForm e funções de formatação sem uso foram removidos. Arquivos .env, dependências instaladas, builds e logs permanecem fora do Git.

## Verificações da publicação em 11/10/2026

- Página inicial e acesso direto a `/agenda`, `/alunos` e `/locais` responderam HTTP 200 após a configuração das rotas da Vercel.
- O preflight do backend confirmou a autorização da origem pública em CORS.
- Requisições à Geoapify com a chave da versão publicada retornaram HTTP 200 e resultados nas três categorias; o cálculo de deslocamento retornou distância e duração. A busca também foi conferida manualmente pelo responsável pelo projeto no navegador.
- Após configurar Allowed HTTP Origins, o domínio publicado e os quatro endereços locais foram aceitos; uma origem não autorizada retornou HTTP 401. Uma requisição sem Origin ainda foi aceita pelo fornecedor.

Conferência manual final pendente no ambiente publicado: cadastro, login, criação e edição de alunos, persistência após recarregar, agendamento e cancelamento, uso de local salvo na agenda, logout e navegação no celular. Os testes integrados locais dessas funcionalidades estão documentados na seção Verificação.

## Créditos

Dados de locais: [Geoapify](https://www.geoapify.com/) e [OpenStreetMap contributors](https://www.openstreetmap.org/copyright). Desenvolvido por Gustavo Augusto.

Etapa atual: branch `stage-react-auth`. A entrega final será uma pull request para `main`.
