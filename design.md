# Babypakka.no — Implementation Plan

## Status

| Sprint | Beskrivelse | Status |
|--------|-------------|--------|
| Sprint 1 | Infrastruktur + lesbar browsing (pakker, produkter, landingsside) | Ferdig |
| Sprint 2 | Brukerreise (auth, onboarding, dashboard, abonnementer) | Ferdig |
| Sprint 3 | Admin-panel (CRUD for produkter, pakker, abonnementer, kunder) | Ferdig |
| Sprint 5 | Bestillinger + adresser | Ferdig |
| Sprint 4 | Polish (responsiv design, loading, feilhandtering, SEO) | Ikke startet |
| Sprint 6 | AWS-infrastruktur med Terraform | Ikke startet |

---

## Tech Stack

| Lag | Teknologi |
|-----|-----------|
| Frontend | Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 |
| Backend | Kotlin (Micronaut 4) + Micronaut Data JPA |
| Database | PostgreSQL 16 (Docker container) |
| Migrasjoner | Flyway |
| Auth | JWT (Micronaut Security) + bcrypt — forenklet for MVP |
| Infrastruktur | Docker Compose (lokal), AWS ECS Fargate (prod, planlagt) |
| Admin | Integrert i samme Next.js-app under `/admin`-ruter |

---

## Sprint 1: Infrastruktur + Lesbar Browsing (FERDIG)

### Miljo
- JDK 21 via SDKMAN, Node.js 24, Docker CLI + Colima
- PostgreSQL 16 i Docker med health checks
- Micronaut CLI 4.10.9

### Database (Flyway-migrasjoner)
- `V1__create_users.sql` — brukertabell
- `V2__create_age_categories.sql` — alderskategorier
- `V3__create_children.sql` — barn (FK til bruker)
- `V4__create_products.sql` — produkter
- `V5__create_packages.sql` — pakker (base/addon, FK til alderskategori)
- `V6__create_package_products.sql` — mange-til-mange pakke-produkt
- `V7__create_subscriptions.sql` — abonnementer
- `V8__seed_data.sql` — 4 alderskategorier, 20 produkter, 8 pakker, testbrukere

### Backend
- 3 offentlige kontrollere (AgeCategoryController, PackageController, ProductController)
- 3 tjenester + 7 entiteter + 6 repositories + 4 DTOer
- system-pakke (helse, konfig-logging)
- application.yml med DB, CORS, sikkerhet

### Frontend
- Landingsside, pakkeoversikt, pakkedetaljer, produktkatalog med aldersfilter
- Header + Footer-komponenter
- Tailwind v4 med baby-friendly fargepalett (@theme inline i globals.css)

### Docker
- docker-compose.yml: postgres -> backend -> frontend med health checks
- Backend Dockerfile (pre-bygd JAR), Dockerfile.ci (multi-stage for CI)
- Frontend Dockerfile (standalone Next.js)
- GitHub Actions CI + README.md

---

## Sprint 2: Brukerreise (FERDIG)

### Auth
- JWT bearer tokens med bcrypt passord-hashing
- `POST /api/auth/register` og `POST /api/auth/login`
- BabypakkaAuthenticationProvider (HttpRequestAuthenticationProvider)
- BcryptPasswordEncoder

### Bruker-APIer
- `GET /api/users/me` — profil
- Barn CRUD: `GET/POST /api/children`, `GET/PUT/DELETE /api/children/{id}`
- Auto alderskategori-resolusjon basert pa fodselsdato
- Abonnementer: `GET/POST /api/subscriptions`, `GET /api/subscriptions/{id}`, `PUT /api/subscriptions/{id}/cancel`

### Frontend
- AuthContext med useAuth() hook (login, register, logout, token i localStorage)
- Sider: `/logg-inn`, `/registrer`, `/onboarding` (4-stegs veiviser), `/dashboard`, `/abonnement/[id]`
- Header viser auth-status (brukernavn, Min side, Logg ut)
- Beskyttede ruter (redirect til logg-inn)

### Fikser
- `V9__fix_seed_passwords.sql` — fikset bcrypt-hash for testbrukere (passord: `passord123`)

---

## Sprint 3: Admin-panel (FERDIG)

### Admin-endepunkter (sikret med @Secured("ADMIN"))
- Produkter: `GET/POST/PUT/DELETE /api/admin/products`
- Pakker: `GET/POST/PUT/DELETE /api/admin/packages`, `PUT /api/admin/packages/{id}/products`
- Abonnementer: `GET /api/admin/subscriptions`, `PUT /api/admin/subscriptions/{id}/status`
- Kunder: `GET /api/admin/users`, `GET /api/admin/users/{id}`, `PUT /api/admin/users/{id}/role`
- Statistikk: `GET /api/admin/stats`

### Frontend
- Admin-layout med sidebar-navigasjon + auth-guard (kun ADMIN)
- 5 admin-sider: Oversikt, Produkter, Pakker, Abonnementer, Kunder
- Rolleendring pa brukere
- "Admin"-lenke i header for admin-brukere

---

## Sprint 5: Bestillinger + Adresser (FERDIG)

### Adresse
- `V10__add_user_address.sql` — street_address, postal_code, city pa users
- `PUT /api/users/me/address` — oppdater leveringsadresse
- Adresse er valgfri i profil, men pakrevd for a opprette abonnement
- Dashboard viser adressebanner/skjema
- Onboarding har adressefelt i bekreftelsessteg

### Bestillinger
- `V11__create_orders.sql` — orders + order_items tabeller
- Order- og OrderItem-entiteter
- OrderService: oppretter ordre automatisk ved abonnementsopprettelse
- `GET /api/orders` — brukerens bestillinger
- `GET /api/admin/orders` — alle bestillinger (filter: `?status=PENDING`)
- `PUT /api/admin/orders/{id}/status` — endre status, sporingsnr, notat
- OrderStatus: PENDING -> PACKING -> SHIPPED -> DELIVERED

### Frontend
- Dashboard: "Mine bestillinger"-seksjon med status-badges, sporingsnr, produktliste
- Dashboard: Fasebytte-forslag (banner nar barns alderskategori ikke matcher basispakke)
- Admin ordrer-side: ordrekø med statusfilter, utvidbare rader, sporingsnr/notat-skjema
- Admin sidebar: 6 elementer (inkl. Ordrer)

---

## Sprint 4: Polish (IKKE STARTET)

- Responsiv design-pass — mobile-first med Tailwind breakpoints
- Loading-skjeletter pa datainnhenting
- Error boundaries og brukervennlige feilmeldinger (norsk)
- Skjemavalidering (klient-side)
- Meta-tagger / OpenGraph for SEO pa offentlige sider
- `<head>` SEO: tittel, beskrivelse per side

---

## Sprint 6: AWS-infrastruktur med Terraform (IKKE STARTET)

Se `infrastructure.md` for fullstendig plan. Implementer **Option 0** (EC2 MVP, ~$14/mo):
- VPC med 1 offentlig subnett i eu-north-1
- EC2 t4g.small (2 vCPU, 2GB RAM) med Docker Compose
- Caddy som reverse proxy med auto Let's Encrypt SSL
- EBS gp3 20GB for data + daglige snapshots
- Elastic IP for statisk IP (bruker peker A-record hit)
- Security group: 80, 443, 22
- docker-compose.prod.yml med Caddy-container
- deploy.sh for app-oppdateringer (SSH + docker compose up --build)
- Terraform-moduler: networking, compute
- Ingen RDS, ALB, CloudFront, NAT, ECS — alt kjorer pa en instans

---

## Datamodell

```
User
  - id, email, password_hash, name, role, created_at
  - street_address, postal_code, city (nullable)

Child
  - id, user_id (FK), name, birth_date, created_at

Product
  - id, name, description, image_url, condition (NEW/USED)

AgeCategory
  - id, label, min_months, max_months

Package
  - id, name, description, type (BASE/ADDON), age_category_id (FK, nullable)
  - monthly_price, challenge_tag (nullable)

PackageProduct (many-to-many)
  - package_id, product_id

Subscription
  - id, user_id (FK), child_id (FK), package_id (FK)
  - status (ACTIVE/PAUSED/CANCELLED), started_at, ended_at

Order
  - id, subscription_id (FK), user_id (FK), status (PENDING/PACKING/SHIPPED/DELIVERED)
  - shipping_address, tracking_number, note, created_at, updated_at

OrderItem
  - id, order_id (FK), product_id (FK), product_name
```

---

## Designbeslutninger

- **Fasebytte**: Ingen automatisk backend-logikk. Frontend viser et forslag-banner pa dashboard nar barnets alderskategori ikke matcher aktiv basispakke. Bruker velger selv a bytte.
- **Bestillinger**: Enkel ordrekø — ordre opprettes automatisk ved abonnementsopprettelse. Admin endrer status manuelt (PENDING -> PACKING -> SHIPPED -> DELIVERED). Ingen bytte-/returordre i MVP.
- **Adresse**: Valgfri i profil, men pakrevd for a opprette abonnement (validert i backend).
- **Auth**: JWT bearer tokens med bcrypt. Micronaut Security's HttpRequestAuthenticationProvider. Stotter fremtidig Google-innlogging.
- **Frontend API**: Server-side (SSR) bruker `API_URL` (runtime env), klient-side bruker `NEXT_PUBLIC_API_URL` (build-time). I Docker: `API_URL=http://backend:8080`, `NEXT_PUBLIC_API_URL=http://localhost:8080`.

---

## Utenfor MVP-scope

- Betalingsintegrasjon (Stripe/Vipps)
- Logistikk/frakt/returstyring
- Varsling/e-post
- Brukeranmeldelser
- Lagerhold/inventarstyring
- Chat/support
- Google OAuth (planlagt)
- Automatisk fasebytte-deteksjon (planlagt)
