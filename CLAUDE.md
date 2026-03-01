# Babypakka.no — Project Memory

## Goal

Build **Babypakka.no** — a Norwegian baby equipment subscription service MVP. Parents register their child's birth date and get access to age-appropriate equipment packages they rent monthly. The app has a customer portal, admin panel, order management, and full-stack architecture with Kotlin/Micronaut backend + Next.js frontend + PostgreSQL.

## Instructions

- **Design doc**: `design.md` contains the full implementation plan with all phases, data model, API endpoints, and frontend pages
- **Infrastructure doc**: `infrastructure.md` contains AWS hosting plan with 3 options (Option 0 EC2 MVP, Option A Fargate, Option B production)
- **Backend must follow conventions from** `https://github.com/nsbno/trafficinfo-baseline-micronaut` — specifically: `object Application` with `Micronaut.build().start()`, `domain/` package (entities + repos + DTOs co-located), `controllers/` and `services/` plural, `system/` package, `kotlin-logging`, `micronaut-problem-json`, `application.yml` (not .properties), startup config logger, health indicator
- **All UI text must be in Norwegian** (lang="nb")
- **Mobile-first responsive design** with a warm baby-friendly color palette (baby-blue, baby-pink, baby-cream, baby-sage, baby-warm)
- **Consumer-facing features take priority over admin panel**
- **Auth approach**: JWT bearer tokens with bcrypt password hashing. Micronaut Security's `HttpRequestAuthenticationProvider` validates credentials against the DB. Mock auth for now — supports future Google login.
- **Docker Compose must spin up everything** — the backend Dockerfile uses a pre-built JAR (run `./gradlew shadowJar` first) because Colima's VM has slow network for Gradle downloads. A `Dockerfile.ci` exists for full multi-stage builds in GitHub Actions.
- **Orchestrate subagents for parallel work** where possible
- **Fasebytte (phase change)**: No automatic backend logic. Frontend shows a suggestion banner on the dashboard when a child's current age category doesn't match their active base subscription's package name. User chooses to switch manually.
- **Orders**: Simple order queue — orders auto-created when subscriptions are created. Admin changes status (PENDING -> PACKING -> SHIPPED -> DELIVERED). No swap/return orders in MVP.
- **Address**: Optional in profile, but required when creating a subscription (validated in backend). Can be set in dashboard or during onboarding confirmation step.

## Hosting Decisions

- **MVP hosting**: Single EC2 (t4g.small, 2 vCPU, 2GB RAM) running Docker Compose — same setup as local dev. ~$14/mo.
- **SSL**: Caddy reverse proxy with auto Let's Encrypt. No CloudFront or ACM needed for MVP.
- **No RDS**: PostgreSQL runs in Docker on the EC2 instance. Daily EBS snapshots for backups.
- **No ALB, no NAT, no ECS Fargate** for MVP — all unnecessary overhead at low traffic.
- **S3 frontend rejected**: Next.js uses SSR for `/pakker`, `/produkter`, `/pakker/[id]`. Converting to static export (`output: "export"`) would lose SSR/ISR, meaning empty HTML shells with client-side fetching only — worse SEO and slower perceived load. Not worth the ~$3/mo savings when everything runs on one EC2 anyway.
- **Domain**: User manages their Norwegian .no domain themselves (registrar like Domeneshop). Points A record at EC2 Elastic IP. No Route 53 needed.
- **Infrastructure as Code**: Terraform manages EC2, VPC, security groups, EBS, Elastic IP. Separate deploy script for app updates (SSH + docker compose).
- **Migration path**: EC2 -> ECS Fargate (Option A, ~$60-95/mo) when traffic justifies it. Then Option A -> Option B ($260+/mo) for HA/auto-scaling.
- **Cost target**: ~$14/mo (EC2 $12 + EBS $2)

## Discoveries

- **Colima is used instead of Docker Desktop** (Docker Desktop install failed due to sudo). Docker socket is at `~/.colima/default/docker.sock`. Set `DOCKER_HOST=unix://$HOME/.colima/default/docker.sock` for Docker commands.
- **JPA lazy loading requires `@Transactional` + `open fun`** on service methods that access lazy collections. The service class must also be `open class` for Micronaut proxy to work.
- **Enum case mismatch was a bug**: JPA `@Enumerated(EnumType.STRING)` expects uppercase enum names. All seed data SQL uses uppercase values.
- **Backend `.dockerignore` must be restrictive**: Uses `*` + `!build/libs/*-all.jar` to avoid sending 400MB+ build context.
- **Frontend uses Tailwind CSS v4** with `@theme inline` in `globals.css` — no `tailwind.config.ts` exists.
- **Next.js 15+ async patterns**: Both `params` and `searchParams` are typed as `Promise<...>` and must be `await`ed.
- **Frontend API client** uses `process.env.API_URL` (server runtime) with fallback to `process.env.NEXT_PUBLIC_API_URL` (build-time) then `http://localhost:8080`. In Docker, `API_URL=http://backend:8080` is set at runtime for SSR. `NEXT_PUBLIC_API_URL=http://localhost:8080` is baked at build time for browser-side JS.
- **CRITICAL**: `NEXT_PUBLIC_API_URL` must be `http://localhost:8080` (not `http://backend:8080`) because it gets inlined into client-side JavaScript. The browser cannot resolve Docker-internal hostnames. This was a bug that was fixed by changing the Dockerfile ARG default.
- **Only `'use client'` components can use auth**: All auth-related pages and the Header use `useAuth()` hook from `AuthContext`. Server components (public pages) use `fetchApi()` without auth.
- **Seed data passwords**: The original V8 seed had a generic bcrypt hash. V9 migration fixed it to match password `passord123` for both test and admin users.
- **SDKMAN Java**: Must run `source "$HOME/.sdkman/bin/sdkman-init.sh"` before any `./gradlew` commands.
- **Micronaut Data JPA**: `findAllById()` is not available. Use individual `findById()` calls with `mapNotNull` instead.
- **Micronaut Security role mapping**: In `application.yml` intercept-url-map, use `ROLE_ADMIN`. In `@Secured` annotation, use just `"ADMIN"`.
- **Micronaut serde omits null fields**: Address fields missing from JSON when null. Frontend handles with falsy checks (both null and undefined are falsy).

## Accomplished

### Sprints 1-3 + 5 — Complete
- Full database schema: 11 Flyway migrations + seed data
- Backend: 12 controllers, 8 services, 9 entities, 8 repositories, 20+ DTOs
- Frontend: 16 pages, 4 components, auth context, API client
- Docker Compose with health checks
- GitHub Actions CI
- See `design.md` for detailed breakdown per sprint

### Not started
- Sprint 4: Polish (responsive pass, loading skeletons, error boundaries, SEO meta tags)
- Sprint 6: AWS infrastructure with Terraform (Option 0: EC2 MVP)
- Future: Google OAuth login, automatic phase-change detection

## Test credentials
- **User**: `test@babypakka.no` / `passord123`
- **Admin**: `admin@babypakka.no` / `passord123`

## Key URLs (when running locally)
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- Admin panel: http://localhost:3000/admin (login as admin first)
- Health: http://localhost:8080/health
