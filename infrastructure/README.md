# Babypakka.no — Infrastructure (Option 0: EC2 MVP)

Single EC2 instance (`t4g.small`) running Docker Compose with Caddy for automatic SSL.
Estimated cost: **~$14/mo**.

## Architecture

```
babypakka.no (A record) → Elastic IP → EC2 t4g.small
  Caddy (:443/:80) → frontend (:3000) + backend (:8080) + postgres (:5432)
  All via Docker Compose
```

## Prerequisites

- [AWS CLI v2](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html) configured with credentials
- [Terraform >= 1.5](https://developer.hashicorp.com/terraform/downloads)
- An SSH key pair created in AWS (`eu-north-1`):
  ```bash
  aws ec2 create-key-pair --key-name babypakka-key --region eu-north-1 \
    --query 'KeyMaterial' --output text > ~/.ssh/babypakka-key.pem
  chmod 400 ~/.ssh/babypakka-key.pem
  ```

## Setup

### 1. Initialize Terraform state backend

```bash
cd infrastructure/scripts
chmod +x init-state-bucket.sh
./init-state-bucket.sh
```

This creates an S3 bucket and DynamoDB table for Terraform state locking.

### 2. Configure variables

Edit `infrastructure/environments/prod/terraform.tfvars`:

```hcl
aws_region    = "eu-north-1"
instance_type = "t4g.small"
domain_name   = "babypakka.no"
git_repo_url  = "https://github.com/your-user/babypakka.no.git"
key_pair_name = "babypakka-key"  # Your AWS key pair name
```

### 3. Deploy infrastructure

```bash
cd infrastructure/environments/prod
terraform init
terraform plan
terraform apply
```

Terraform outputs:
- `elastic_ip` — The public IP to point your domain at
- `ssh_command` — SSH command to connect
- `ssm_command` — SSM Session Manager command (alternative to SSH)

### 4. Point your domain

At your domain registrar (e.g., Domeneshop), create an A record:

```
babypakka.no  A  <elastic_ip from terraform output>
```

DNS propagation may take a few minutes. Once active, Caddy automatically provisions an SSL certificate from Let's Encrypt.

### 5. Set production secrets on the server

SSH into the instance and create a `.env` file:

```bash
ssh ec2-user@<elastic-ip>
cd app
cat > .env <<EOF
DB_PASSWORD=<strong-password>
JWT_SECRET=<random-secret>
EOF
docker compose -f docker-compose.yml -f infrastructure/docker-compose.prod.yml up -d
```

## Deploying updates

```bash
cd infrastructure/scripts
chmod +x deploy.sh
./deploy.sh              # Reads IP from terraform output
./deploy.sh 1.2.3.4      # Or provide IP directly
```

This SSHs into the EC2 instance, pulls latest code, and rebuilds containers.

## Connecting to the server

```bash
# Via SSH
ssh -i ~/.ssh/babypakka-key.pem ec2-user@13.63.113.28

# Via SSM Session Manager (no SSH key needed)
aws ssm start-session --target <instance-id> --region eu-north-1
```

## DNS management

DNS is managed via DigitalOcean (ns1/ns2/ns3.digitalocean.com), not AWS Route 53.

```bash
# List all records
doctl compute domain records list babypakka.no

# Add a record
doctl compute domain records create babypakka.no \
  --record-type TXT --record-name @ \
  --record-data "some-value" --record-ttl 300
```

Current records:
- `A @ -> 13.63.113.28` (EC2 Elastic IP)
- `CNAME www -> @`
- `TXT @ -> protonmail-verification=...` (ProtonMail email verification)

## Troubleshooting

### Caddy SSL certificate failure

If Caddy fails to obtain a Let's Encrypt certificate (e.g. DNS wasn't ready when Caddy first booted), it gets stuck retrying with failed ACME orders. Fix by clearing the ACME data and restarting:

```bash
ssh -i ~/.ssh/babypakka-key.pem ec2-user@13.63.113.28
cd /home/ec2-user/app

# Stop and remove Caddy
docker compose -f docker-compose.yml -f infrastructure/docker-compose.prod.yml stop caddy
docker compose -f docker-compose.yml -f infrastructure/docker-compose.prod.yml rm -f caddy

# Clear stale ACME data
docker volume rm app_caddy_data app_caddy_config

# Restart Caddy (will register fresh ACME account and obtain new certificate)
docker compose -f docker-compose.yml -f infrastructure/docker-compose.prod.yml up -d caddy

# Verify (wait ~20s for ACME challenge)
docker logs babypakka-caddy --tail 20
```

### Checking container status

```bash
ssh -i ~/.ssh/babypakka-key.pem ec2-user@13.63.113.28
cd /home/ec2-user/app
docker compose -f docker-compose.yml -f infrastructure/docker-compose.prod.yml ps
docker compose -f docker-compose.yml -f infrastructure/docker-compose.prod.yml logs --tail 20 <service>
```

## File structure

```
infrastructure/
├── environments/prod/     # Terraform root module
│   ├── main.tf            # Provider + module calls
│   ├── variables.tf       # Variable declarations
│   ├── terraform.tfvars   # Values (edit this)
│   ├── outputs.tf         # Outputs (IP, SSH command)
│   └── backend.tf         # S3 state backend
├── modules/
│   ├── networking/        # VPC, subnet, IGW, security group
│   └── compute/           # EC2, Elastic IP, IAM (SSM)
├── scripts/
│   ├── init-state-bucket.sh  # Create state backend
│   ├── deploy.sh             # Deploy app updates
│   └── user-data.sh          # EC2 bootstrap (first boot)
├── Caddyfile              # Caddy reverse proxy config
├── docker-compose.prod.yml   # Production overrides
└── README.md              # This file
```

## Migration path

When traffic outgrows a single EC2 instance, migrate to Option A (ECS Fargate, ~$60-95/mo).
See `infrastructure.md` for the full migration plan.
