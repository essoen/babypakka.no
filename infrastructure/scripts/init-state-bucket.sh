#!/bin/bash
set -euo pipefail

# =============================================================================
# Initialize Terraform State Backend
# Creates S3 bucket and DynamoDB table for Terraform state locking.
# Checks if resources already exist before creating them.
# =============================================================================

BUCKET_NAME="babypakka-terraform-state"
TABLE_NAME="babypakka-terraform-locks"
REGION="eu-north-1"

echo "Initializing Terraform state backend in $REGION..."
echo "  S3 Bucket:      $BUCKET_NAME"
echo "  DynamoDB Table:  $TABLE_NAME"
echo ""

# -----------------------------------------------------------------------------
# S3 Bucket
# -----------------------------------------------------------------------------
if aws s3api head-bucket --bucket "$BUCKET_NAME" --region "$REGION" 2>/dev/null; then
  echo "S3 bucket '$BUCKET_NAME' already exists. Skipping."
else
  echo "Creating S3 bucket '$BUCKET_NAME'..."
  aws s3api create-bucket \
    --bucket "$BUCKET_NAME" \
    --region "$REGION" \
    --create-bucket-configuration LocationConstraint="$REGION"

  echo "Enabling versioning..."
  aws s3api put-bucket-versioning \
    --bucket "$BUCKET_NAME" \
    --versioning-configuration Status=Enabled

  echo "Enabling server-side encryption..."
  aws s3api put-bucket-encryption \
    --bucket "$BUCKET_NAME" \
    --server-side-encryption-configuration '{
      "Rules": [{
        "ApplyServerSideEncryptionByDefault": {
          "SSEAlgorithm": "AES256"
        },
        "BucketKeyEnabled": true
      }]
    }'

  echo "Blocking public access..."
  aws s3api put-public-access-block \
    --bucket "$BUCKET_NAME" \
    --public-access-block-configuration \
      "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"

  echo "S3 bucket created."
fi

# -----------------------------------------------------------------------------
# DynamoDB Table
# -----------------------------------------------------------------------------
if aws dynamodb describe-table --table-name "$TABLE_NAME" --region "$REGION" 2>/dev/null | grep -q "ACTIVE"; then
  echo "DynamoDB table '$TABLE_NAME' already exists. Skipping."
else
  echo "Creating DynamoDB table '$TABLE_NAME'..."
  aws dynamodb create-table \
    --table-name "$TABLE_NAME" \
    --attribute-definitions AttributeName=LockID,AttributeType=S \
    --key-schema AttributeName=LockID,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --region "$REGION" \
    --tags Key=Project,Value=babypakka Key=Environment,Value=prod Key=ManagedBy,Value=terraform

  echo "Waiting for table to become active..."
  aws dynamodb wait table-exists --table-name "$TABLE_NAME" --region "$REGION"

  echo "DynamoDB table created."
fi

echo ""
echo "Terraform state backend is ready."
echo "Run 'terraform init' in infrastructure/environments/prod/ to configure the backend."
