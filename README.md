# ProfissionalHub — Frontend

Plataforma de gestão da rotina de profissionais de Educação Física autônomos.

## Estado atual

Página pública, modais de cadastro/login e painel demonstrativo com navegação responsiva. É possível entrar pelos formulários ou pelo botão de demonstração. O painel mostra alunos ativos, atendimentos de hoje e cobranças em aberto com dados fictícios.

A sessão salva apenas o nome no sessionStorage da aba, permite recarregar a página e é removida ao sair. Não há autenticação real, criação de contas ou armazenamento de senhas. O bloqueio de /painel é apenas uma simulação no frontend. A rota /alunos permite buscar por nome ou e-mail, filtrar por status, cadastrar, editar e ativar/inativar alunos. O total de ativos no painel acompanha as alterações. Os dados são temporários e voltam aos exemplos iniciais ao recarregar ou sair da demonstração. A agenda permite consultar datas, agendar para alunos ativos e registrar realização, falta ou cancelamento. Horários sobrepostos são bloqueados; horários consecutivos são permitidos. O painel acompanha as alterações. Os locais disponíveis nesta etapa são exemplos fictícios. A página de pendências permite criar cobranças e registrar sua quitação integral manualmente. Faltas e cancelamentos podem gerar uma reposição quando o profissional autoriza. Agendar reserva o horário; realizar conclui a reposição; falta ou cancelamento da reposição a devolve para agendamento, sem duplicar o crédito. Alunos inativos não podem agendar reposições. Não há processamento de pagamentos nem persistência real. A rota /locais busca academias, parques e centros esportivos pela Geoapify em um raio de 15 km do centro de São Paulo. Mostra inicialmente três resultados e permite carregar mais três por vez, até o limite de 18 retornados. Há indicação de carregamento, estados de erro e resultado vazio. Dois locais podem ser selecionados para estimar distância e tempo de carro. Locais salvos ficam disponíveis no formulário de agendamento durante a demonstração. Não representa a conclusão da Fase 1.

## Executar

Validado com Node.js 24.15.0 e npm 11.12.1.

```bash
npm ci
npm run dev
```

Antes de executar, copie `.env.example` para `.env` e preencha `VITE_GEOAPIFY_API_KEY` com sua chave Geoapify. Reinicie o Vite após alterar esse arquivo. Sem a chave, as demais telas funcionam, mas a busca informa a configuração ausente.

Use o endereço informado pelo Vite.

## API externa

- GET `/v2/places`: busca de locais.
- POST `/v1/routematrix`: estimativa de deslocamento entre dois locais.
- Requisições usam fetch, timeout e cancelamento ao sair da página.
- Estimativas não garantem trânsito em tempo real. Confira o acesso aos locais antes de atendimentos.
- Atribuição à Geoapify e aos colaboradores do OpenStreetMap aparece na tela.
- Variáveis `VITE_` são expostas ao navegador: configure as restrições da chave no provedor antes do deploy. O `.env` não deve ser versionado.

## Comandos

- `npm run dev`: desenvolvimento.
- `npm run lint`: análise estática com ESLint.
- `npm run build`: build em `dist/`.
- `npm run preview`: visualizar o build localmente.

## Estrutura

- `src/components`: pasta por componente, com JSX e CSS.
- `src/utils`: funções auxiliares e futuros módulos de API.
- `src/contexts`: contexto do usuário da demonstração.
- `src/images` e `src/vendor`: imagens, fontes e recursos.

## Escopo aprovado

Alunos, agenda individual, sessões, reposições autorizadas manualmente, cobranças com quitação integral e painel operacional. Geoapify para explorar locais e consultar deslocamentos em São Paulo, com GET e POST.

## Desenvolvimento

Branch `stage-react-api`, com futura pull request para `main`. Repositório publicado no GitHub; deploy ainda pendente. Não versionar chaves, tokens ou arquivos `.env`.
