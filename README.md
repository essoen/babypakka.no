# Babypakka.no

Abonnementstjeneste for babyutstyr. Foreldre registrerer barnets fodselsdato og far tilgang til alderstilpassede utstyrspakker de leier manedlig. Tjenesten haper foreldre med a leie i stedet for a kjope — bra for lommebok og miljo.

## Tech stack

| Lag | Teknologi |
|-----|-----------|
| Frontend | Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 |
| Backend | Kotlin + Micronaut 4 + Micronaut Data JPA |
| Database | PostgreSQL 16 |
| Migrasjoner | Flyway (11 migrasjoner + seed-data) |
| Auth | JWT (Micronaut Security) + bcrypt passord-hashing |
| Infrastruktur | Docker Compose (lokal), AWS (planlagt, se `infrastructure.md`) |

## Hurtigstart med Docker Compose

Forutsetter Docker (eller Colima) og Java 21.

```bash
# 1. Bygg backend JAR
cd backend && ./gradlew shadowJar && cd ..

# 2. Start alt
docker compose up --build
```

Tjenestene starter i rekkefolge (postgres -> backend -> frontend):

| Tjeneste | URL |
|----------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8080 |
| Helsestatus | http://localhost:8080/health |
| Admin-panel | http://localhost:3000/admin |

Stopp alt:

```bash
docker compose down        # beholder data
docker compose down -v     # sletter database-volum
```

## Lokal utvikling

### Forutsetninger

- Java 21 (via [SDKMAN](https://sdkman.io): `sdk install java 21.0.5-tem`)
- Node.js 24+ (via [nvm](https://github.com/nvm-sh/nvm))
- Docker (for PostgreSQL) — Colima fungerer som alternativ til Docker Desktop

### 1. Start databasen

```bash
docker compose up postgres -d
```

### 2. Start backend

```bash
cd backend
./gradlew run
```

Backend kjorer pa http://localhost:8080. Flyway kjorer migrasjoner og seeder data automatisk ved oppstart.

### 3. Start frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend kjorer pa http://localhost:3000.

## API-endepunkter

### Offentlige (ingen autentisering)

| Metode | Sti | Beskrivelse |
|--------|-----|-------------|
| GET | `/api/age-categories` | Alle alderskategorier |
| GET | `/api/packages` | Alle pakker (filter: `?type=BASE`, `?ageCategoryId=1`) |
| GET | `/api/packages/{id}` | Enkeltpakke med produkter |
| GET | `/api/products` | Alle produkter (filter: `?ageCategoryId=1`) |
| GET | `/api/products/{id}` | Enkeltprodukt |
| GET | `/health` | Helsestatus |

### Autentisering

| Metode | Sti | Beskrivelse |
|--------|-----|-------------|
| POST | `/api/auth/register` | Registrer ny bruker |
| POST | `/api/auth/login` | Logg inn, returnerer JWT-token |

### Bruker (krever JWT)

| Metode | Sti | Beskrivelse |
|--------|-----|-------------|
| GET | `/api/users/me` | Innlogget brukers profil |
| PUT | `/api/users/me/address` | Oppdater leveringsadresse |
| GET | `/api/children` | Liste over barn |
| POST | `/api/children` | Legg til barn |
| GET | `/api/children/{id}` | Hent barn |
| PUT | `/api/children/{id}` | Oppdater barn |
| DELETE | `/api/children/{id}` | Slett barn |
| GET | `/api/subscriptions` | Brukerens abonnementer |
| POST | `/api/subscriptions` | Opprett abonnement (krever adresse) |
| GET | `/api/subscriptions/{id}` | Abonnementdetaljer |
| PUT | `/api/subscriptions/{id}/cancel` | Kanseller abonnement |
| GET | `/api/orders` | Brukerens bestillinger |

### Admin (krever ADMIN-rolle)

| Metode | Sti | Beskrivelse |
|--------|-----|-------------|
| GET | `/api/admin/stats` | Dashboard-statistikk |
| GET/POST | `/api/admin/products` | Produkter (liste/opprett) |
| PUT/DELETE | `/api/admin/products/{id}` | Produkt (oppdater/slett) |
| GET/POST | `/api/admin/packages` | Pakker (liste/opprett) |
| PUT/DELETE | `/api/admin/packages/{id}` | Pakke (oppdater/slett) |
| PUT | `/api/admin/packages/{id}/products` | Tilknytt produkter til pakke |
| GET | `/api/admin/subscriptions` | Alle abonnementer (filter: `?status=ACTIVE`) |
| PUT | `/api/admin/subscriptions/{id}/status` | Endre abonnementstatus |
| GET | `/api/admin/users` | Alle brukere |
| GET | `/api/admin/users/{id}` | Brukerdetaljer med barn og abonnementer |
| PUT | `/api/admin/users/{id}/role` | Endre brukerrolle |
| GET | `/api/admin/orders` | Alle bestillinger (filter: `?status=PENDING`) |
| PUT | `/api/admin/orders/{id}/status` | Endre ordrestatus, sporingsnr, notat |

## Frontend-sider

| Sti | Beskrivelse | Type |
|-----|-------------|------|
| `/` | Landingsside | Offentlig |
| `/pakker` | Pakkeoversikt | Offentlig (SSR) |
| `/pakker/[id]` | Pakkedetaljer | Offentlig (SSR) |
| `/produkter` | Produktkatalog med aldersfilter | Offentlig (SSR) |
| `/logg-inn` | Innlogging | Offentlig |
| `/registrer` | Registrering | Offentlig |
| `/onboarding` | 4-stegs veiviser (barn, pakke, tillegg, bekreft + adresse) | Innlogget |
| `/dashboard` | Min side: abonnementer, bestillinger, adresse, fasebytte-forslag | Innlogget |
| `/abonnement/[id]` | Abonnementdetaljer + kansellering | Innlogget |
| `/admin` | Admin-dashboard med statistikk | Admin |
| `/admin/produkter` | Produktstyring (CRUD) | Admin |
| `/admin/pakker` | Pakkestyring (CRUD + produkttilknytning) | Admin |
| `/admin/abonnementer` | Abonnementsoversikt | Admin |
| `/admin/kunder` | Kundeoversikt + rolleendring | Admin |
| `/admin/ordrer` | Ordrekø med statusfilter, sporing, notater | Admin |

## Prosjektstruktur

```
babypakka.no/
├── backend/                          # Kotlin Micronaut 4
│   ├── Dockerfile                    # Runtime-only (pre-bygd JAR)
│   ├── Dockerfile.ci                 # Multi-stage (for CI)
│   └── src/main/kotlin/no/babypakka/
│       ├── Application.kt           # Entry point
│       ├── controllers/              # 12 REST-kontrollere
│       ├── domain/                   # Entiteter, repositories, DTOer
│       ├── services/                 # 8 tjenester
│       └── system/                   # Auth, helse, konfig-logging
├── frontend/                         # Next.js 16 + Tailwind v4
│   ├── Dockerfile                    # Multi-stage Next.js bygg
│   └── src/
│       ├── app/                      # 16 sider (App Router)
│       ├── components/               # Header, Footer, PackageCard, ProductCard
│       ├── context/                  # AuthContext (JWT)
│       ├── lib/                      # API-klient
│       └── types/                    # TypeScript-typer
├── docker-compose.yml                # Full stack (postgres -> backend -> frontend)
├── .github/workflows/ci.yml         # GitHub Actions CI
├── design.md                         # Implementasjonsplan
├── infrastructure.md                 # AWS-infrastrukturplan
└── README.md
```

## Testbrukere

| E-post | Passord | Rolle |
|--------|---------|-------|
| test@babypakka.no | passord123 | USER |
| admin@babypakka.no | passord123 | ADMIN |

Testbrukeren har 1 barn (Lille Emma) og 2 aktive abonnementer fra seed-data.

## Seed-data

Databasen populeres automatisk med:

- 4 alderskategorier (Nyfodt 0-3 mnd, Spedbarn 3-6 mnd, Krabber 6-12 mnd, Smabarn 1-2 ar)
- 20 produkter (babynest, baeresele, hoystol, sparkesykkel, etc.)
- 4 basispakker (en per aldersfase, 349-499 kr/mnd)
- 4 tilleggspakker (Sovnpakken, Reisepakken, Ammepakken, Aktivpakken)
- 2 testbrukere (USER + ADMIN)
- 1 barn med 2 aktive abonnementer

## Miljovariabler

### Backend

| Variabel | Standard | Beskrivelse |
|----------|----------|-------------|
| `DATASOURCE_URL` | `jdbc:postgresql://localhost:5432/babypakka` | Database-URL |
| `DATASOURCE_USERNAME` | `babypakka` | Database-bruker |
| `DATASOURCE_PASSWORD` | `babypakka_dev` | Database-passord |
| `JWT_GENERATOR_SIGNATURE_SECRET` | dev-secret | JWT-signeringsnokkel |

### Frontend

| Variabel | Standard | Beskrivelse |
|----------|----------|-------------|
| `API_URL` | `http://localhost:8080` | Backend API-URL (server-side, runtime) |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8080` | Backend API-URL (klient-side, build-time) |

**Viktig:** `NEXT_PUBLIC_API_URL` bakes inn i klient-side JavaScript ved bygging. I Docker brukes `API_URL=http://backend:8080` for SSR, mens `NEXT_PUBLIC_API_URL=http://localhost:8080` for nettleseren.

## CI/CD

GitHub Actions kjorer automatisk ved push og pull request:

- **Backend**: Bygg + test med Gradle (PostgreSQL service container)
- **Frontend**: Lint + bygg med npm
- **Integration** (kun main): Docker Compose opp, verifiser helse + API + frontend

## Neste steg

- Infrastruktur med Terraform (se `infrastructure.md`)
- Sprint 4: Polish (responsiv design, loading-skjeletter, feilhandtering, SEO)
- Google OAuth-innlogging
- Automatisk fasebytte-deteksjon
