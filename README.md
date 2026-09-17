# ProfissionalHub — Frontend

Aplicação para organizar a rotina de profissionais de Educação Física autônomos. Primeira versão visual e navegável, com operações temporárias de demonstração e integração real com Geoapify.

## Executar localmente

Validado com Node.js 24.15.0 e npm 11.12.1.

1. Abra um terminal na pasta `profissionalhub-frontend` e execute `npm ci`.
2. Copie `.env.example` para `.env` e preencha `VITE_GEOAPIFY_API_KEY`. Salve como UTF-8 sem BOM.
3. Execute `npm run dev` e abra o endereço informado pelo Vite. Reinicie o servidor se alterar o `.env`.

O arquivo `.env` é ignorado pelo Git. Variáveis com prefixo `VITE_` fazem parte do frontend compilado: a chave Geoapify precisa ter restrições de origem/domínio no painel do fornecedor antes da publicação. Sem a chave, a demonstração funciona e a busca informa a configuração ausente.

## O que já funciona

- Apresentação pública, informações sobre o autor e interface responsiva.
- Modais de cadastro e login com validação, mensagens, exibição de senha, fechamento por Escape e navegação por teclado.
- Entrada direta pelo botão “Explorar demonstração”.
- Painel simples com três contagens (alunos ativos, atendimentos de hoje e cobranças em aberto), lista do dia e botão de agendamento.
- Cadastro, edição, busca e ativação/inativação de alunos.
- Agenda diária com agendamento e bloqueio de sobreposição de horários.
- Registro de realização, falta e cancelamento; concessão manual de reposição.
- Reposição com estados a agendar, agendada e concluída. Cancelar a sessão de reposição reabre a pendência.
- Cobranças manuais e registro de pagamento integral.
- Geoapify: busca real de locais por categoria em um raio de 15 km do centro de São Paulo, até 18 resultados exibidos de três em três, seleção de dois locais e cálculo real de deslocamento de carro.
- Salvamento temporário de locais para utilização na agenda.
- Carregamento, erro, nenhum resultado e cancelamento de requisições ao sair da página.

## Limites desta versão

**Não existe autenticação real.** O formulário simula a entrada para avaliação visual. Não cria contas, não envia credenciais e não salva senhas. Use somente dados fictícios.

O nome da conta demonstrativa fica no `sessionStorage`. Os dados operacionais ficam apenas na memória: recarregar a página ou sair restaura a demonstração inicial. A proteção de rotas é exclusivamente visual e não constitui segurança de backend. JWT e integração com a API própria serão implementados nas próximas etapas.

A busca Geoapify retorna dados reais; os demais registros iniciais são fictícios. As estimativas de viagem não representam garantia de trânsito em tempo real. Conferir acesso e disponibilidade com cada local.

Esta versão ainda não representa uma entrega final do curso. Permanecem pendentes autenticação/API própria, persistência, refinamentos das regras e telas, revisão completa de critérios e deploy. O repositório frontend já está publicado no GitHub.

## Integração Geoapify

- GET `/v2/places`: busca de locais por categoria.
- POST `/v1/routematrix`: distância e tempo estimados entre dois locais.
- As chamadas ficam em `src/utils/ThirdPartyApi.js`, com timeout e cancelamento.

## Rotas

| Rota          | Conteúdo                         |
| ------------- | -------------------------------- |
| `/`           | Apresentação pública e modais    |
| `/painel`     | Visão geral                      |
| `/alunos`     | Gestão de alunos                 |
| `/agenda`     | Agenda diária                    |
| `/pendencias` | Cobranças e reposições           |
| `/locais`     | Geoapify e locais de atendimento |

As rotas internas exigem uma sessão demonstrativa. Acesso direto sem sessão redireciona para a página pública e abre a modal de login. Um futuro servidor de produção precisa redirecionar rotas do frontend para `index.html`.

## Comandos

| Comando                | Finalidade                  |
| ---------------------- | --------------------------- |
| `npm run dev`          | Servidor de desenvolvimento |
| `npm run lint`         | ESLint                      |
| `npm run build`        | Build de produção em dist/  |
| `npm run preview`      | Visualização local do build |
| `npm run format`       | Formatar o código em src/   |
| `npm run format:check` | Verificar formatação        |

## Organização

- `src/components`: componentes, páginas e estilos.
- `src/contexts/CurrentUserContext.js`: perfil demonstrativo compartilhado.
- `src/utils/demoData.js`: dados fictícios e formatação.
- `src/utils/ThirdPartyApi.js`: chamadas HTTP à Geoapify.
- `src/index.css`: tipografia local, variáveis, estilos compartilhados e acessibilidade.

React, React Router 5, Vite, ESLint e Prettier. O normalize.css é carregado antes dos estilos do projeto para padronizar os estilos iniciais dos navegadores. Fonte Manrope distribuída por @fontsource, com arquivos WOFF/WOFF2 e carregamento local via @font-face.

## Validação

Lint, build e testes de navegador no Edge sem interface gráfica. Os fluxos incluem cadastro/login demonstrativos, campos inválidos, ausência de persistência de senha, criação de aluno, conflitos de agenda, conclusão de reposição, quitação, saída e proteção de rota. Verificação de ausência de rolagem horizontal em 320 e 390 px.

A Geoapify foi testada com GET e POST reais. Estados vazios e erro HTTP foram simulados. Scripts de validação e capturas ficam fora do repositório, na pasta local de validação do ProfissionalHub; não há comando `npm test` configurado. Testes em aparelhos físicos e no domínio publicado ainda pendentes.

## Créditos e desenvolvimento

Dados de locais: [Geoapify](https://www.geoapify.com/) e [OpenStreetMap contributors](https://www.openstreetmap.org/copyright). Desenvolvido por Gustavo Augusto.

Trabalho na branch `stage-react-api`; submeter pull request para `main` conforme as etapas do curso.
