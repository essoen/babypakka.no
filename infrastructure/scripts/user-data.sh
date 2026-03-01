#!/bin/bash
set -euo pipefail

# =============================================================================
# EC2 Bootstrap Script — Amazon Linux 2023 (ARM64 / aarch64)
# Installs Docker, Docker Compose, clones repo, and starts the application.
#
# This file is processed by Terraform templatefile(). Use $${} to escape
# shell variables and $() subshells from Terraform interpolation.
# =============================================================================

exec > >(tee /var/log/user-data.log) 2>&1
echo "=== Starting user-data bootstrap at $$(date) ==="

# -----------------------------------------------------------------------------
# 1. Update system packages
# -----------------------------------------------------------------------------
dnf update -y

# -----------------------------------------------------------------------------
# 2. Install Docker
# -----------------------------------------------------------------------------
dnf install -y docker git
systemctl enable docker
systemctl start docker

# -----------------------------------------------------------------------------
# 3. Install Docker Compose plugin (ARM64)
# -----------------------------------------------------------------------------
mkdir -p /usr/local/lib/docker/cli-plugins
curl -SL "https://github.com/docker/compose/releases/latest/download/docker-compose-linux-aarch64" \
  -o /usr/local/lib/docker/cli-plugins/docker-compose
chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

# Verify installation
docker compose version

# -----------------------------------------------------------------------------
# 4. Add ec2-user to docker group
# -----------------------------------------------------------------------------
usermod -aG docker ec2-user

# -----------------------------------------------------------------------------
# 5. Clone repository
# -----------------------------------------------------------------------------
cd /home/ec2-user
git clone ${git_repo_url} app
chown -R ec2-user:ec2-user app

# -----------------------------------------------------------------------------
# 6. Write Caddyfile with the configured domain
# -----------------------------------------------------------------------------
cat > /home/ec2-user/app/infrastructure/Caddyfile <<'CADDYEOF'
${domain_name} {
    handle /api/* {
        reverse_proxy backend:8080
    }
    handle /health {
        reverse_proxy backend:8080
    }
    handle {
        reverse_proxy frontend:3000
    }
}
CADDYEOF
chown ec2-user:ec2-user /home/ec2-user/app/infrastructure/Caddyfile

# -----------------------------------------------------------------------------
# 7. Start application with Docker Compose
# -----------------------------------------------------------------------------
cd /home/ec2-user/app
docker compose -f docker-compose.yml -f infrastructure/docker-compose.prod.yml up -d --build

echo "=== Bootstrap complete at $$(date) ==="
