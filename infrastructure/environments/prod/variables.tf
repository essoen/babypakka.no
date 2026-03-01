variable "aws_region" {
  description = "AWS region to deploy resources in"
  type        = string
  default     = "eu-north-1"
}

variable "key_pair_name" {
  description = "Name of the SSH key pair for the EC2 instance (must already exist in AWS)"
  type        = string
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t4g.small"
}

variable "domain_name" {
  description = "Domain name for the application"
  type        = string
  default     = "babypakka.no"
}

variable "git_repo_url" {
  description = "Git repository URL to clone on the EC2 instance"
  type        = string
}

variable "allowed_ssh_cidrs" {
  description = "CIDR blocks allowed to SSH into the EC2 instance"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}
