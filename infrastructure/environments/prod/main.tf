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
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "babypakka"
      Environment = "prod"
      ManagedBy   = "terraform"
    }
  }
}

# =============================================================================
# Networking — VPC, Subnet, IGW, Security Group
# =============================================================================

module "networking" {
  source = "../../modules/networking"

  project_name       = "babypakka"
  environment        = "prod"
  vpc_cidr           = "10.0.0.0/16"
  public_subnet_cidr = "10.0.1.0/24"
  availability_zone  = "${var.aws_region}a"
  allowed_ssh_cidrs  = var.allowed_ssh_cidrs
}

# =============================================================================
# Compute — EC2, Elastic IP, IAM
# =============================================================================

module "compute" {
  source = "../../modules/compute"

  project_name      = "babypakka"
  environment       = "prod"
  instance_type     = var.instance_type
  key_pair_name     = var.key_pair_name
  subnet_id         = module.networking.public_subnet_id
  security_group_id = module.networking.security_group_id
  root_volume_size  = 20
  git_repo_url      = var.git_repo_url
  domain_name       = var.domain_name
}
