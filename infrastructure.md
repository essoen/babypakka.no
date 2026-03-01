# Babypakka.no — AWS Infrastructure Plan

> **Status**: Plan ferdig. Terraform-implementering er neste steg (Sprint 6).
> Start med Option A (MVP, ~$60-95/mo). Se [Terraform Module Structure](#terraform-module-structure) for filstruktur.

## Table of Contents

- [Overview](#overview)
- [Key Design Decisions](#key-design-decisions)
- [Option A: Simple & Cheap (MVP)](#option-a-simple--cheap-mvp)
- [Option B: Production-Ready (Scaling)](#option-b-production-ready-scaling)
- [Cross-Cutting Concerns](#cross-cutting-concerns)
- [Terraform Module Structure](#terraform-module-structure)
- [Migration Path: A to B](#migration-path-a-to-b)
- [Appendix: Decision Log](#appendix-decision-log)

---

## Overview

Babypakka.no is a Norwegian B2C baby equipment subscription service at MVP stage. The application consists of:

| Component | Technology | Port | Docker Image |
|-----------|-----------|------|-------------|
| Frontend | Next.js (App Router, SSR + static, standalone output) | 3000 | `node:24-alpine` runtime, `server.js` |
| Backend | Kotlin Micronaut (REST API, JPA/Hibernate, Flyway) | 8080 | `eclipse-temurin:21-jre-alpine`, fat JAR |
| Database | PostgreSQL 16 | 5432 | — (managed) |

Both Docker images are already production-optimized (multi-stage builds, non-root users, minimal runtimes).

### Guiding Principles

1. **Align with team conventions** — SSM Parameter Store for config, ECR for images, similar patterns to trafficinfo-baseline-micronaut
2. **Budget-conscious** — MVP should cost under $100/mo
3. **Clear growth path** — Option A should be evolvable to Option B without a full rewrite
4. **Norwegian data residency** — Use `eu-north-1` (Stockholm) as the primary region

---

## Key Design Decisions

### Next.js SSR: Fargate vs Lambda@Edge vs Amplify

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **ECS Fargate** | Full control, same container locally and in prod, predictable behavior, no cold starts | Slightly more expensive at low traffic, more to configure | **Recommended for both options** |
| **Lambda@Edge / Lambda@URL** | Pay-per-request, scales to zero | Cold starts (bad for SSR UX), 50MB deployment limit, limited runtime control, complex debugging, Next.js middleware limitations | Not recommended |
| **AWS Amplify Hosting** | Zero config, built-in CI/CD, free tier | Vendor lock-in, limited customization, opaque build process, harder to debug SSR issues, less alignment with team's ECS/Fargate patterns | Acceptable fallback for Option A |

**Decision**: ECS Fargate for both options. The standalone Next.js output (`server.js`) runs as a simple Node process in a container — identical behavior locally and in prod. The team is already familiar with ECS patterns from the baseline project.

### Database: RDS vs Aurora Serverless

| Option | Pros | Cons | Monthly Cost |
|--------|------|------|-------------|
| **RDS PostgreSQL (db.t4g.micro)** | Cheapest, simple, predictable cost | Manual scaling, single-AZ in Option A | ~$15/mo (single-AZ) |
| **RDS PostgreSQL (db.t4g.small, Multi-AZ)** | Still affordable, HA | Higher cost | ~$50/mo |
| **Aurora Serverless v2** | Auto-scales, Multi-AZ, scales to 0.5 ACU | Minimum ~$43/mo even idle, complex pricing | ~$43-200/mo |
| **Aurora Provisioned** | Best performance, full Aurora features | Overkill for MVP | ~$60+/mo |

**Decision**: RDS PostgreSQL `db.t4g.micro` for Option A (cheapest, sufficient for MVP). RDS PostgreSQL `db.t4g.small` Multi-AZ for Option B. Aurora Serverless v2 only makes sense if traffic patterns are highly unpredictable — a B2C subscription service has relatively steady load, making RDS more cost-effective.

### CDN Strategy

- **CloudFront** in front of the ALB for both frontend and API
- Next.js static assets (`/_next/static/*`, `/public/*`) get aggressive caching (`Cache-Control: public, max-age=31536000, immutable`)
- SSR pages pass through to Fargate with short/no cache
- API requests (`/api/*`) pass through uncached to the backend
- This is the same architecture regardless of Option A or B

### Secrets Management

Aligned with the baseline project's SSM Parameter Store pattern:

```
/babypakka/prod/db/host
/babypakka/prod/db/username
/babypakka/prod/db/password        ← SecureString
/babypakka/prod/jwt/secret         ← SecureString
/babypakka/prod/next/api-url
```

The ECS task definition references these via `secrets` (for SecureString) and `environment` (for plain values). Micronaut natively supports environment variable injection, and the Dockerfile already uses `NEXT_PUBLIC_API_URL` as a build arg.

---

## Option A: Simple & Cheap (MVP)

### Architecture Diagram

```
                         ┌─────────────────┐
                         │   Route 53       │
                         │ babypakka.no     │
                         └────────┬────────┘
                                  │
                         ┌────────▼────────┐
                         │   CloudFront     │
                         │   Distribution   │
                         │   (ACM cert)     │
                         └────────┬────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    │ /_next/*    │ /*           │ /api/*
                    │ /public/*   │ (SSR)        │
                    │             │              │
                    │  S3 bucket  │              │
                    │  (static    │              │
                    │   assets)   │              │
                    │  [optional] │              │
                    │             │              │
                    └─────────────┼──────────────┘
                                  │
                         ┌────────▼────────┐
                         │   ALB            │
                         │   (public)       │
                         │   :443 → :3000   │
                         │   :443 → :8080   │
                         └────────┬────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    │                             │
           ┌────────▼────────┐          ┌────────▼────────┐
           │  ECS Fargate     │          │  ECS Fargate     │
           │  Frontend        │          │  Backend         │
           │  (1 task, 0.25   │          │  (1 task, 0.25   │
           │   vCPU, 512MB)   │          │   vCPU, 512MB)   │
           └──────────────────┘          └────────┬────────┘
                                                  │
                                         ┌────────▼────────┐
                                         │  RDS PostgreSQL  │
                                         │  db.t4g.micro    │
                                         │  Single-AZ       │
                                         │  20GB gp3        │
                                         └─────────────────┘

           ┌──────────────┐    ┌──────────────┐
           │  ECR          │    │  SSM          │
           │  (2 repos)    │    │  Parameter    │
           └──────────────┘    │  Store        │
                               └──────────────┘
```

### AWS Services

| Service | Configuration | Purpose | Est. Monthly Cost |
|---------|-------------|---------|-------------------|
| **ECS Fargate** (frontend) | 1 task, 0.25 vCPU, 512MB | Next.js SSR server | ~$9 |
| **ECS Fargate** (backend) | 1 task, 0.25 vCPU, 512MB | Micronaut API | ~$9 |
| **ALB** | 1 ALB, 2 target groups | Route traffic to frontend/backend | ~$22 |
| **RDS PostgreSQL** | db.t4g.micro, 20GB gp3, single-AZ | Database | ~$15 |
| **ECR** | 2 repositories | Store Docker images | ~$1 |
| **CloudFront** | 1 distribution | CDN, SSL termination | ~$1 (low traffic) |
| **Route 53** | 1 hosted zone | DNS | ~$0.50 |
| **ACM** | 2 certs (CloudFront in us-east-1, ALB in eu-north-1) | SSL/TLS | Free |
| **SSM Parameter Store** | ~10 parameters | Configuration & secrets | Free |
| **CloudWatch** | Basic logs & metrics | Monitoring | ~$3 |
| **VPC** | 1 VPC, 2 public subnets, 2 private subnets, 1 NAT Gateway | Networking | ~$33 |
| | | **Total** | **~$93/mo** |

> **Cost optimization note**: The NAT Gateway ($33/mo) is the single largest cost item. Alternatives:
> - **NAT Instance** (t4g.nano): ~$4/mo — good trade-off for MVP
> - **VPC endpoints for ECR/SSM/CloudWatch** + public subnets for Fargate: $0 but less secure
> - Using a NAT Instance reduces the total to **~$64/mo**

### Key Configuration

**ALB Routing Rules:**
```
Host: babypakka.no
  Path: /api/*         → Backend target group (:8080)
  Path: /swagger/*     → Backend target group (:8080)
  Path: /health/*      → Backend target group (:8080)
  Path: /*             → Frontend target group (:3000)
```

**CloudFront Behaviors:**
```
Origin: ALB (babypakka.no)
  Behavior 1: /_next/static/* → Cache (TTL 365 days, immutable)
  Behavior 2: /api/*          → No cache, forward all headers/cookies
  Behavior 3: /* (default)    → Short cache or no cache (SSR)
```

**ECS Task Definition (Backend):**
```json
{
  "containerDefinitions": [{
    "name": "backend",
    "image": "<account>.dkr.ecr.eu-north-1.amazonaws.com/babypakka-backend:latest",
    "portMappings": [{ "containerPort": 8080 }],
    "environment": [
      { "name": "DATASOURCES_DEFAULT_URL", "value": "jdbc:postgresql://<rds-endpoint>:5432/babypakka" }
    ],
    "secrets": [
      { "name": "DATASOURCES_DEFAULT_USERNAME", "valueFrom": "/babypakka/prod/db/username" },
      { "name": "DATASOURCES_DEFAULT_PASSWORD", "valueFrom": "/babypakka/prod/db/password" },
      { "name": "JWT_GENERATOR_SIGNATURE_SECRET", "valueFrom": "/babypakka/prod/jwt/secret" }
    ],
    "logConfiguration": {
      "logDriver": "awslogs",
      "options": {
        "awslogs-group": "/ecs/babypakka-backend",
        "awslogs-region": "eu-north-1"
      }
    },
    "healthCheck": {
      "command": ["CMD-SHELL", "curl -f http://localhost:8080/health || exit 1"]
    }
  }],
  "cpu": "256",
  "memory": "512"
}
```

**ECS Task Definition (Frontend):**
```json
{
  "containerDefinitions": [{
    "name": "frontend",
    "image": "<account>.dkr.ecr.eu-north-1.amazonaws.com/babypakka-frontend:latest",
    "portMappings": [{ "containerPort": 3000 }],
    "environment": [
      { "name": "HOSTNAME", "value": "0.0.0.0" },
      { "name": "PORT", "value": "3000" }
    ],
    "healthCheck": {
      "command": ["CMD-SHELL", "wget -q -O /dev/null http://localhost:3000/ || exit 1"]
    }
  }],
  "cpu": "256",
  "memory": "512"
}
```

> **Note on `NEXT_PUBLIC_API_URL`:** This is a build-time variable baked into the frontend bundle (line 14 of the Dockerfile). For production, the frontend Docker build must be run with `--build-arg NEXT_PUBLIC_API_URL=https://babypakka.no` so that client-side API calls go through CloudFront. Server-side API calls (SSR `fetch`) should use an internal URL to the backend via the ALB or service discovery.

### Estimated Monthly Cost Range: **$60 – $95 USD**

---

## Option B: Production-Ready (Scaling)

### Architecture Diagram

```
                              ┌──────────────────┐
                              │    Route 53       │
                              │  babypakka.no     │
                              │  api.babypakka.no │
                              └────────┬─────────┘
                                       │
                              ┌────────▼─────────┐
                              │    CloudFront     │
                              │    Distribution   │
                              │  ┌─────────────┐  │
                              │  │ WAF v2       │  │
                              │  │ (rate limit, │  │
                              │  │  geo-block)  │  │
                              │  └─────────────┘  │
                              └────────┬─────────┘
                                       │
                    ┌──────────────────┬┴───────────────────┐
                    │                  │                     │
              /_next/static/*    /* (SSR, pages)       /api/*
              /images/*                │                     │
                    │                  │                     │
              ┌─────▼─────┐           │                     │
              │  S3 Bucket │           │                     │
              │  (static)  │           │                     │
              └────────────┘           │                     │
                                       │                     │
                              ┌────────▼─────────┐          │
                              │  Public ALB       │          │
                              │  (frontend)       │          │
                              │  :443             │          │
                              └────────┬─────────┘          │
                                       │                     │
            ┌──────────────────────────┐│     ┌──────────────▼──────────┐
            │       VPC (10.0.0.0/16)  ││     │                         │
            │                          ││     │                         │
            │  ┌─ Public Subnets ─────┐││     │  ┌─ Public Subnets ──┐ │
            │  │  NAT Gateway (x2)    │││     │  │  Internal ALB     │ │
            │  │  ALBs                │││     │  │  (backend)        │ │
            │  └──────────────────────┘││     │  └────────┬─────────┘ │
            │                          ││     │           │           │
            │  ┌─ Private Subnets ────┐││     │  ┌───────▼──────────┐│
            │  │                      │◄┘     │  │                  ││
            │  │  ┌────────────────┐  │       │  │  ┌────────────┐ ││
            │  │  │ ECS Fargate    │  │       │  │  │ ECS Fargate│ ││
            │  │  │ Frontend       │  │       │  │  │ Backend    │ ││
            │  │  │ Service        │  │       │  │  │ Service    │ ││
            │  │  │ (2-6 tasks)    │  │       │  │  │ (2-4 tasks)│ ││
            │  │  │ Auto Scaling   │  │       │  │  │ Auto Scale │ ││
            │  │  └────────────────┘  │       │  │  └─────┬──────┘ ││
            │  │                      │       │  │        │        ││
            │  │  ┌────────────────┐  │       │  └────────┼────────┘│
            │  │  │ RDS PostgreSQL │  │       │           │         │
            │  │  │ db.t4g.small   │  │       └───────────┼─────────┘
            │  │  │ Multi-AZ       │◄─┼───────────────────┘
            │  │  │ 50GB gp3       │  │
            │  │  │ Auto backup    │  │
            │  │  └────────────────┘  │
            │  │                      │
            │  └──────────────────────┘
            └──────────────────────────┘

  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐ ┌──────────┐
  │  ECR     │ │  SSM     │ │ CloudWatch│ │  Cognito     │ │ S3       │
  │ (2 repos)│ │ Param    │ │ Logs +   │ │ (user auth,  │ │ (backups,│
  │          │ │ Store    │ │ Alarms + │ │  future)     │ │  assets) │
  │          │ │          │ │ Dashboard│ │              │ │          │
  └──────────┘ └──────────┘ └──────────┘ └──────────────┘ └──────────┘
```

### AWS Services

| Service | Configuration | Purpose | Est. Monthly Cost |
|---------|-------------|---------|-------------------|
| **ECS Fargate** (frontend) | 2-6 tasks, 0.5 vCPU, 1GB each, auto-scaling | Next.js SSR | ~$36-108 |
| **ECS Fargate** (backend) | 2-4 tasks, 0.5 vCPU, 1GB each, auto-scaling | Micronaut API | ~$36-72 |
| **ALB** (public) | 1 ALB, frontend target group | Frontend routing | ~$22 |
| **ALB** (internal) | 1 ALB, backend target group | Backend routing (not internet-facing) | ~$22 |
| **RDS PostgreSQL** | db.t4g.small, 50GB gp3, Multi-AZ, automated backups 7d | Database | ~$50 |
| **CloudFront** | 1 distribution, multiple behaviors | CDN, caching, SSL | ~$5-20 |
| **WAF v2** | Rate limiting, geo-restrictions (optional) | Security | ~$6 |
| **S3** | Static assets bucket + backup bucket | Asset hosting, DB backups | ~$2 |
| **Route 53** | 1 hosted zone, health checks | DNS | ~$2 |
| **ACM** | 2 certificates | SSL/TLS | Free |
| **SSM Parameter Store** | ~15 parameters | Config & secrets | Free |
| **CloudWatch** | Log groups, metrics, alarms, dashboard | Monitoring | ~$10 |
| **NAT Gateway** | 2 (one per AZ) | Private subnet internet access | ~$66 |
| **Cognito** (future) | User pool | Auth (replaces JWT) | Pay-per-MAU |
| **ECR** | 2 repositories, lifecycle policies | Image storage | ~$2 |
| | | **Total (baseline, 2 tasks each)** | **~$260/mo** |
| | | **Total (scaled, 4-6 tasks)** | **~$380/mo** |

### Key Configuration Differences from Option A

**Auto-Scaling Policy (Backend):**
```hcl
resource "aws_appautoscaling_target" "backend" {
  service_namespace  = "ecs"
  resource_id        = "service/babypakka/backend"
  scalable_dimension = "ecs:service:DesiredCount"
  min_capacity       = 2
  max_capacity       = 4
}

resource "aws_appautoscaling_policy" "backend_cpu" {
  name               = "backend-cpu-scaling"
  service_namespace  = "ecs"
  resource_id        = aws_appautoscaling_target.backend.resource_id
  scalable_dimension = aws_appautoscaling_target.backend.scalable_dimension
  policy_type        = "TargetTrackingScaling"

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
    target_value       = 70.0
    scale_in_cooldown  = 300
    scale_out_cooldown = 60
  }
}
```

**Internal ALB for Backend (Option B):**

In Option B, the backend ALB is internal (not internet-facing). API requests flow:

```
Client → CloudFront → Internal ALB → Fargate Backend
```

CloudFront uses a custom origin with the internal ALB's DNS name. This means the backend is never directly exposed to the internet. CloudFront adds a custom header (e.g., `X-Origin-Verify: <secret>`) that the ALB validates, preventing direct access.

**CloudWatch Alarms:**
```
- ECS CPU > 80% for 5 minutes → SNS → email/Slack
- ECS Memory > 85% for 5 minutes → SNS
- RDS CPU > 80% for 10 minutes → SNS
- RDS Free Storage < 5GB → SNS
- ALB 5xx error rate > 5% for 3 minutes → SNS
- ALB target response time p95 > 2s → SNS
- RDS connections > 80% of max → SNS
```

**ECS Service Discovery (Cloud Map):**

For service-to-service communication (frontend SSR calling backend API), use AWS Cloud Map:

```
backend.babypakka.local:8080  →  resolves to Fargate task IPs
```

This allows the Next.js server-side code to call the backend via a private DNS name without going through the public ALB.

### Estimated Monthly Cost Range: **$260 – $380 USD**

---

## Cross-Cutting Concerns

### Domain & DNS (Route 53)

```
babypakka.no              A     ALIAS → CloudFront distribution
www.babypakka.no          A     ALIAS → CloudFront (redirect to apex)
```

> **Note**: `babypakka.no` is a `.no` domain. If the domain is registered with a Norwegian registrar (e.g., Domene.shop, Domeneshop), you have two options:
> 1. Transfer DNS to Route 53 (update NS records at the registrar)
> 2. Keep DNS at the registrar and point CNAME to CloudFront (but CNAME on apex domain requires ALIAS support)
>
> **Recommendation**: Use Route 53 for DNS hosting (update NS records at the registrar). This gives you ALIAS records, health checks, and tight integration with ACM validation.

### SSL/TLS (ACM)

Two certificates are needed:
1. **`us-east-1`**: `*.babypakka.no` and `babypakka.no` — required by CloudFront (CloudFront only supports certs in us-east-1)
2. **`eu-north-1`**: `*.babypakka.no` and `babypakka.no` — for ALB

Both use DNS validation via Route 53 (automated with Terraform `aws_acm_certificate_validation`).

### CI/CD Pipeline

Aligned with the baseline project's CircleCI approach:

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Git Push    │────▶│  CircleCI   │────▶│  Build &    │────▶│  Deploy     │
│  (main)      │     │  Trigger    │     │  Push to    │     │  ECS Update │
│              │     │             │     │  ECR        │     │  Service    │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

**CircleCI jobs:**
1. **test-backend**: `./gradlew test`
2. **test-frontend**: `npm test && npm run lint`
3. **build-backend**: Docker build → push to ECR (`babypakka-backend:<git-sha>`)
4. **build-frontend**: Docker build with `--build-arg NEXT_PUBLIC_API_URL=https://babypakka.no` → push to ECR (`babypakka-frontend:<git-sha>`)
5. **deploy**: `aws ecs update-service --force-new-deployment` (rolling update)

**Alternative**: GitHub Actions if not already using CircleCI. The pattern is identical.

### Secrets Management (SSM Parameter Store)

```
Parameter Path                              Type            Description
─────────────────────────────────────────────────────────────────────────
/babypakka/{env}/db/host                    String          RDS endpoint
/babypakka/{env}/db/port                    String          5432
/babypakka/{env}/db/name                    String          babypakka
/babypakka/{env}/db/username                SecureString    DB username
/babypakka/{env}/db/password                SecureString    DB password (generated)
/babypakka/{env}/jwt/secret                 SecureString    JWT signing secret
/babypakka/{env}/frontend/api-url           String          https://babypakka.no
/babypakka/{env}/cloudfront/origin-secret   SecureString    X-Origin-Verify header value
```

ECS task execution role needs `ssm:GetParameters` permission scoped to `/babypakka/{env}/*`.

### Monitoring & Observability

**Option A (minimal):**
- CloudWatch Logs for ECS tasks (auto via `awslogs` driver)
- CloudWatch Container Insights (basic ECS metrics)
- RDS Performance Insights (free tier: 7 days retention)

**Option B (comprehensive):**
- Everything in Option A, plus:
- CloudWatch Alarms (CPU, memory, error rates, latency)
- CloudWatch Dashboard (single pane of glass)
- SNS topic for alerts → email or Slack webhook via Lambda
- X-Ray tracing (optional, Micronaut has X-Ray SDK support)
- CloudWatch Logs Insights for log queries

### Network Architecture

```
VPC: 10.0.0.0/16 (eu-north-1)

┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Public Subnets                                             │
│  ┌────────────────────────┐  ┌────────────────────────┐     │
│  │ 10.0.1.0/24 (eu-n-1a) │  │ 10.0.2.0/24 (eu-n-1b) │     │
│  │ ALB, NAT GW            │  │ ALB, NAT GW (Opt B)   │     │
│  └────────────────────────┘  └────────────────────────┘     │
│                                                             │
│  Private Subnets (Application)                              │
│  ┌────────────────────────┐  ┌────────────────────────┐     │
│  │ 10.0.10.0/24 (eu-n-1a)│  │ 10.0.11.0/24 (eu-n-1b)│     │
│  │ ECS Fargate tasks      │  │ ECS Fargate tasks      │     │
│  └────────────────────────┘  └────────────────────────┘     │
│                                                             │
│  Private Subnets (Database)                                 │
│  ┌────────────────────────┐  ┌────────────────────────┐     │
│  │ 10.0.20.0/24 (eu-n-1a)│  │ 10.0.21.0/24 (eu-n-1b)│     │
│  │ RDS primary            │  │ RDS standby (Opt B)    │     │
│  └────────────────────────┘  └────────────────────────┘     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Security Groups:**

| SG Name | Inbound | Source |
|---------|---------|--------|
| `sg-alb` | 443 (HTTPS) | 0.0.0.0/0 (or CloudFront prefix list) |
| `sg-frontend` | 3000 | `sg-alb` |
| `sg-backend` | 8080 | `sg-alb` + `sg-frontend` |
| `sg-database` | 5432 | `sg-backend` |

---

## Terraform Module Structure

```
infrastructure/
├── environments/
│   ├── dev/
│   │   ├── main.tf              # Module calls with dev values
│   │   ├── variables.tf
│   │   ├── terraform.tfvars     # Dev-specific values
│   │   └── backend.tf           # S3 backend for state
│   ├── staging/
│   │   └── ...                  # Same structure
│   └── prod/
│       ├── main.tf
│       ├── variables.tf
│       ├── terraform.tfvars
│       └── backend.tf
│
├── modules/
│   ├── networking/
│   │   ├── main.tf              # VPC, subnets, NAT, IGW, route tables
│   │   ├── variables.tf
│   │   ├── outputs.tf           # vpc_id, subnet_ids, sg_ids
│   │   └── README.md
│   │
│   ├── ecr/
│   │   ├── main.tf              # ECR repositories, lifecycle policies
│   │   ├── variables.tf
│   │   └── outputs.tf           # repository_urls
│   │
│   ├── ecs/
│   │   ├── main.tf              # ECS cluster, services, task defs
│   │   ├── iam.tf               # Task role, execution role
│   │   ├── autoscaling.tf       # App auto-scaling (Option B)
│   │   ├── variables.tf
│   │   └── outputs.tf
│   │
│   ├── alb/
│   │   ├── main.tf              # ALB, listeners, target groups, rules
│   │   ├── variables.tf
│   │   └── outputs.tf           # alb_dns_name, target_group_arns
│   │
│   ├── database/
│   │   ├── main.tf              # RDS instance, subnet group, param group
│   │   ├── variables.tf
│   │   └── outputs.tf           # endpoint, port
│   │
│   ├── cdn/
│   │   ├── main.tf              # CloudFront distribution, behaviors
│   │   ├── variables.tf
│   │   └── outputs.tf           # distribution_domain_name
│   │
│   ├── dns/
│   │   ├── main.tf              # Route 53 hosted zone, records
│   │   ├── acm.tf               # ACM certificates (both regions)
│   │   ├── variables.tf
│   │   └── outputs.tf
│   │
│   ├── secrets/
│   │   ├── main.tf              # SSM parameters
│   │   ├── variables.tf
│   │   └── outputs.tf
│   │
│   └── monitoring/
│       ├── main.tf              # CloudWatch log groups, alarms, dashboard
│       ├── sns.tf               # Alert topics
│       ├── variables.tf
│       └── outputs.tf
│
├── scripts/
│   ├── init-state-bucket.sh     # Create S3 bucket + DynamoDB for TF state
│   └── deploy.sh                # Helper for ECS deployments
│
└── README.md
```

**Example `environments/prod/main.tf`:**

```hcl
terraform {
  required_version = ">= 1.5"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "eu-north-1"
  default_tags {
    tags = {
      Project     = "babypakka"
      Environment = "prod"
      ManagedBy   = "terraform"
    }
  }
}

# Separate provider for CloudFront ACM cert (must be us-east-1)
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
}

module "networking" {
  source = "../../modules/networking"

  project_name     = "babypakka"
  environment      = "prod"
  vpc_cidr         = "10.0.0.0/16"
  azs              = ["eu-north-1a", "eu-north-1b"]
  use_nat_instance = false  # true for Option A to save cost
}

module "ecr" {
  source = "../../modules/ecr"

  project_name = "babypakka"
  repositories = ["frontend", "backend"]
}

module "database" {
  source = "../../modules/database"

  project_name       = "babypakka"
  environment        = "prod"
  instance_class     = "db.t4g.micro"     # db.t4g.small for Option B
  multi_az           = false               # true for Option B
  allocated_storage  = 20                  # 50 for Option B
  vpc_id             = module.networking.vpc_id
  subnet_ids         = module.networking.database_subnet_ids
  allowed_sg_ids     = [module.ecs.backend_sg_id]
}

module "alb" {
  source = "../../modules/alb"

  project_name = "babypakka"
  environment  = "prod"
  vpc_id       = module.networking.vpc_id
  subnet_ids   = module.networking.public_subnet_ids
  certificate_arn = module.dns.regional_certificate_arn
}

module "ecs" {
  source = "../../modules/ecs"

  project_name = "babypakka"
  environment  = "prod"
  vpc_id       = module.networking.vpc_id
  subnet_ids   = module.networking.private_subnet_ids

  frontend_image     = "${module.ecr.repository_urls["frontend"]}:latest"
  frontend_cpu       = 256
  frontend_memory    = 512
  frontend_desired   = 1    # 2 for Option B

  backend_image      = "${module.ecr.repository_urls["backend"]}:latest"
  backend_cpu        = 256
  backend_memory     = 512
  backend_desired    = 1    # 2 for Option B

  alb_frontend_tg_arn = module.alb.frontend_target_group_arn
  alb_backend_tg_arn  = module.alb.backend_target_group_arn

  enable_autoscaling = false  # true for Option B

  ssm_parameter_prefix = "/babypakka/prod"
}

module "cdn" {
  source = "../../modules/cdn"

  project_name    = "babypakka"
  domain_names    = ["babypakka.no", "www.babypakka.no"]
  alb_domain_name = module.alb.dns_name
  certificate_arn = module.dns.cloudfront_certificate_arn  # us-east-1

  providers = {
    aws = aws.us_east_1
  }
}

module "dns" {
  source = "../../modules/dns"

  domain_name              = "babypakka.no"
  cloudfront_domain_name   = module.cdn.distribution_domain_name
  cloudfront_hosted_zone_id = module.cdn.distribution_hosted_zone_id

  providers = {
    aws.us_east_1 = aws.us_east_1
  }
}

module "secrets" {
  source = "../../modules/secrets"

  project_name = "babypakka"
  environment  = "prod"
  db_endpoint  = module.database.endpoint
}

module "monitoring" {
  source = "../../modules/monitoring"

  project_name     = "babypakka"
  environment      = "prod"
  ecs_cluster_name = module.ecs.cluster_name
  alert_email      = "drift@babypakka.no"
}
```

---

## Migration Path: A to B

The Terraform module structure is designed so that moving from Option A to Option B is a parameter change, not a rewrite:

| Change | Terraform Variable |
|--------|-------------------|
| Single task → multiple tasks | `frontend_desired = 2`, `backend_desired = 2` |
| Enable auto-scaling | `enable_autoscaling = true` |
| Single-AZ → Multi-AZ DB | `multi_az = true` |
| Bigger DB instance | `instance_class = "db.t4g.small"` |
| NAT Instance → NAT Gateway | `use_nat_instance = false` |
| Add WAF | `enable_waf = true` (new module) |
| Add internal ALB | `use_internal_alb = true` |
| More storage | `allocated_storage = 50` |

**Recommended migration order:**

1. Multi-AZ on RDS (protects data first)
2. Scale to 2 tasks per service (eliminates SPOF)
3. Switch from NAT Instance to NAT Gateway (reliability)
4. Enable auto-scaling (handles traffic spikes)
5. Add WAF, monitoring alarms, dashboards (operational maturity)

---

## Appendix: Decision Log

### Why not Amplify for the frontend?

Amplify Hosting would deploy the Next.js app with zero config and includes a generous free tier. However:
- The team uses ECS/Fargate patterns in their baseline project
- Amplify's SSR support uses Lambda under the hood, introducing cold starts
- Debugging SSR issues in Amplify is harder than in a container
- The frontend Dockerfile already produces a clean standalone build
- Keeping both services on ECS means one deployment model to maintain

Amplify remains a viable fallback if cost is the primary concern and the team is willing to diverge from their established patterns.

### Why not Lambda for the backend?

Micronaut supports GraalVM native images and has a Lambda runtime module. However:
- The fat JAR approach (`*-all.jar`) is already working and optimized
- JVM cold starts on Lambda would be 5-15 seconds without GraalVM
- GraalVM native compilation adds significant build complexity
- The team's baseline project uses ECS, not Lambda
- A subscription service has relatively steady traffic — Lambda's pay-per-request model doesn't save much versus always-on Fargate

### Why CloudFront even for Option A?

- SSL termination with ACM (free certificates)
- Static asset caching reduces load on Fargate
- DDoS protection (AWS Shield Standard, included free)
- Single entry point simplifies CORS and security headers
- Zero additional cost at low traffic levels
- Required foundation for Option B anyway

### Why not ECS on EC2 instead of Fargate?

A single `t4g.small` EC2 instance (~$12/mo) running both containers would be cheaper than two Fargate tasks (~$18/mo). However:
- Fargate eliminates OS patching and host management
- No need to right-size EC2 instances
- Cleaner scaling model (add tasks, not instances)
- Aligns with the baseline project's Fargate usage
- The cost difference is small ($6/mo) for meaningful operational simplification

### Cost Comparison Summary

| | Option A (NAT Instance) | Option A (NAT Gateway) | Option B (baseline) | Option B (scaled) |
|---|---|---|---|---|
| Compute | $18 | $18 | $72 | $180 |
| Networking | $26 | $55 | $112 | $112 |
| Database | $15 | $15 | $50 | $50 |
| Other | $5 | $5 | $26 | $38 |
| **Total** | **~$64** | **~$93** | **~$260** | **~$380** |
