#!/bin/bash
set -euo pipefail

# =============================================================================
# Deploy Script — Pull latest code and rebuild on EC2
# Usage: ./deploy.sh [ec2-ip]
#
# If no IP is provided, reads it from Terraform output.
# =============================================================================

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
TF_DIR="$SCRIPT_DIR/../environments/prod"

if [ -n "${1:-}" ]; then
  EC2_IP="$1"
else
  echo "Reading EC2 IP from Terraform output..."
  EC2_IP=$(terraform -chdir="$TF_DIR" output -raw elastic_ip 2>/dev/null)
  if [ -z "$EC2_IP" ]; then
    echo "Error: Could not read elastic_ip from Terraform output."
    echo "Usage: $0 [ec2-ip]"
    exit 1
  fi
fi

echo "Deploying to $EC2_IP..."
echo "================================"

ssh -o StrictHostKeyChecking=accept-new "ec2-user@$EC2_IP" bash -s <<'REMOTE'
set -euo pipefail

cd /home/ec2-user/app

echo "Pulling latest code..."
git pull

echo "Rebuilding and restarting containers..."
docker compose -f docker-compose.yml -f infrastructure/docker-compose.prod.yml up -d --build

echo "Waiting for services to start..."
sleep 10

echo "Container status:"
docker compose -f docker-compose.yml -f infrastructure/docker-compose.prod.yml ps

echo "Deploy complete!"
REMOTE

echo "================================"
echo "Deploy to $EC2_IP finished."
echo "Site: $(terraform -chdir="$TF_DIR" output -raw app_url 2>/dev/null || echo "https://$EC2_IP")"
