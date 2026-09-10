# ProfissionalHub — Frontend

Plataforma de gestão da rotina de profissionais de Educação Física autônomos.

## Estado atual

Estrutura inicial em React e JavaScript, com Vite e ESLint. A página inicial é provisória; autenticação, rotas, módulos e integração Geoapify ainda não estão implementados. Não representa a conclusão da Fase 1.

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
- `src/contexts`: contexto de autenticação a implementar.
- `src/images` e `src/vendor`: imagens, fontes e recursos.

## Escopo aprovado

Alunos, agenda individual, sessões, reposições autorizadas manualmente, cobranças com quitação integral e painel operacional. Geoapify para explorar locais e consultar deslocamentos em São Paulo, com GET e POST.

## Desenvolvimento

Branch `stage-react-api`, com futura pull request para `main`. Publicação no GitHub e deploy ainda pendentes. Não versionar chaves, tokens ou arquivos `.env`. Nenhuma chave Geoapify foi copiada para este projeto.
