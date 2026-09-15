# ProfissionalHub — Frontend

Plataforma de gestão da rotina de profissionais de Educação Física autônomos.

## Estado atual

Página pública, modais de cadastro/login e painel demonstrativo com navegação responsiva. É possível entrar pelos formulários ou pelo botão de demonstração. O painel mostra alunos ativos, atendimentos de hoje e cobranças em aberto com dados fictícios.

A sessão salva apenas o nome no sessionStorage da aba, permite recarregar a página e é removida ao sair. Não há autenticação real, criação de contas ou armazenamento de senhas. O bloqueio de /painel é apenas uma simulação no frontend. A rota /alunos permite buscar por nome ou e-mail, filtrar por status, cadastrar, editar e ativar/inativar alunos. O total de ativos no painel acompanha as alterações. Os dados são temporários e voltam aos exemplos iniciais ao recarregar ou sair da demonstração. Agenda, pendências e integração Geoapify serão conectadas nas próximas etapas. Não representa a conclusão da Fase 1.

## Executar

Validado com Node.js 24.15.0 e npm 11.12.1.

```bash
npm ci
npm run dev
```

Use o endereço informado pelo Vite.

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
