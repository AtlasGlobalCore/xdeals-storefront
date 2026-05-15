# 🛒 XDEALS.ONLINE — SaaS Storefront Headless

> Plataforma de e-commerce multi-loja headless, consumindo um Core Banking externo (AtlasGlobal Digital) via Universal Relay Protocol.

---

## 📐 Arquitetura

```
┌──────────────────────────────────────────────────────┐
│                   BROWSER / CLIENT                     │
│  *.xdeals.online ──→ Next.js Middleware (subdomain)    │
│       └──→ /[storeSlug]/ ──→ Store Layout (SSR config)│
│              └──→ StoreProvider (React Context)        │
│                    └──→ CheckoutDialog                 │
│                          └──→ POST /api/checkout/process│
└─────────────────────────────┬──────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────┐
│            NEXT.JS ROUTE HANDLER (Ghost MW)            │
│  /api/checkout/process                                 │
│    ├── publishableKey in headers                        │
│    └── POST → https://api.atlasglobal.digital          │
│              /checkout/initiate  (Universal Relay)     │
│                                                         │
│  Response type dictates UI:                             │
│    • REFERENCE  → Multibanco entity/ref or PIX code    │
│    • IFRAME     → Secure card capture via client_secret │
│    • ASYNC_WAIT → MB WAY app confirmation screen        │
└──────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────┐
│              CORE BANKING (api.atlasglobal.digital)     │
│  GET  /stores/{slug}/config                            │
│    → themePrimary, name, logoUrl, allowedMethods,      │
│      publishableKey, currency, locale                   │
│                                                         │
│  POST /checkout/initiate                               │
│    → type: REFERENCE | IFRAME | ASYNC_WAIT             │
│    → sessionId, expiresAt, method-specific data         │
└──────────────────────────────────────────────────────┘
```

---

## 🗂 Estrutura do Projeto

```
├── middleware.ts                    # Subdomain router (*.xdeals.online)
├── prisma/
│   ├── schema.prisma               # Multi-tenant DB schema
│   └── seed.ts                     # Demo data (Seller → Store → Products)
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout (platform landing only)
│   │   ├── page.tsx                # Root page (xdeals.online landing)
│   │   ├── [storeSlug]/
│   │   │   ├── layout.tsx          # Store layout (SSR config fetch + theme injection)
│   │   │   └── page.tsx            # Store page (all sections)
│   │   └── api/
│   │       ├── checkout/
│   │       │   └── process/
│   │       │       └── route.ts    # Ghost Middleware → Universal Relay
│   │       ├── stores/
│   │       │   └── config/
│   │       │       └── route.ts    # Store config proxy (Core Banking API)
│   │       ├── orders/
│   │       │   └── route.ts        # Order creation (DB-backed)
│   │       ├── payments/
│   │       │   └── process/
│   │       │       └── route.ts    # Legacy payment proxy (retained)
│   │       ├── products/
│   │       │   ├── route.ts        # Products API (storeId-scoped)
│   │       │   └── [slug]/
│   │       │       └── route.ts    # Product by slug
│   │       └── b2b/
│   │           └── route.ts        # B2B inquiry
│   ├── components/
│   │   ├── checkout-dialog.tsx     # Checkout UI (REFERENCE/IFRAME/ASYNC_WAIT)
│   │   ├── store-provider.tsx      # Combined StoreProvider + React Query
│   │   ├── header.tsx, hero.tsx, footer.tsx, ...
│   │   └── ui/                     # shadcn/ui components
│   ├── lib/
│   │   ├── store-context.tsx       # StoreConfig context + useStoreConfig hook
│   │   ├── store.ts                # Server-side store slug resolution
│   │   ├── db.ts                   # Prisma client singleton
│   │   └── utils.ts                # cn() utility
│   └── store/
│       ├── cart-store.ts           # Zustand cart (persisted)
│       └── ui-store.ts             # Zustand UI state
├── .env                            # DATABASE_URL, CORE_API_BASE
└── package.json
```

---

## 🚀 Setup Local

```bash
# 1. Instalar dependências
bun install

# 2. Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com:
#   DATABASE_URL=file:./db/custom.db
#   CORE_API_BASE=https://api.atlasglobal.digital
#   NEXT_PUBLIC_APP_URL=http://localhost:3000

# 3. Inicializar base de dados
bun run db:push
bunx tsx prisma/seed.ts

# 4. Iniciar servidor de desenvolvimento
bun run dev

# 5. Aceder à loja
# Localhost: http://localhost:3000/?__store=lovelyproportion
# Subdomínio: lovelyproportion.xdeals.online
```

---

## 🔀 Multi-Tenant Routing

### Middleware (`middleware.ts`)

O middleware interceta todas as requisições de página e extrai o **store slug** do hostname:

| Origem | Extração | Rewrite |
|--------|----------|---------|
| `loja1.xdeals.online` | Subdomínio `loja1` | `/loja1` |
| `loja1.staging.xdeals.online` | Subdomínio `loja1` | `/loja1` |
| `localhost:3000?__store=loja1` | Query param | `/loja1` |
| Header `x-store-slug: loja1` | Header | `/loja1` |

Bypass: `/api/*`, `/_next/*`, `/images/*`, `/favicon.ico`, ficheiros estáticos.

### Store Layout (`[storeSlug]/layout.tsx`)

Layout dinâmico que faz **GET server-side** para:

```
GET https://api.atlasglobal.digital/stores/{storeSlug}/config
```

Retorna:
```json
{
  "storeId": "uuid",
  "slug": "lovelyproportion",
  "name": "Lovelyproportion Fruits",
  "logoUrl": "/images/mirtilos.png",
  "themePrimary": "#2D6A4F",
  "themeSecondary": "#FDF8F0",
  "publishableKey": "pk_live_...",
  "allowedMethods": ["CARD", "MBWAY", "MULTIBANCO"],
  "currency": "EUR",
  "locale": "pt_PT"
}
```

O layout injeta `themePrimary` como variável CSS (`--color-primary`) no `<html>` e passa o config para o `StoreProvider`.

---

## 💳 Checkout — Ghost Middleware Protocol

### Fluxo

```
Cliente seleciona método → POST /api/checkout/process
                              │
                              ▼
                    Route Handler (Ghost MW)
                    ├─ Recebe: cart + paymentMethod + publishableKey
                    ├─ Relay POST → api.atlasglobal.digital/checkout/initiate
                    │   Headers: Authorization: Bearer {publishableKey}
                    │             X-Publishable-Key: {publishableKey}
                    └─ Retorna resposta verbatim para o frontend
```

### Tipos de Resposta

#### `REFERENCE` — Multibanco / PIX

```json
{
  "type": "REFERENCE",
  "sessionId": "rel_abc123",
  "expiresAt": "2026-01-01T12:30:00Z",
  "reference": {
    "entity": "12345",
    "reference": "987654321",
    "amount": 24.90
  }
}
```

UI: Exibe entidade + referência + valor com botões de copiar.
PIX: Exibe código PIX + QR Code.

#### `IFRAME` — Cartão de Crédito

```json
{
  "type": "IFRAME",
  "sessionId": "rel_abc456",
  "expiresAt": "2026-01-01T12:30:00Z",
  "iframe": {
    "clientSecret": "cs_rel_abc456_secret_xxx",
    "publishableKey": "pk_live_...",
    "returnUrl": "https://store.xdeals.online/api/checkout/confirm?session=rel_abc456"
  }
}
```

UI: Monta `<iframe>` seguro com `clientSecret` para captura de dados do cartão.

#### `ASYNC_WAIT` — MB WAY

```json
{
  "type": "ASYNC_WAIT",
  "sessionId": "rel_abc789",
  "expiresAt": "2026-01-01T12:30:00Z",
  "asyncWait": {
    "message": "Confirme o pagamento na app MB WAY para o número 912345678",
    "phoneNumber": "912345678",
    "deepLink": "mbway://pay?session=rel_abc789"
  }
}
```

UI: Exibe estado de espera com número de telefone e link para app MB WAY.

---

## 🗄 Base de Dados (Prisma + SQLite/Supabase)

### Diagrama Relacional

```
Seller (1) ──< Store (N) ──< Product (N)
                          ──< Order (N)
                          ──< B2BInquiry (N)
```

### Modelo Store (Tenant)

| Campo | Tipo | Notas |
|-------|------|-------|
| `id` | UUID | PK |
| `sellerId` | UUID | FK → Seller |
| `subdomain` | String | `@unique` — ex: "lovelyproportion" |
| `walletReference` | String | `@unique` — ponte para core banking ledger |
| `themePrimary` | String | Hex color — ex: "#2D6A4F" |
| `name` | String | Nome da loja |
| `logoUrl` | String? | URL do logótipo |

### Modelo Order

| Campo | Tipo | Notas |
|-------|------|-------|
| `id` | UUID | PK |
| `storeId` | UUID | FK → Store |
| `status` | String | `AWAITING_PAYMENT` → `PAID` → `CONFIRMED` → `SHIPPED` → `DELIVERED` / `CANCELLED` |
| `paymentSessionId` | String? | ID da sessão do Ghost Middleware |
| `paymentUrl` | String? | URL de pagamento retornado |
| `total` | Float | Valor total em EUR |

### Migração para Supabase

1. Alterar `provider` para `"postgresql"` em `schema.prisma`
2. Atualizar `DATABASE_URL` com connection string do Supabase
3. Adicionar `@db.Uuid` nos campos UUID
4. Executar `prisma migrate dev --name init_supabase`

---

## 🧩 StoreProvider (React Context)

```tsx
// Uso em qualquer componente cliente
const { config, isLoading, error } = useStoreConfig()

// config contém:
// - name, logoUrl, themePrimary
// - allowedMethods: AllowedMethod[] ('CARD' | 'MBWAY' | 'MULTIBANCO' | 'PIX')
// - publishableKey: string
// - currency, locale
```

O `checkout-dialog.tsx` consome `allowedMethods` do contexto para renderizar os radio buttons dinamicamente.

---

## 🔐 Variáveis de Ambiente

| Variável | Descrição | Default |
|----------|-----------|---------|
| `DATABASE_URL` | Connection string do Prisma | `file:./db/custom.db` |
| `CORE_API_BASE` | URL base do Core Banking API | `https://api.atlasglobal.digital` |
| `NEXT_PUBLIC_APP_URL` | URL pública da app (return URLs) | `http://localhost:3000` |

---

## 🧪 Testes das APIs

```bash
# Store config
curl "http://localhost:3000/api/stores/config?slug=lovelyproportion"

# Checkout — MULTIBANCO (→ REFERENCE)
curl -X POST http://localhost:3000/api/checkout/process \
  -H "Content-Type: application/json" \
  -d '{"publishableKey":"pk_test","storeSlug":"lovelyproportion","customer":{"name":"João","email":"j@t.pt","phone":"912345678","address":"Rua 1","city":"Viseu","postalCode":"3500-000"},"items":[{"productId":"p1","productName":"Mirtilos","quantity":1,"unitPrice":8.90,"unit":"kg"}],"paymentMethod":"MULTIBANCO","total":8.90,"currency":"EUR"}'

# Checkout — MBWAY (→ ASYNC_WAIT)
# ... same payload with "paymentMethod":"MBWAY"

# Checkout — CARD (→ IFRAME)
# ... same payload with "paymentMethod":"CARD"
```

---

## 📦 Stack Tecnológico

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 16 (App Router) |
| Linguagem | TypeScript 5 |
| Estilo | Tailwind CSS 4 + shadcn/ui |
| Base de Dados | Prisma ORM (SQLite dev / Supabase prod) |
| Estado Cliente | Zustand (cart + UI) |
| Estado Servidor | TanStack React Query |
| Animações | Framer Motion |
| Pagamentos | Ghost Middleware Protocol → Core Banking API |
| Fontes | Playfair Display + DM Sans |

---

## 🏢 Entidade

**Lovelyproportion — Fruits Unipessoal Lda**
- NIF: 515444669
- Sátão, Viseu, Portugal
- 7+ anos de experiência em pequenos frutos

---

## 📄 Licença

Proprietário — AtlasGlobal Core
