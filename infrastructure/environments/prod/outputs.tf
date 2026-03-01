output "elastic_ip" {
  description = "Elastic IP address — point your domain's A record here"
  value       = module.compute.elastic_ip
}

output "instance_id" {
  description = "EC2 instance ID"
  value       = module.compute.instance_id
}

output "ssh_command" {
  description = "SSH command to connect to the EC2 instance"
  value       = "ssh ec2-user@${module.compute.elastic_ip}"
}

output "ssm_command" {
  description = "SSM Session Manager command (alternative to SSH)"
  value       = "aws ssm start-session --target ${module.compute.instance_id} --region ${var.aws_region}"
}

output "app_url" {
  description = "Application URL (after DNS is configured)"
  value       = "https://${var.domain_name}"
}
