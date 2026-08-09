# ClickBeard Frontend — Documentação da Aplicação

> Este documento descreve **o que foi efetivamente implementado** neste repositório. A especificação original que guiou a implementação está em [`clickbeard-frontend-spec.md`](./clickbeard-frontend-spec.md) — use aquele arquivo como fonte de verdade sobre _requisitos_, e este aqui como fonte de verdade sobre _como o código está organizado hoje_.

---

## 1. Visão geral

ClickBeard é um sistema de agendamento para barbearia com três papéis de usuário sobre a mesma tabela (`CLIENT`, `BARBER`, `ADMIN`). Todo cadastro público cria um usuário `CLIENT` — não é possível criar `BARBER`/`ADMIN` diretamente; a promoção é feita por um ADMIN via `PATCH /users/:id/role`. O frontend é uma aplicação **Next.js 16 (App Router)** que cobre três experiências:

1. **Área pública** — cadastro (sempre como `CLIENT`), login em duas etapas (senha + código de verificação por e-mail).
2. **Área do cliente** — CLIENT e BARBER têm exatamente as mesmas permissões: consultar barbeiros/qualificações, agendar, ver e cancelar os próprios agendamentos, editar perfil/senha.
3. **Área administrativa** — ADMIN gerencia barbeiros, qualificações, agendamentos (hoje/futuros) e visualiza um painel de analytics com 6 telas.

Não existe backend real conectado neste momento — `NEXT_PUBLIC_API_URL` aponta para um placeholder (`.env.local.example`). Nenhum fluxo foi testado ponta a ponta contra dados reais; a aplicação foi validada via `next build`, `tsc --noEmit`, `next lint` e inspeção manual do HTML renderizado em `next dev`.

---

## 2. Stack tecnológica

| Camada              | Escolha                                                       | Versão                |
| ------------------- | ------------------------------------------------------------- | --------------------- |
| Framework           | Next.js (App Router, Turbopack)                               | 16.3.0                |
| Runtime/UI          | React                                                         | 19.2.8                |
| Linguagem           | TypeScript (`strict: true`)                                   | 5.x                   |
| Estilo              | Tailwind CSS (CSS-first, sem `tailwind.config.js`)            | v4                    |
| Componentes         | shadcn/ui, estilo `new-york`, primitivas Radix UI             | CLI fixada em `3.8.5` |
| Data fetching/cache | `@tanstack/react-query`                                       | 5.x                   |
| Tabelas             | `@tanstack/react-table`                                       | **fixada em 8.21.3**  |
| Formulários         | `react-hook-form` + `zod` (`@hookform/resolvers`)             | RHF 7.x / Zod 4.x     |
| Datas               | `date-fns` (+ `date-fns/locale/pt-BR`)                        | 4.x                   |
| Gráficos            | `recharts`, carregado via `next/dynamic({ssr:false})`         | 3.x                   |
| Toasts              | `sonner` (via shadcn), com `next-themes` para resolver o tema | —                     |
| Ícones              | `lucide-react`                                                | —                     |

---

## 3. Como rodar o projeto

```bash
npm install
cp .env.local.example .env.local   # ajuste NEXT_PUBLIC_API_URL para a API real
npm run dev                        # http://localhost:3000
```

| Script          | Efeito                                                              |
| --------------- | ------------------------------------------------------------------- |
| `npm run dev`   | Servidor de desenvolvimento (Turbopack)                             |
| `npm run build` | Build de produção — inclui checagem de tipos TypeScript             |
| `npm run start` | Sobe o build de produção                                            |
| `npm run lint`  | ESLint (inclui as regras `react-hooks` de pureza do React Compiler) |
| `npm run commit` | Prompt interativo do Commitizen para criar um commit no formato Conventional Commits (ver Seção 13) |

### Variáveis de ambiente

| Variável              | Padrão (`.env.local.example`) | Uso                                                                                                   |
| --------------------- | ----------------------------- | ----------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | `http://localhost:3000`       | Base URL da API ClickBeard. Lida tanto no cliente (`lib/env.ts`) quanto nos Route Handlers de sessão. |

---

## 4. Estrutura de diretórios

```text
src/
├── app/                          # Rotas (App Router)
│   ├── (auth)/                   # Grupo público: /register, /login, /login/verify
│   ├── (client)/                 # Grupo autenticado (CLIENT/BARBER/ADMIN)
│   ├── (admin)/                  # Grupo restrito a ADMIN
│   ├── api/auth/{session,refresh}/route.ts   # Route Handlers de sessão
│   ├── layout.tsx                # Root layout: fonte, <AppProviders>
│   └── not-found.tsx             # 404 global
│
├── components/
│   ├── ui/                       # Primitivas shadcn/ui (geradas, editadas quando necessário)
│   ├── shared/                   # Componentes reusados por 2+ features
│   └── providers/app-providers.tsx
│
├── features/                     # Um diretório por domínio do backend
│   ├── auth/          {components, hooks, schemas, services, pending-verification.ts}
│   ├── users/          idem
│   ├── barbers/        idem
│   ├── qualifications/ idem
│   ├── scheduling/     idem
│   ├── analytics/      {components, hooks, services, lib/period-query.ts} — sem schemas/ (sem formulários)
│   └── home/           {components: public-home.tsx, authenticated-home.tsx} — conteúdo de `/`
│
├── lib/                          # Infraestrutura transversal (ver Seção 6)
├── schemas/password.schema.ts    # Regra de senha compartilhada entre auth e users
├── types/{api.ts,domain.ts}      # Tipos crus de DTO + enums de domínio
└── proxy.ts                      # Guarda de rota (era `middleware.ts` — ver Seção 8.4)
```

**Regra de dependência**: `service` nunca importa React; `hook` encapsula `useQuery`/`useMutation` chamando um `service`; `component` chama apenas `hook`s de feature, nunca `fetch`/`service` diretamente. Um componente de página (`app/**/page.tsx`) é sempre um Server Component fino que só define `metadata` e renderiza um componente `*-content.tsx` (Client Component) de `features/*/components`.

---

## 5. Mapa de rotas

### 5.1 Área pública — `(auth)`

| Rota            | Página                             | Componente principal |
| --------------- | ---------------------------------- | -------------------- |
| `/register`     | `app/(auth)/register/page.tsx`     | `RegisterForm`       |
| `/login`        | `app/(auth)/login/page.tsx`        | `LoginForm`          |
| `/login/verify` | `app/(auth)/login/verify/page.tsx` | `VerifyCodeForm`     |

Layout dedicado (`(auth)/layout.tsx`): card centralizado sobre fundo `muted`, sem sidebar/header. Se o usuário já está autenticado, redireciona para `/`.

### 5.2 Área do cliente — `(client)`

`/` fica fora do grupo `(client)` — é `app/page.tsx`, na raiz de `app/`, e não exige sessão (ver `proxy.ts`, Seção 7.4). É um Client Component que decide o conteúdo com `useAuth()`: sem sessão, renderiza `PublicHome` (landing: hero, features, FAQ, localização); autenticado, renderiza `AuthenticatedHome` (saudação, card de resumo por papel, grid de atalhos). Não há redirecionamento por papel — ambos os componentes vivem em `features/home/components/`.

| Rota                 | Página                       | Conteúdo                                                                           |
| -------------------- | ---------------------------- | ---------------------------------------------------------------------------------- |
| `/profile`           | `profile/page.tsx`           | Abas Dados / Segurança                                                             |
| `/barbers`           | `barbers/page.tsx`           | Grid de barbeiros (somente leitura)                                                |
| `/barbers/[id]`      | `barbers/[id]/page.tsx`      | Detalhe + CTA "Agendar"                                                            |
| `/qualifications`    | `qualifications/page.tsx`    | Catálogo de serviços (somente leitura, sem paginação)                              |
| `/book`              | `book/page.tsx`              | Wizard de agendamento (4 passos)                                                   |
| `/appointments`      | `appointments/page.tsx`      | Meus agendamentos (paginado)                                                       |
| `/appointments/[id]` | `appointments/[id]/page.tsx` | Detalhe + cancelamento                                                             |

### 5.3 Área administrativa — `(admin)`

| Rota                            | Página                               | Conteúdo                                                    |
| ------------------------------- | ------------------------------------ | ----------------------------------------------------------- |
| `/admin/dashboard`              | `admin/dashboard/page.tsx`           | Métricas consolidadas + gráficos                            |
| `/admin/analytics/users`        | `admin/analytics/users/page.tsx`     | Métricas de usuários                                        |
| `/admin/analytics/appointments` | `.../appointments/page.tsx`          | Métricas de agendamentos                                    |
| `/admin/analytics/barbers`      | `.../barbers/page.tsx`               | Métricas de barbeiros                                       |
| `/admin/analytics/customers`    | `.../customers/page.tsx`             | Métricas de clientes + busca por `customerId`               |
| `/admin/analytics/occupation`   | `.../occupation/page.tsx`            | Ocupação por barbeiro + horários livres hoje                |
| `/admin/barbers`                | `admin/barbers/page.tsx`             | Tabela de barbeiros                                         |
| `/admin/barbers/new`            | `admin/barbers/new/page.tsx`         | Criar barbeiro                                              |
| `/admin/barbers/[id]`           | `admin/barbers/[id]/page.tsx`        | Abas Dados / Qualificações / Indisponibilidades\*           |
| `/admin/barbers/[id]/edit`      | `.../edit/page.tsx`                  | Editar idade/data de contratação                            |
| `/admin/qualifications`         | `admin/qualifications/page.tsx`      | CRUD completo                                               |
| `/admin/appointments/today`     | `admin/appointments/today/page.tsx`  | Agenda do dia                                               |
| `/admin/appointments/future`    | `admin/appointments/future/page.tsx` | Agenda futura (inclui cancelados)                           |
| `/admin/appointments/[id]`      | `admin/appointments/[id]/page.tsx`   | Detalhe + cancelamento admin\*                              |
| `/admin/users`                  | `admin/users/page.tsx`               | Tabela paginada de usuários                                 |
| `/admin/users/[id]`             | `admin/users/[id]/page.tsx`          | Gestão de usuário (papel, ativação)                         |

\* Atrás de `PLANNED_FEATURES_ENABLED` (ver Seção 9).

### 5.4 Rotas internas (Route Handlers)

| Rota                | Método   | Função                                                                                                         |
| ------------------- | -------- | -------------------------------------------------------------------------------------------------------------- |
| `/api/auth/session` | `POST`   | Grava o refresh token em cookie `httpOnly` após `complete()`                                                   |
| `/api/auth/session` | `DELETE` | Logout: revoga o token na API e limpa o cookie                                                                 |
| `/api/auth/refresh` | `POST`   | Silent refresh — lê o cookie `httpOnly`, chama `POST /auth/refresh-token`, retorna só o access token ao client |

---

## 6. Camada `lib/` (infraestrutura transversal)

| Arquivo              | Responsabilidade                                                                                                                                        |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `env.ts`             | `API_URL` (lido de `NEXT_PUBLIC_API_URL`)                                                                                                               |
| `api-error.ts`       | Classe `ApiError` + `domainErrorMessages` (mapa `code → mensagem pt-BR`) + `resolveErrorMessage()`                                                      |
| `api-client.ts`      | `apiFetch<T>()` — único ponto de `fetch` da aplicação. Injeta `Authorization`, faz parsing dos dois formatos de erro, enfileira um único refresh em 401 |
| `auth-session.ts`    | Estado do access token **em memória**, fora do React (evita import circular entre `api-client` e o Context)                                             |
| `auth-context.tsx`   | `AuthProvider`/`useAuth()` — sessão, silent refresh no boot, refresh proativo ~1min antes de expirar                                                    |
| `user-cookie.ts`     | Cookie não-`httpOnly` de conveniência (`{id,name,email,role}`) para pintar header/sidebar antes do silent refresh terminar                              |
| `session-cookie.ts`  | Nome do cookie `httpOnly` do refresh token, compartilhado entre `proxy.ts` e os Route Handlers                                                          |
| `query-client.ts`    | Factory do `QueryClient` (retry desabilitado para erros 4xx)                                                                                            |
| `cache-resources.ts` | `staleTime` por recurso, espelhando os TTLs documentados do backend                                                                                     |
| `business-rules.ts`  | Constantes de regra de negócio replicadas no cliente (ver Seção 10)                                                                                     |
| `feature-flags.ts`   | `PLANNED_FEATURES_ENABLED`                                                                                                                              |
| `utils.ts`           | `cn()`, `formatDate/DateTime/Time`, `formatPercent`, `getInitials`                                                                                      |

---

## 7. Autenticação e sessão

### 7.1 Fluxo completo

```
POST /users (registro) — body: {name, email, password, birthDate?}; sem requesterId
   → toast + redirect /login (e-mail pré-preenchido)

POST /auth/login (200, {user})
   → NÃO retorna token — guarda {userId,email,name} em memória
     (features/auth/pending-verification.ts, módulo puro, sem persistência)
   → redirect /login/verify

/login/verify
   → POST /account-verification/validate {userId, code}
   → em sucesso, dispara automaticamente POST /account-verification/complete {userId}
   → complete() retorna {accessToken, accessTokenExpiresAt, refreshToken, refreshTokenExpiresAt}
   → AuthProvider.establishSession():
       1. guarda accessToken em memória (auth-session.ts)
       2. POST /api/auth/session (Route Handler grava o refresh token em cookie httpOnly)
       3. GET /users/:id (para obter `role`, que /auth/login não retorna)
       4. grava {id,name,email,role} no cookie de conveniência
   → redirect "/" → decide destino por role
```

### 7.2 Onde cada coisa mora

| Dado                                       | Onde                                                   | Por quê                                                                                                       |
| ------------------------------------------ | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| Access token                               | Memória (`lib/auth-session.ts`)                        | Nunca em `localStorage`/cookie legível por JS — mitiga XSS                                                    |
| Refresh token                              | Cookie `httpOnly`, `secure` (produção), `sameSite=lax` | Nunca chega a JavaScript no client                                                                            |
| `{id,name,email,role}`                     | Cookie **não**-`httpOnly` (`lib/user-cookie.ts`)       | Só para renderização otimista do header/sidebar; nunca usado para autorização real                            |
| `{userId,email,name}` entre login e verify | Módulo em memória (`pending-verification.ts`)          | Intencionalmente não sobrevive a reload — se o usuário recarregar `/login/verify`, é redirecionado a `/login` |

### 7.3 Interceptor de 401 (`api-client.ts`)

Toda chamada passa por `apiFetch()`. Em uma resposta 401 cuja rota **não** tenha `skipAuthRefresh: true` (usado por todas as chamadas de `/auth/*` e `/account-verification/*`):

1. Dispara **uma única** chamada concorrente a `POST /api/auth/refresh` (múltiplas 401 simultâneas compartilham a mesma Promise).
2. Em sucesso: atualiza o access token em memória e repete a requisição original.
3. Em falha: chama `notifySessionExpired()` (pub/sub em `auth-session.ts`), que o `AuthProvider` escuta para limpar a sessão — a UI reage sem precisar que `api-client` conheça React.

### 7.4 Guarda de rota (`src/proxy.ts`)

Renomeado de `middleware.ts` para `proxy.ts` — o Next.js 16.3 depreciou a convenção antiga (`npx @next/codemod middleware-to-proxy`;. Verifica apenas a **presença** do cookie de refresh token (não sua validade — isso é decisão da API):

- Fora de `(auth)` sem cookie → redireciona para `/login?redirect={path}`.
- Dentro de `(auth)` (exceto `/login/verify`) com cookie presente → redireciona para `/`.

A checagem adicional de `role === 'ADMIN'` acontece no `(admin)/layout.tsx` (client-side, depois que `AuthProvider` resolve o usuário) — é defesa em profundidade de UX; a autorização real está 100% no backend.

---

## 8. Tratamento de erros

### 8.1 `ApiError` (`lib/api-error.ts`)

```ts
class ApiError extends Error {
  statusCode: number;
  code: string; // nome da classe de domínio OU string genérica de guard
  rawMessage: string | string[];

  get isDomainError(): boolean; // false para Unauthorized/Forbidden/Bad Request/Not Found
  get isValidationArray(): boolean; // true quando rawMessage é array (ValidationPipe)
}
```

### 8.2 Resolução de mensagem

`resolveErrorMessage(error)`:

1. `statusCode === 429` → mensagem de rate limit fixa.
2. `domainErrorMessages[error.code]` — mapa cobrindo todos os erros de domínio citados na spec (`UserAlreadyExistsError`, `WeakPasswordError`, `InvalidCredentialsError`, `BarberTimeSlotConflictError`, `AppointmentTooSoonError`, `CancellationWindowExpiredError`, `QualificationInUseError`, `AdminCannotBeDeactivatedError`, etc.) e as 4 strings genéricas de guard (`Unauthorized`, `Forbidden`, `Bad Request`, `Not Found`).
3. Se `isValidationArray`, junta o array com quebras de linha.
4. Fallback final: `"Algo deu errado. Tente novamente."`

Cada formulário mapeia os erros de domínio relevantes para o campo certo (ex.: `UserAlreadyExistsError` → erro no campo `email` do cadastro) antes de cair no fallback genérico via `toast`.

---

## 9. Regras de negócio replicadas no cliente

Todas em `lib/business-rules.ts`, cada uma comentada com a seção da spec de origem:

| Constante                                                             | Valor    | Uso                                                         |
| --------------------------------------------------------------------- | -------- | ----------------------------------------------------------- |
| `MIN_APPOINTMENT_NOTICE_HOURS`                                        | 2        | Janela de cancelamento e aviso de slot "quase indisponível" |
| `VERIFICATION_CODE_TTL_MINUTES`                                       | 10       | Referência de UX (não exibido como contador)                |
| `MAX_VERIFICATION_CODE_ATTEMPTS`                                      | 5        | Contador "Tentativa N de 5" no `OtpInput`                   |
| `RESEND_CODE_COOLDOWN_SECONDS`                                        | 30       | Cooldown do botão "Reenviar código"                         |
| `API_PAGE_SIZE`                                                       | 100      | Documental (a API não aceita alterar)                       |
| `CANCELLATION_REASON_MIN_LENGTH` / `UNAVAILABILITY_REASON_MIN_LENGTH` | 3        | Validação Zod dos formulários `[PLANEJADO]`                 |
| `MIN_PASSWORD_LENGTH`                                                 | 8        | `schemas/password.schema.ts`                                |
| `BARBER_MIN_AGE` / `BARBER_MAX_AGE`                                   | 18 / 100 | Validação Zod de criação/edição de barbeiro                 |

**Importante**: essas constantes só evitam round-trips previsíveis (ex.: desabilitar o botão "Cancelar" antes de tentar). A API é sempre a autoridade final — nenhum formulário assume sucesso sem a resposta real do backend.

---

## 10. Cache e invalidação (TanStack Query)

- `staleTime` por recurso definido em `lib/cache-resources.ts`, espelhando os TTLs documentados do backend (`barbersList`: 5min, `timeSlots`: 30s, `qualifications`: 15min, `analytics`: 5min etc.).
- Convenção de `queryKey`: `["<recurso>", "<operação>", ...params]` — ex. `["appointments", "me", page]`, `["barbers", "detail", id]`, `["timeSlots", barberId, qualificationId, date]`.
- **Invalidação por mutação**: cada hook `use-create-*`/`use-update-*`/`use-delete-*` invalida os prefixos de `queryKey` relevantes em `onSuccess`. Exemplo notável — `useCreateAppointment` invalida `["appointments","me"]`, `["appointments","today"]`, `["appointments","future"]` e `["timeSlots", barberId, qualificationId]` (os mesmos 4 prefixos que o backend documenta invalidar internamente).
- **Único caso de optimistic update da aplicação**: `useCancelAppointment` (`features/scheduling/hooks/use-cancel-appointment.ts`) marca `CANCELLED` otimisticamente no cache (detalhe + listas `appointments/me`) e reverte via snapshot em `onError`. Toda outra mutação espera a resposta do servidor antes de atualizar a UI — em especial `useCreateAppointment`, dado o risco real de `BarberTimeSlotConflictError`.
- **Resolução de nomes** (`AppointmentResponseDto` só traz `barberId`/`qualificationId`/`customerId`, nunca nomes): componentes dedicados fazem o lookup via cache do TanStack Query —
  - `features/barbers/components/barber-name.tsx` → `useBarber(barberId)`
  - `features/qualifications/components/qualification-name.tsx` → `useQualifications()` (lista completa, já em cache)
  - `features/users/components/customer-name.tsx` → `useUser(customerId)`

  Cada um renderiza um `Skeleton` enquanto resolve e cacheia por `staleTime`, evitando refetch repetido na mesma tabela.

---

## 11. Design system

- Tokens de cor em `src/app/globals.css`, formato `hsl(H S% L%)` completo (não a tripla "nua" do Tailwind v3) — paleta carvão + âmbar/cobre da spec §7.1, incluindo os tokens customizados `--success`/`--warning` (não vêm por padrão no shadcn) expostos como utilitários Tailwind via `@theme inline`.
- Fonte: Inter via `next/font/google`.
- Componente `Button`: escala de altura ajustada manualmente para bater com a spec (`default` = `h-10`, `sm` = `h-9`, `lg` = `h-11`; o gerado pelo CLI vinha uma casa abaixo).
- `Alert` (`components/ui/alert.tsx`) ganhou uma variante `warning` extra (só existiam `default`/`destructive` no componente gerado) para o `CancelWindowNotice`.
- Dark mode: tokens `.dark` definidos e funcionais, mas sem toggle exposto — `next-themes` fica travado em `defaultTheme="light"` (não é requisito de produto, spec §7.1).

### Componentes compartilhados de maior reuso (`components/shared/`)

| Componente                               | Papel                                                                                                                                                                              |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DataTable` + `DataTablePagination`      | Wrapper genérico sobre `@tanstack/react-table` v8 com paginação server-side, skeleton de loading, estado vazio/erro e fallback de card empilhado em mobile (`renderMobileCard`)    |
| `ConfirmDialog`                          | `AlertDialog` genérico parametrizável — toda ação destrutiva/administrativa da aplicação passa por ele                                                                             |
| `PeriodFilter`                           | Seletor de preset (`TODAY/WEEK/MONTH/YEAR/CUSTOM`) + range picker, reusado nas 6 páginas de analytics                                                                              |
| `OtpInput`                               | Campo de 6 dígitos com auto-avanço, colar, e submit automático                                                                                                                     |
| `MultiSelectChips`                       | Alternativa por chips clicáveis ao "Command com checkboxes" da spec, usada na seleção de qualificações ao criar um barbeiro                                                        |
| `AppSidebar` / `AppHeader` / `MobileNav` | Shell de navegação — mesmos componentes para os grupos `(client)` e `(admin)`, parametrizados por `NavItem[]`                                                                      |
| `Breadcrumbs`                            | Usado nas 7 rotas listadas na spec §5 (`/barbers/[id]`, `/appointments/[id]`, `/admin/barbers/[id]`, `/admin/barbers/[id]/edit`, `/admin/appointments/[id]`, `/admin/analytics/*`, `/admin/users/[id]`) |

---

## 12. Limitações herdadas da API (não são bugs do frontend)

Estas restrições vêm da ausência de endpoints no backend e moldaram decisões de UI — documentadas em detalhe no Apêndice da spec original:

1. ~~Sem listagem de usuários~~ — resolvido: `GET /users` agora pagina como os demais módulos; ver `/admin/users` (`features/users/components/admin-users-table-content.tsx`).
2. **Sem "esqueci minha senha"** — `PATCH /users/:id/password` sempre exige a senha atual.
3. ~~Sem edição de nome/data de nascimento~~ — resolvido: `PATCH /users/:id/profile` (self-only, nem admin pode agir por outro usuário aqui) edita nome e data de nascimento; e-mail continua somente leitura (sem rota dedicada). Senha (`PATCH /users/:id/password`) e papel (`PATCH /users/:id/role`, admin) continuam em rotas separadas.
4. **Status ativo/inativo do barbeiro não aparece na listagem** — `BarberResponseDto` não traz o `active` do usuário subjacente; chamar `GET /users/:id` por linha não escalaria.
5. **Criar barbeiro exige digitar o email manualmente** — não existe `GET /users?role=BARBER` para popular um dropdown de busca (`features/barbers/components/barber-form.tsx`, campo `email`). O usuário precisa já ter sido promovido a `BARBER` via `ChangeRoleDialog` (`/admin/users/[id]`) antes de ser vinculado a um perfil operacional aqui.

---

## 13. Fluxo de contribuição e commits

### 13.1 Conventional Commits via Commitizen

Todo commit deste repositório segue [Conventional Commits](https://www.conventionalcommits.org/) (`tipo(escopo opcional): descrição`, em inglês). O projeto tem [Commitizen](https://github.com/commitizen/cz-cli) configurado com o adapter `cz-conventional-changelog` (`package.json` → `config.commitizen`, e `.czrc` para integrações que leem o adapter diretamente):

```bash
npm run commit   # em vez de "git add -A && git commit -m ..."
```

O comando abre um prompt interativo que monta a mensagem no formato correto. Tipos usados no histórico até agora: `feat`, `chore`, `style`, `docs` — outros tipos padrão (`fix`, `refactor`, `test`, `perf`) seguem a mesma convenção quando aplicável.

### 13.2 Branches e Pull Requests

`main` é protegida por convenção: todo trabalho novo entra por uma branch de feature e um Pull Request, nunca por push direto (a única exceção histórica é o commit inicial de bootstrap do Commitizen, necessário porque o GitHub exige que a branch base de um PR já exista).

Convenção de nome de branch: `<tipo>/<assunto-em-kebab-case>`, por exemplo:

- `chore/project-foundation` — tooling, configuração, tipos e libs compartilhadas
- `feat/ui-kit`, `feat/auth`, `feat/home`, `feat/barbers`, `feat/scheduling`, `feat/qualifications`, `feat/users`, `feat/analytics` — uma branch/PR por área de domínio
- `docs/readme-update` — atualizações de documentação

Cada PR agrupa vários commits pequenos e temáticos (schemas → services → hooks → components → pages, nessa ordem de dependência) em vez de um único commit "bulk", para manter o histórico revisável área por área.

### 13.3 Ordem de dependência entre PRs

A ordem de merge segue a árvore de dependências do código, não é arbitrária:

```
chore/project-foundation  (tooling, tipos, lib/ base, api-client, globals.css)
        ↓
feat/ui-kit                (primitivas shadcn, componentes shared, AppProviders, layout raiz)
        ↓
feat/auth                  (sessão, AuthProvider, proxy, guardas de rota, páginas de auth)
        ↓
feat/home ──┬── feat/barbers ──┬── feat/scheduling
            ├── feat/qualifications
            └── feat/users ──── feat/analytics
```

`feat/home`, `feat/barbers`, `feat/qualifications`, `feat/users`, `feat/scheduling` e `feat/analytics` só precisam de `feat/auth` como base (todas consomem `useAuth`); a ordem entre elas no histórico é apenas a ordem de merge escolhida, não uma dependência real entre si.

---
