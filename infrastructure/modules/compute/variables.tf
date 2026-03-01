variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
}

variable "environment" {
  description = "Environment name (e.g., prod, staging)"
  type        = string
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t4g.small"
}

variable "key_pair_name" {
  description = "Name of the SSH key pair to use for the EC2 instance"
  type        = string
}

variable "subnet_id" {
  description = "ID of the subnet to launch the EC2 instance in"
  type        = string
}

variable "security_group_id" {
  description = "ID of the security group for the EC2 instance"
  type        = string
}

variable "root_volume_size" {
  description = "Size of the root EBS volume in GB"
  type        = number
  default     = 20
}

variable "git_repo_url" {
  description = "Git repository URL to clone on the EC2 instance"
  type        = string
}

variable "domain_name" {
  description = "Domain name for Caddy SSL configuration"
  type        = string
}
